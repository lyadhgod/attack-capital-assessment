'use server';

import logger from "@/logger";
import { NextRequest } from "next/server";
import { z } from "zod";

const postParamsSchema = z.object({
    callSid: z.string(),
    accountSid: z.string(),
    from: z.string(),
    to: z.string(),
    callStatus: z.enum(['queued', 'initiated', 'ringing', 'in-progress', 'completed', 'busy', 'failed', 'no-answer']),
    apiVersion: z.string(),
    direction: z.enum(['inbound', 'outbound-api', 'outbound-dial']),
    forwardedFrom: z.string().nullable(),
    callerName: z.string().nullable(),
    parentCallSid: z.string().nullable(),
});

export async function POST(req: NextRequest) {
    const params = {
        callSid: req.nextUrl.searchParams.get("CallSid"),
        accountSid: req.nextUrl.searchParams.get("AccountSid"),
        from: req.nextUrl.searchParams.get("From"),
        to: req.nextUrl.searchParams.get("To"),
        callStatus: req.nextUrl.searchParams.get("CallStatus"),
        apiVersion: req.nextUrl.searchParams.get("ApiVersion"),
        direction: req.nextUrl.searchParams.get("Direction"),
        forwardedFrom: req.nextUrl.searchParams.get("ForwardedFrom"),
        callerName: req.nextUrl.searchParams.get("CallerName"),
        parentCallSid: req.nextUrl.searchParams.get("ParentCallSid"),
    };

    try {
        const parsedParams = postParamsSchema.parse(params);
        logger('info', "Valid parameters received in /webhook/twilio/voice/status:", parsedParams);

        
    } catch (error) {
        logger('error', "Invalid parameters received in /webhook/twilio/voice/status:", error);
        return new Response("Bad Request", { status: 400 });
    }
}
