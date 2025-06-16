import { kafka } from '@packages/utils/kafka'
import { updateUserAnalytics } from './services/analyticsService';

const consumer = kafka.consumer({ groupId: 'user-events-group' });

const eventQueue: any[] = [];

const processQueue = async () => {
  if (eventQueue.length === 0) return;

  const events = [...eventQueue];
  eventQueue.length = 0;

  for (const event of events) {
    if (event.action === 'shop_visit') {
      // update the shop analytics
    }
    console.log("📦 Processing", events.length, "event(s)");


    const validActions = [
      'add_to_wishlist',
      'add_to_cart',
      'product_view',
      'remove_from_cart',
      'remove_from_wishlist',
    ];

    if (!event.action || !validActions.includes(event.action)) {
      continue;
    }
    try {
      await updateUserAnalytics(event);
    } catch (error) {
      console.log("Error processing Event :", error);
    }
  }
}

setInterval(processQueue, 3000);


// kafka consumer for user events
export const consumeKafkaMessages = async () => {
  // connect to the kafka broker
  await consumer.connect();
  await consumer.subscribe({ topic: "user_events", fromBeginning: false })

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;
      const event = JSON.parse(message.value.toString());
      console.log("📥 Received Kafka Event:", event); 
      eventQueue.push(event);
    }
  })
}

consumeKafkaMessages().catch(console.error);