'use client'
import React, { useEffect, useRef, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from "next/navigation";
import Image from 'next/image';
import { Send, MessageSquare } from 'lucide-react';
import useSeller from 'apps/seller-ui/src/hooks/useSeller';
import { useWebSocket } from 'apps/seller-ui/src/context/web-socket-context';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from 'apps/seller-ui/src/utils/axiosInstance';

const ChatPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const messageContainerRef = useRef<HTMLDivElement | null>(null);
    const { seller } = useSeller();
    const conversationId = searchParams.get("conversationId");
    const { ws } = useWebSocket();
    const queryClient = useQueryClient();

    const [chats, setChats] = useState<any[]>([]);
    const [selectedChat, setSelectedChat] = useState<any | null>(null);
    const [message, setMessage] = useState("");
    const [hasFetchedOnce, setHasFetchedOnce] = useState(false);

    const { data: messages = [] } = useQuery({
        queryKey: ['messages', conversationId],
        queryFn: async () => {
            if (!conversationId || hasFetchedOnce) return [];

            const res = await axiosInstance.get(`/chatting/api/get-seller-messages/${conversationId}?page=1`);
            setHasFetchedOnce(true);
            return res.data.messages.reverse();

        },
        enabled: !!conversationId,
        staleTime: 2 * 60 * 1000,
    })

    useEffect(() => {
        if (!conversationId && messages.length === 0) return;
        const timeOut = setTimeout(scrollToBottom, 100);
        return () => clearTimeout(timeOut);
    }, [conversationId, messages.length]);

    const scrollToBottom = () => {
        requestAnimationFrame(() => {
            setTimeout(() => {
                const container = messageContainerRef.current;
                if (container) {
                    container.scrollTop = container.scrollHeight;
                }
            }, 50);
        });
    };

    const { data: conversations, isLoading } = useQuery({
        queryKey: ["conversations"],
        queryFn: async () => {
            const res = await axiosInstance.get("/chatting/api/get-seller-conversations");
            return res.data.conversations;
        }
    });

    useEffect(() => {
        if (conversations) setChats(conversations);
    }, [conversations]);

    useEffect(() => {
        if (!ws) return;

        ws.onmessage = (event: any) => {
            const data = JSON.parse(event.data);

            if (data.type === "NEW_MESSAGE") {
                const newMsg = data?.payload;

                if (newMsg.conversationId === conversationId) {
                    queryClient.setQueryData(['messages', conversationId], (old: any) => [...old, {
                        content: newMsg.messageBody || newMsg.content || "",
                        senderType: newMsg.senderType,
                        seen: false,
                        createdAt: newMsg.createdAt || new Date().toISOString(),
                    }]);
                    scrollToBottom();
                }

                setChats((prevChats) =>
                    prevChats.map((chat) =>
                        chat.conversationId === newMsg.conversationId
                            ? { ...chat, lastMessage: newMsg.content }
                            : chat
                    )
                )
            }

            if (data.type === "UNSEEN_COUNT_UPDATE") {
                const { conversationId, count } = data.payload;

                setChats((prevChats) =>
                    prevChats.map((chat) =>
                        chat.conversationId === conversationId ? { ...chat, unreadCount: count } : chat
                    )
                )
            }
        }
    }, [ws, conversationId]);

    useEffect(() => {
        if (conversationId && chats.length > 0) {
            const currentChat = chats.find((c: any) => c.conversationId === conversationId);
            if (currentChat) {
                setSelectedChat(currentChat);
            }
        }
    }, [conversationId, chats]);

    const handleChatSelect = (chat: any) => {
        setSelectedChat(chat);
        setHasFetchedOnce(false);
        setChats((prevChats) =>
            prevChats.map((c) =>
                c.conversationId === chat.conversationId ? { ...c, unreadCount: 0 } : c
            )
        )
        router.push(`?conversationId=${chat.conversationId}`)

        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                type: "MARK_AS_SEEN",
                conversationId: chat.conversationId,
            }));
        }
    };

    const handleSend = (e: any) => {
        e.preventDefault();

        if (!message.trim() || !selectedChat || !ws || ws.readyState !== WebSocket.OPEN) return;

        const payload = {
            fromUserId: seller.id,
            toUserId: selectedChat.user.id,
            messageBody: message,
            conversationId: selectedChat.conversationId,
            senderType: 'seller',
        }

        ws.send(JSON.stringify(payload));

        setMessage("");
        scrollToBottom();
    }

    return (
        <div className="w-full h-[calc(100vh-64px)] bg-slate-50 flex overflow-hidden">
            {/* Sidebar */}
            <div className="w-[320px] border-r border-slate-200 bg-white flex flex-col">
                <div className="p-4 border-b border-slate-200">
                    <h1 className="text-lg font-bold text-slate-800">Messages</h1>
                </div>
                <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                    {isLoading ? (
                        <div className="text-center py-8 text-slate-400 text-sm">
                            Loading conversations...
                        </div>
                    ) : chats.length === 0 ? (
                        <div className="text-center py-8 px-4">
                            <p className="text-slate-400 text-sm">No conversations available yet.</p>
                        </div>
                    ) : (
                        chats.map((chat) => {
                            const isActive = selectedChat?.conversationId === chat.conversationId;
                            return (
                                <button
                                    key={chat.conversationId}
                                    onClick={() => handleChatSelect(chat)}
                                    className={`w-full text-left px-4 py-3.5 transition flex items-center gap-3 ${
                                        isActive ? "bg-blue-50 text-blue-800" : "hover:bg-slate-50 text-slate-700"
                                    }`}
                                >
                                    <div className="relative flex-shrink-0">
                                        <Image
                                            src={chat.user.avatar || "/placeholder.png"}
                                            alt={chat.user.name}
                                            width={40}
                                            height={40}
                                            className="rounded-full border border-slate-200 object-cover w-10 h-10"
                                        />
                                        {chat.online && (
                                            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <span className="text-sm font-semibold truncate block">
                                                {chat.user.name}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-400 truncate">
                                            {chat.lastMessage || "Start a conversation"}
                                        </p>
                                    </div>
                                    {chat.unreadCount > 0 && (
                                        <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                            {chat.unreadCount}
                                        </span>
                                    )}
                                </button>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Chat Pane */}
            <div className="flex-1 flex flex-col bg-slate-50 h-full">
                {selectedChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Image
                                        src={selectedChat.user.avatar || "/placeholder.png"}
                                        alt={selectedChat.user.name}
                                        width={40}
                                        height={40}
                                        className="rounded-full border border-slate-200 object-cover w-10 h-10"
                                    />
                                    {selectedChat.online && (
                                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-sm font-bold text-slate-800">
                                        {selectedChat.user.name}
                                    </h2>
                                    <p className="text-xs text-slate-400">
                                        {selectedChat.online ? "Online" : "Offline"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Messages List */}
                        <div 
                            ref={messageContainerRef}
                            className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col"
                        >
                            {messages.length === 0 ? (
                                <div className="text-center py-8 text-slate-400 text-sm my-auto">
                                    No messages yet. Send a message to start.
                                </div>
                            ) : (
                                messages.map((msg: any, idx: number) => {
                                    const isSeller = msg.senderType === 'seller';
                                    return (
                                        <div
                                            key={idx}
                                            className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                                                isSeller
                                                    ? "bg-blue-600 text-white rounded-tr-none self-end"
                                                    : "bg-white text-slate-800 border border-slate-200 rounded-tl-none self-start"
                                            }`}
                                        >
                                            <p className="leading-relaxed break-words">{msg.content}</p>
                                            <span className={`text-[10px] block mt-1 text-right ${
                                                isSeller ? "text-blue-200" : "text-slate-400"
                                            }`}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Message Input Form */}
                        <form 
                            onSubmit={handleSend}
                            className="p-4 bg-white border-t border-slate-200 flex items-center gap-3"
                        >
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button
                                type="submit"
                                disabled={!message.trim()}
                                className="px-5 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white rounded-xl font-semibold shadow-sm transition flex items-center justify-center gap-1.5"
                            >
                                <Send size={16} />
                                <span>Send</span>
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
                        <MessageSquare size={48} className="text-slate-300 mb-3" />
                        <h3 className="text-slate-700 font-semibold mb-1">No Conversation Selected</h3>
                        <p className="text-sm text-slate-400 max-w-xs text-center">
                            Select a customer conversation from the list on the left to start viewing messages.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default function ChatPageWithSuspense() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="text-slate-400 text-sm">Loading chat...</div>
            </div>
        }>
            <ChatPage />
        </Suspense>
    )
}