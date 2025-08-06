import { kafka } from '@packages/utils/kafka';
import { clients } from "./main"

const consumer = kafka.consumer({ groupId: "log-events-group" });
const logQueue: string[] = [];

// websocket processing function for logs
const porcessLogs = () => {
    if (logQueue.length === 0) return;

    console.log(`Processing ${logQueue.length} logs in batch`);
    const logs = [...logQueue];
    logQueue.length = 0;

    // send logs to all connected websocket clients
    clients.forEach((client) => {
        logs.forEach((log) => {
            client.send(log);
        });
    });
}

setInterval(porcessLogs, 3000);

// consume log messages from Kafka
export const consumeKafkaMessages = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: "logs", fromBeginning: false });

    await consumer.run({
        eachMessage: async ({ message }) => {
            if (!message.value) return;
            const log = message.value.toString();
            logQueue.push(log);
        }
    });
}

// start kafka consumer
consumeKafkaMessages().catch(console.error);