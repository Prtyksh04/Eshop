"use server"
import { kafka } from "../../../../packages/utils/kafka";


const producer = kafka.producer();

export async function sendKafkaEvent(eventData: {
    userId?: string;
    productId?: string;
    shopId?: string;
    action: string;
    device?: string;
    country?: string;
    city?: string;
}) {
    try {
        await producer.connect();
        console.log("📤 Sending Kafka Event:", eventData); // ✅ add this
        await producer.send({
            topic: 'user_events',
            messages: [{ value: JSON.stringify(eventData) }],
        })
         console.log("✅ Kafka Event Sent Successfully");
    } catch (error) {
        console.log(error);
    } finally {
        await producer.disconnect();
    }
}