'use server';

import {
    call as twilioCall,
    hangup as twilioHangup
} from '@/integrations/twilio';

export async function call(to: string) {
    return twilioCall(to);
}

export async function hangup(callSid: string) {
    return twilioHangup(callSid);
}
