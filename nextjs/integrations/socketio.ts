import http from "http";
import { Server, Socket } from 'socket.io';
import events from "@/events";
import { EventEmitterEvent,  } from "@/types";

const clients = new Map<string, Socket>();
    
export default function socketio(server: http.Server) {
    const io = new Server(server);

    io.on("connection", (socket) => {
        clients.set(socket.id, socket);

        socket.on("disconnect", () => {
            clients.delete(socket.id);
        });
    });
}

function forwardWebhook(event: EventEmitterEvent) {
    events.on(event, (data) => {
        if (clients.has(data.socketId)) {
            clients.get(data.socketId)!.emit(data.event, data);
        }
    });
}

forwardWebhook("webhook:twilio/voice/status");
forwardWebhook("webhook:twilio/voice/amd");

