"use client"
import { createContext, useContext, useEffect, useRef, useState } from "react"

const WebSocketContext = createContext<any>(null);

export const WebSocketProvider = ({
    children,
    user,
}: {
    children: React.ReactNode,
    user: any
}) => {
    const wsRef = useRef<WebSocket | null>(null);
    const [unreadCount, setUnreadCount] = useState<Record<string, number>>({});

    useEffect(() => {
        if (!user?.id) return;

        const ws = new WebSocket(process.env.NEXT_PUBLIC_CHATTING_WEBSOCKET_URI!);
        wsRef.current = ws;

        ws.onopen = () => {
            ws.send(`user_${user.id}`);
        }

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === "UNSEEN_COUNT_UPDATE") {
                const { conversationId, count } = data.payload;
                setUnreadCount((prev) => ({
                    ...prev,
                    [conversationId]: count,
                }));
            }

            return () => {
                ws.close();
            }
        }

    }, [user.id]);

    return (
        <WebSocketContext.Provider value={{ ws: wsRef.current, unreadCount }}>
            {children}
        </WebSocketContext.Provider>
    );
}

export const useWebSocket = () => useContext(WebSocketContext);