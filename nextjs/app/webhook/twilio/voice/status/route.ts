

import logger from "@/logger";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import querystring from 'querystring';
import { publish } from "@/integrations/rabbitmq";
import { EnsureStructuredCloneable, EventEmitterEvent, WebhookTwilioVoiceStatusEvent, WebhookTwilioVoiceStatusParams } from "@/types";
import events from "@/events";

const postParamsSchema = z.looseObject({
    callSid: z.string(),
    callStatus: z.enum(['queued', 'initiated', 'ringing', 'in-progress', 'completed', 'busy', 'failed', 'no-answer']),
}).catchall(z.unknown());

export async function POST(req: NextRequest) {
    try {
        const text = await req.text();
        const params = querystring.parse(text);
        const parsedParams = postParamsSchema.parse({
            callSid: params.CallSid,
            callStatus: params.CallStatus,
        }) as EnsureStructuredCloneable<WebhookTwilioVoiceStatusParams>;
        logger('info', "Valid parameters received in /webhook/twilio/voice/status:", parsedParams);

        publish('twilio/voice/status', parsedParams);

        const searchParams = req.nextUrl.searchParams;
        const socketId = searchParams.get('socketId');
        console.log("Socket ID from query params:", socketId);
        events.emit("webhook:twilio/voice/status" as EventEmitterEvent, {
            event: "webhook:twilio/voice/status",
            data: parsedParams,
            socketId: socketId,
        } as WebhookTwilioVoiceStatusEvent);
    } catch (error) {
        logger('error', "Invalid parameters received in /webhook/twilio/voice/status:", error);
    }

    return new NextResponse(null, { status: 200 });
}
