

import { RABBITMQ_URL } from "@/env/server";
import { StructuredCloneable } from "@/types";
import amqplib, { ChannelModel, Channel, ConsumeMessage } from "amqplib";

export type Queue = 'twilio/voice/status'
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
    if (!config.channelPublish) throw new Error("RabbitMQ publish channel is not configured");

    await config.channelPublish.assertQueue(name);
    await config.channelPublish.sendToQueue(name, Buffer.from(JSON.stringify(payload)));
}

export async function consumeOnce<T extends StructuredCloneable>(
    name: Queue,
    filter: (payload: T) => boolean
) {
    await configure();
    if (!config.channelConsume) throw new Error("RabbitMQ consume channel is not configured");

    await config.channelConsume.assertQueue(name);
    
    return new Promise<T>(async (resolve) => {
        const state = {
            consumerTag: undefined as string | undefined,
            msg: undefined as ConsumeMessage | undefined,
            filteredPayload: undefined as T | undefined,
        };

        const finalResolve = () => {
            if (
                state.msg === undefined ||
                state.consumerTag === undefined ||
                state.filteredPayload === undefined
            ) return;

            if (config.channelConsume) {
                config.channelConsume.ack(state.msg);
                if (state.consumerTag) {
                    config.channelConsume.cancel(state.consumerTag);
                }
            }

            resolve(state.filteredPayload);
        }
        
        const consumeResult = await config.channelConsume!.consume(name, (msg) => {
            if (!msg) return;

            const payload = JSON.parse(msg.content.toString()) as T;
            if (!filter(payload)) return;

            state.msg = msg;
            state.filteredPayload = payload;
            
            finalResolve();
        });
        
        state.consumerTag = consumeResult.consumerTag;
        finalResolve();
    });
}
