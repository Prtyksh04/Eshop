import { kafka } from "@packages/utils/kafka";
import { WebSocketServer, WebSocket } from "ws";
import redis from "@packages/redis";
import { Server as HttpServer } from "http";

const producer = kafka.producer();
const connectedUser: Map<string, WebSocket> = new Map();
const unseenCounts: Map<string, number> = new Map();

type IncomingMessage = {
    type?: string;
    fromUserId: string;
    toUserId: string;
    messageBody: string;
    conversationId: string;
    senderType: string;
}

export async function createWebSocketServer(server: HttpServer) {
    const wss = new WebSocketServer({ server });

    await producer.connect();
    console.log("Kafka producer connected");

    wss.on("connection", (ws: WebSocket) => {
        console.log("New websocket connection");

        let registeredUserId: string | null = null;

        ws.on("message", async (rawMessage: Buffer | string) => {
            try {
                const messageStr = rawMessage.toString();

                // Register the user on first plain message (non - JSON)
                if (!registeredUserId && !messageStr.startsWith("{")) {
                    registeredUserId = messageStr;
                    connectedUser.set(registeredUserId, ws);
                    console.log(`registered websocket for userId: ${registeredUserId}`);

                    const isSeller = registeredUserId.startsWith("seller_");
                    const redisKey = isSeller ? `online:seller:${registeredUserId.replace("seller_", "")}` : `online:user:${registeredUserId}`

                    await redis.set(redisKey, "1");
                    await redis.expire(redisKey, 300);
                    return;
                }

                //process the json message
                const data: IncomingMessage = JSON.parse(messageStr);

                // if it's seen update
                if (data.type === "MARK_AS_SEEN" && registeredUserId) {
                    const seenKey = `${registeredUserId}_${data.conversationId}`;
                    unseenCounts.set(seenKey, 0);
                    return;
                }

                //regular message
                const { fromUserId, toUserId, messageBody, conversationId, senderType } = data;

                if (!data || !toUserId || !messageBody || !conversationId) {
                    console.log("Invalid message format :", data);
                    return;
                }

                const now = new Date().toISOString();

                const messagePayload = {
                    conversationId,
                    senderId: fromUserId,
                    senderType,
                    content: messageBody,
                    createdAt: now,
                }

                const messageEvent = JSON.stringify({
                    type: "NEW_MESSAGE",
                    payload: messagePayload,
                });

                const receiverKey = senderType === "user" ? `seller_${toUserId}` : `user_${toUserId}`;
                const senderKey = senderType === "user" ? `user_${fromUserId}` : `seller_${fromUserId}`;

                //update unseen count dynamically
                const unseenKey = `${receiverKey}_${conversationId}`;
                const prevCount = unseenCounts.get(unseenKey) || 0;
                unseenCounts.set(unseenKey, prevCount + 1);

                // send new message to receiver
                const receiverSocket = connectedUser.get(receiverKey);
                if (receiverSocket && receiverSocket.readyState === WebSocket.OPEN) {
                    receiverSocket.send(messageEvent);

                    // also notify unseen count 
                    receiverSocket.send(
                        JSON.stringify({
                            type: "UNSEEN_COUNT_UPDATE",
                            payload: {
                                conversationId,
                                unseenCount: prevCount + 1,
                            }
                        })
                    )

                    console.log(`Delivered message to + useen count to ${receiverKey}`);
                } else {
                    console.log(`User ${receiverKey} is offline. Message queued.`);
                }

                // echo to sender
                const senderSocket = connectedUser.get(senderKey);
                if (senderSocket && senderSocket.readyState === WebSocket.OPEN) {
                    senderSocket.send(messageEvent);
                    console.log(`Echoed message to sender ${senderKey}`);
                }

                //push to kafka consumer
                await producer.send({
                    topic: "chat.new_message",
                    messages: [
                        {
                            key: conversationId,
                            value: JSON.stringify(messagePayload)
                        }
                    ]
                });

                console.log(`message queued to kafka ${conversationId}`);

            } catch (error) {
                console.log("Error processing WebSocket message :", error);
            }
        })

        ws.on('close', async () => {
            if (registeredUserId) {
                connectedUser.delete(registeredUserId);
                console.log(`Disconnected this user ${registeredUserId}`);
                const isSeller = registeredUserId.startsWith("seller_");
                const redisKey = isSeller ? `online:seller:${registeredUserId.replace("seller_", "")}` : `online:user:${registeredUserId}`;
                await redis.del(redisKey);
            }
        });

        ws.on('error', async (error) => {
            console.log("WebSocket error:", error);
        });
    });

    console.log("Websocket server is ready");
}