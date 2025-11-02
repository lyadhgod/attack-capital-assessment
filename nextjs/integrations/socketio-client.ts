'use client';

import { NEXT_PUBLIC_FLASK_WEBSOCKET_URL } from "@/env/client";
import { io } from "socket.io-client";

const socket = io(NEXT_PUBLIC_FLASK_WEBSOCKET_URL, {
  transports: ["websocket"],
});

export default socket;

socket.on("connect", () => {
    console.log("Connected to server with id:", socket.id);
});
