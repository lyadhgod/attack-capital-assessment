'use server';

import { publish } from "@/integrations/rabbitmq";
import logger from "@/logger";
import { EnsureStructuredCloneable, WebhookTwilioVoiceAmdParams } from "@/types";
import querystring from 'querystring';
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const postParamsSchema = z.looseObject({
    callSid: z.string(),
    answeredBy: z.enum(['machine_start', 'human', 'fax', 'unknown']),
});

export async function POST(req: NextRequest) {
    try {
        const text = await req.text();
        const params = querystring.parse(text);
        const parsedParams = postParamsSchema.parse({
            callSid: params.CallSid,
            answeredBy: params.AnsweredBy,
        }) as EnsureStructuredCloneable<WebhookTwilioVoiceAmdParams>;
        logger('info', "Webhook received at /webhook/twilio/voice/amd with params:", parsedParams);

        publish('twilio/voice/amd', parsedParams);
    } catch (error) {
        logger('error', "Webhook failed at /webhook/twilio/voice/amd:", error);
    }

    return new NextResponse(null, { status: 200 });
}
