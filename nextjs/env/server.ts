export const NODE_ENV = process.env.NODE_ENV ?? 'development';

export const BASE_URL = (process.env.BASE_URL ?? '').replace(/\/$/, '');

export const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID ?? '';
export const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN ?? '';
export const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER ?? '';

export const RABBITMQ_USER = process.env.RABBITMQ_USER ?? '';
export const RABBITMQ_PASSWORD = process.env.RABBITMQ_PASSWORD ?? '';
export const RABBITMQ_DOMAIN = process.env.RABBITMQ_DOMAIN ?? '';
export const RABBITMQ_PORT = process.env.RABBITMQ_PORT ?? '';
export const RABBITMQ_URL = process.env.RABBITMQ_URL ?? ''.replace(/\/$/, '');

export const POSTGRES_USER = process.env.POSTGRES_USER ?? '';
export const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD ?? '';
export const POSTGRES_DB = process.env.POSTGRES_DB ?? '';
export const POSTGRES_DOMAIN = process.env.POSTGRES_DOMAIN ?? '';
export const POSTGRES_PORT = process.env.POSTGRES_PORT ?? '';
export const POSTGRES_URL = process.env.POSTGRES_URL ?? ''.replace(/\/$/, '');

export const BETTER_AUTH_SECRET = process.env.BETTER_AUTH_SECRET ?? '';
export const BETTER_AUTH_URL = (process.env.BETTER_AUTH_URL ?? BASE_URL).replace(/\/$/, '');
