

import { BASE_URL, TWILIO_PHONE_NUMBER } from '@/env/server';
import logger from '@/logger';
import twilio from 'twilio';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export async function call(to: string, socketId: string) {
    try {
        const call = await client.calls.create({
            to,
            from: TWILIO_PHONE_NUMBER,
            twiml: '<Response><Pause length="10"/><Hangup/></Response>',
            machineDetection: 'Enable',
            asyncAmd: 'true',
            asyncAmdStatusCallback: `${BASE_URL}/webhook/twilio/voice/amd?socketId=${socketId}`,
            statusCallback: `${BASE_URL}/webhook/twilio/voice/status?socketId=${socketId}`,
        });
        logger('info', 'Twilio call initiated', {
            to,
            callSid: call.sid
        });

        return { callSid: call.sid };
    } catch (error) {
        logger('error', 'Twilio call failed', {
            to,
            error
        });
        throw error;
    }
}

export async function hangup(callSid: string) {
    try {
        await client.calls(callSid).update({
            twiml: '<Response><Hangup/></Response>'
        });
        logger('info', 'Twilio call hung up', {
            callSid
        });
    } catch (error) {
        logger('error', 'Twilio call hang up failed', {
            callSid,
            error
        });
        throw error;
    }
}
