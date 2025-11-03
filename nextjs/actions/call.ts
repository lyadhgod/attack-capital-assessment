'use server';

import { TWILIO_PHONE_NUMBER } from '@/env/server';
import prisma from '@/integrations/prisma';
import { consumeOnce, Queue } from '@/integrations/rabbitmq';
import { call as twilioCall, hangup as twilioHangup } from '@/integrations/twilio';
import logger from '@/logger';
import { ActionState, EnsureStructuredCloneable, WebhookTwilioVoiceAmdParams, WebhookTwilioVoiceStatusParams } from '@/types';

export interface CallResult {
    id: string;
    human: boolean;
}

export type CallProvider = 'twilio';

export async function call(_prev: ActionState<EnsureStructuredCloneable<CallResult>, null>, formData: FormData): Promise<ActionState<EnsureStructuredCloneable<CallResult>, null>> {
    const to = formData.get('to') as string;
    const userId = formData.get('userId') as string;
    const socketId = formData.get('socketId') as string;

    try {
        const { callSid } = await twilioCall(to, socketId);

        const keyedConsumer = async (key: Queue) => new Promise(async (
            resolve: (result:
                { key: 'twilio/voice/amd', payload: EnsureStructuredCloneable<WebhookTwilioVoiceAmdParams> } |
                { key: 'twilio/voice/status', payload: EnsureStructuredCloneable<WebhookTwilioVoiceStatusParams> }
            ) => void,
            reject: (reason: { key: Queue, reason: any }) => void
        ) => {
            try {
                switch (key) {
                    case 'twilio/voice/amd':
                        return resolve({
                            key,
                            payload: await consumeOnce<EnsureStructuredCloneable<WebhookTwilioVoiceAmdParams>>(
                                key,
                                (payload) => payload.callSid === callSid
                            )
                        });
                    case 'twilio/voice/status':
                        return resolve({
                            key,
                            payload: await consumeOnce<EnsureStructuredCloneable<WebhookTwilioVoiceStatusParams>>(
                                key,
                                (payload) => payload.callSid === callSid && payload.callStatus === 'completed'
                            )
                        });
                }
            } catch (error) {
                reject({ key, reason: error });
            }
        });

        const consumed = await Promise.any([
            keyedConsumer('twilio/voice/amd'),
            keyedConsumer('twilio/voice/status'),
        ]);

        switch (consumed.key) {
            case 'twilio/voice/status':
                if (consumed.payload.callStatus === 'completed') {
                    await prisma.callLog.create({
                        data: {
                            callSid,
                            to,
                            from: TWILIO_PHONE_NUMBER,
                            answeredBy: 'unknown',
                            userId,
                        }
                    });
                }
                break;
            case 'twilio/voice/amd':
                if (consumed.payload.answeredBy !== 'human') {
                    const formData = new FormData();
                    formData.append('callSid', callSid);
                    formData.append('to', to);
                    formData.append('userId', userId);
                    formData.append('answeredBy', consumed.payload.answeredBy);
                    await hangup({ status: 'idle' }, formData);
                }
                break;
        }
        logger('info', "Call action completed for callSid:", callSid);

        return {
            status: 'success',
            data: {
                id: callSid,
                human: consumed.key === 'twilio/voice/amd' && consumed.payload.answeredBy === 'human',
            },
        }
    } catch (error) {
        logger('error', "Error in call action:", error);
        return { status: 'error' };
    }
}

export async function hangup(_prev: ActionState<null, null>, formData: FormData): Promise<ActionState<null, null>> {
    const callSid = formData.get('callSid') as string;
    const to = formData.get('to') as string;
    const userId = formData.get('userId') as string;
    const answeredBy = formData.get('answeredBy') as string;
    
    try {
        await twilioHangup(callSid);
        await prisma.callLog.create({
            data: {
                callSid,
                to,
                from: TWILIO_PHONE_NUMBER,
                answeredBy,
                userId,
            }
        });

        logger('info', "Hangup action completed for callSid:", callSid);

        return { status: 'success' }
    } catch (error) {
        logger('error', "Error in hangup action:", error);
        return { status: 'error' };
    }
}
