'use client';

export const NEXT_PUBLIC_FLASK_BASE_URL = (process.env.NEXT_PUBLIC_FLASK_BASE_URL ?? '').replace(/\/$/, '');
export const NEXT_PUBLIC_FLASK_WEBSOCKET_NAMESPACE = process.env.NEXT_PUBLIC_FLASK_WEBSOCKET_NAMESPACE ?? '';
export const NEXT_PUBLIC_FLASK_WEBSOCKET_URL = (process.env.NEXT_PUBLIC_FLASK_WEBSOCKET_URL ?? '').replace(/\/$/, '');
