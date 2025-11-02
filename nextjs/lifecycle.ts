

import { configure as rabbitMQStartup, reset as rabbitMQShutdown } from "@/integrations/rabbitmq";

export async function startup() {
    await rabbitMQStartup();
}

export async function shutdown() {
    await rabbitMQShutdown();
}
