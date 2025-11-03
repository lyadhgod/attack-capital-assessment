'use client';

import logger from "@/logger";
import { io } from "socket.io-client";

const socket = io('/', { transports: ['websocket'], upgrade: false });

export default socket;

socket.on("connect", () => {
    logger('info', "Connected to server with id:", socket.id);
});

socket.on("webhook:twilio/voice/status", (data) => {
    logger('info', "Received Twilio voice status webhook via Socket.io:", data);
});

socket.on("webhook:twilio/voice/amd", (data) => {
    logger('info', "Received Twilio voice AMD webhook via Socket.io:", data);
});

