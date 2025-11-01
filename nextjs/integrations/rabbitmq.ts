'use server';

import { RABBITMQ_URL } from "@/env/server";
import { StructuredCloneable } from "@/types";
import amqplib, { ChannelModel, Channel } from "amqplib";

type Queue = 'twilio/voice/status'
| 'twilio/voice/amd';

const config: {
    connection?: ChannelModel;
    channelPublish?: Channel;
    channelConsume?: Channel;
} = {};

export async function configure() {
  if (!config.connection) {
    config.connection = await amqplib.connect(RABBITMQ_URL);
    config.connection.on("close", () => {
        delete config.connection;
        delete config.channelPublish;
        delete config.channelConsume;
    });
  }

  if (!config.channelPublish) {
    config.channelPublish = await config.connection.createChannel();
    config.channelPublish.on("close", () => {
        delete config.channelPublish;
    });
  }

  if (!config.channelConsume) {
    config.channelConsume = await config.connection.createChannel();
    config.channelConsume.on("close", () => {
        delete config.channelConsume;
    });
  }
}

export async function reset() {
    if (config.channelPublish) {
        await config.channelPublish.close();
        delete config.channelPublish;
    }

    if (config.channelConsume) {
        await config.channelConsume.close();
        delete config.channelConsume;
    }

    if (config.connection) {
        await config.connection.close();
        delete config.connection;
    }
}

export async function publish<T extends StructuredCloneable>(
    name: Queue,
    payload: T
) {
    await configure();
    if (!config.channelPublish) return;

    await config.channelPublish.assertQueue(name);
    await config.channelPublish.sendToQueue(name, Buffer.from(JSON.stringify(payload)));
}

export async function consumeOnce<T extends StructuredCloneable>(
    name: Queue,
    filter: (payload: T) => boolean
) {
    await configure();
    if (!config.channelConsume) return;

    await config.channelConsume.assertQueue(name);
    const promise = new Promise<T>(async (resolve) => {
        await config.channelConsume!.consume(name, (msg) => {
            if (!msg) return;

            const payload = JSON.parse(msg.content.toString()) as T;
            if (!filter(payload)) return;
                
            if (!config.channelConsume) return;
            config.channelConsume.ack(msg);

            resolve(payload);
        });
    });

    return promise;
}
