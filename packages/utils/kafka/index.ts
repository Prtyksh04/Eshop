import { Kafka } from "kafkajs";

export const kafka = new Kafka({
  clientId: "kafka-service",
  brokers: ["pkc-p11xm.us-east-1.aws.confluent.cloud:9092"],
  ssl: { rejectUnauthorized: false },
  sasl: {
    mechanism: "plain",
    username: process.env.KAFKA_API_KEY!,
    password: process.env.KAFKA_API_SECRET!,
  },
  connectionTimeout: 30000,  // ⏱️ increase to 30 seconds (default is 1000ms)
  requestTimeout: 30000, 
});
