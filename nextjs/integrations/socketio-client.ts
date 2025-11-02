'use client';

import { io } from "socket.io-client";

const socket = io('/', { transports: ['websocket'], upgrade: false });

export default socket;

socket.on("connect", () => {
    console.log("Connected to server with id:", socket.id);
});
