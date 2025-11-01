import { NODE_ENV } from "@/env/server";

export default function logger(
    level: 'debug' | 'info' | 'warn' | 'error',
    msg: string,
    payload: any
) {
    if (NODE_ENV !== 'development') return;
    
    switch (level) {
        case 'debug':
            console.debug(`[DEBUG]: ${msg}`, payload);
            break;
        case 'info':
            console.info(`[INFO]: ${msg}`, payload);
            break;
        case 'warn':
            console.warn(`[WARN]: ${msg}`, payload);
            break;
        case 'error':
            console.error(`[ERROR]: ${msg}`, payload);
            break;
    }
}
