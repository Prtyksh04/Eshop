"use server"
import { kafka } from "../../../../packages/utils/kafka";


const producer = kafka.producer();

export async function sendKafkaEvent(eventData: {
    userId?: string;
    productId?: string;
    shop?: string;
    action: string;
    device?: string;
    country?: string;
    city?: string;
}) {
    try {
        await producer.connect();
        await producer.send({
            topic: 'user_events',
            messages: [{ value: JSON.stringify(eventData) }],
        })
    } catch (error) {
        console.log(error);
    } finally {
        await producer.disconnect();
    }
}