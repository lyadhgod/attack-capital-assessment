import { Twilio } from "twilio";

export type SerializablePrimitive = string | number | boolean | null;

export type AllowedLeaf = SerializablePrimitive | Date | RegExp;

export type EnsureStructuredCloneable<T> =
  T extends AllowedLeaf ? T :
  T extends Array<infer U> ? EnsureStructuredCloneable<U>[] :
  T extends object ? {
    [K in keyof T]:
      undefined extends T[K]
        ? EnsureStructuredCloneable<Exclude<T[K], undefined>> | undefined
        : EnsureStructuredCloneable<T[K]>
  } :
  never;

export type StructuredCloneable =
  | SerializablePrimitive
  | AllowedLeaf
  | StructuredCloneable[]
  | { [key: string]: StructuredCloneable };

export interface ActionState<T extends StructuredCloneable, R extends StructuredCloneable> {
    status: 'idle' | 'success' | 'error';
    data?: T;
    error?: R;
}

export interface WebhookTwilioVoiceAmdParams {
  callSid: string;
  answeredBy: TwilioVoiceAnsweredBy;
}

export interface WebhookTwilioVoiceStatusParams {
  callSid: string;
  callStatus: TwilioVoiceVoiceStatus;
}

export type TwilioVoiceAnsweredBy = 'machine_start' | 'human' | 'fax' | 'unknown';

export type TwilioVoiceVoiceStatus = 'queued' | 'initiated' | 'ringing' | 'in-progress' | 'completed' | 'busy' | 'failed' | 'no-answer';
