'use server';

import logger from "@/logger";
import { NextRequest } from "next/server";
import { z } from "zod";

const postParamsSchema = z.object({
    callSid: z.string(),
    accountSid: z.string(),
    answeredBy: z.enum(['machine_start', 'human', 'fax', 'unknown']),
    machineDetectionDuration: z.coerce.number(),
});

export async function POST(req: NextRequest) {
    const params = {
        callSid: req.nextUrl.searchParams.get("CallSid"),
        accountSid: req.nextUrl.searchParams.get("AccountSid"),
        answeredBy: req.nextUrl.searchParams.get("AnsweredBy"),
        machineDetectionDuration: req.nextUrl.searchParams.get("MachineDetectionDuration"),
    };

    try {
        const parsedParams = postParamsSchema.parse(params);
        logger('info', "Valid parameters received in /webhook/twilio/voice/amd:", parsedParams);

        
    } catch (error) {
        logger('error', "Invalid parameters received in /webhook/twilio/voice/amd:", error);
        return new Response("Bad Request", { status: 400 });
    }
}
