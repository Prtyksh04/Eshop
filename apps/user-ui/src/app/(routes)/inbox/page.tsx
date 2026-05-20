'use client'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useWebSocket } from 'apps/user-ui/src/context/web-socket-context';
import useRequiredAuth from 'apps/user-ui/src/hooks/useRequiredAuth';
import ChatInput from 'apps/user-ui/src/shared/components/chats/chatinput';
import axiosInstance from 'apps/user-ui/src/utils/axiosInstance';
import { isProtected } from 'apps/user-ui/src/utils/protected';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useRef, useState, Suspense } from 'react'


const Page = () => {

    const searchParams = useSearchParams();
    const { user } = useRequiredAuth();
    const router = useRouter();
    const messageContainerRef = useRef<HTMLDivElement | null>(null);
    const scrollAnchorRef = useRef<HTMLDivElement | null>(null);
    const queryClient = useQueryClient();
    const { ws } = useWebSocket();

    const [chats, setChats] = useState<any[]>([])
    const [selectedChat, setSelectedChat] = useState<any | null>(null)
    const [message, setMessage] = useState("");
    const [hasMore, setHasMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasFetchedOnce, setHasFetchedOnce] = useState(false);
    const conversationId = searchParams.get("conversationId");

    const { data: messages = [] } = useQuery({
        queryKey: ["messages", conversationId],
        queryFn: async () => {
            if (!conversationId || hasFetchedOnce) return [];

            const res = await axiosInstance.get(`/chatting/api/get-messages/${conversationId}?page=1`, isProtected);
            setPage(1);
            setHasMore(res.data.hasMore);
            setHasFetchedOnce(true);

            return res.data.messages.reverse();
        },
        enabled: !!conversationId,
        staleTime: 2 * 60 * 1000,
    });


    const { data: conversations, isLoading } = useQuery({
        queryKey: ["conversations"],
        queryFn: async () => {
            const res = await axiosInstance.get('/chatting/api/get-user-conversations', isProtected);
            return res.data.conversations;
        }
    });

    useEffect(() => {
        if (conversations) setChats(conversations);
    }, [conversations]);

    useEffect(() => {
        if (messages?.length > 0) scrollToBottom();
    }, [messages]);


    useEffect(() => {
        if (conversationId && chats.length > 0) {
            const chat = chats.find(c => c.id === conversationId);
            setSelectedChat(chat || null);
        }
    }, [conversationId, chats]);

    const handleChatSelect = (chat: any) => {
        setHasFetchedOnce(false);
        setChats((prev) => prev.map((c) => c.conversationId === chat.conversationId ? { ...c, unreadCount: 0 } : c));
        router.push(`?conversationId=${chat.conversationId}`);

        ws?.send(JSON.stringify({
            type: "MARK_AS_SEEN",
            conversationId: chat.conversationId,
        }));
    };

    const scrollToBottom = () => {
        requestAnimationFrame(() => {
            setTimeout(() => {
                scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 0);
        })
    }

    const handleSendMessage = async (e: any) => {
        e.preventDefault();

        if (!message.trim() || !selectedChat) return;

        const payload = {
            fromUserId: user?.id,
            toUserId: selectedChat.seller?.id,
            conversationId: selectedChat?.conversationId,
            messageBody: message,
            senderType: "user"
        };

        ws?.send(JSON.stringify(payload));

        queryClient.setQueryData(['messages', selectedChat.conversationId], (old: any = []) => [
            ...old,
            {
                content: payload.messageBody,
                senderType: 'user',
                seen: false,
                createdAt: new Date().toISOString(),
            }
        ]);

        setChats((prevChats) =>
            prevChats.map((chat) => chat.conversationId ? { ...chat, lastMessage: payload.messageBody } : chat));

        setMessage("");
        scrollToBottom();
    }

    const loadMoreMessages = async () => {
        const nextPage = page + 1;
        const res = await axiosInstance.get(`/chatting/api/get-messages/${conversationId}?page=${nextPage}`, isProtected);

        queryClient.setQueryData(['messages', conversationId], (old: any = []) => [
            ...res.data.messages.reverse(),
            ...old,
        ]);
        setPage(nextPage);
        setHasMore(res.data.hasMore);
    };

    const getLastMessage = (chat: any) => chat?.lastMessage || "";

    return (
        <div className='w-full'>
            <div className='md:w-[80%] mx-auto pt-5'>
                <div className="flex h-[80vh] shadow-sm overflow-hidden">
                    <div className='w-[320px] border-r border-r-gray-200 bg-gray-50'>
                        <div className='p-4 border-b border-b-gray-200 text-lg font-semibold text-gray-800'>
                            Messages
                        </div>
                        <div className='divide-y divide-gray-200'>
                            {isLoading ? (
                                <div className='p-4 text-sm text-gray-500'>
                                    Loading...
                                </div>
                            ) : chats.length === 0 ? (
                                <div className='p-4 text-sm text-gray-500'>
                                    No conversations found.
                                </div>
                            ) : (
                                chats.map((chat) => {
                                    const isActive = selectedChat?.id === chat.id;
                                    return (
                                        <button
                                            key={chat.conversationId}
                                            onClick={() => handleChatSelect(chat)}
                                            className={`w-full text-left px-4 py-3 transition hover:bg-blue-50 ${isActive ? "bg-blue-100 text-blue-800 font-medium" : "text-gray-700"}`}
                                        >
                                            <div className='flex items-center gap-3'>
                                                <Image
                                                    src={chat.seller?.image}
                                                    alt={chat.seller?.name}
                                                    width={40}
                                                    height={40}
                                                    className='rounded-full border w-[40px] h-[40px] object-cover'
                                                />
                                                <div className='flex-1'>
                                                    <div className='flex items-center justify-between'>
                                                        <span className='text-sm text-gray-800 font-semibold'>
                                                            {chat.seller}
                                                        </span>
                                                        {chat.seller?.isOnline && (
                                                            <span className='w-2 h-2 rounded-full bg-green-50'>

                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-500 truncate max-w-[170px]">
                                                        {getLastMessage(chat)}
                                                    </p>
                                                </div>
                                            </div>
                                        </button>
                                    )
                                })
                            )}
                        </div>
                    </div>

                    <div className='flex flex-col flex-1 bg-gray-100'>
                        {selectedChat ? (
                            <>
                                <div className='p-4 border-b border-b-gray-200 bg-white flex items-center gap-3'>
                                    <Image
                                        src={selectedChat.seller?.image}
                                        alt={selectedChat.seller?.name}
                                        width={40}
                                        className='rounded-full border w-[40px] object-cover border-gray-200'
                                        height={40}
                                    />
                                    <div>
                                        <h2 className='text-gray-800 font-semibold text-base'>
                                            {selectedChat.seller?.name}
                                        </h2>
                                        <p className='text-xs text-gray-500'>
                                            {selectedChat.seller?.isOnline ? "Online" : "Offline"}
                                        </p>
                                    </div>
                                </div>

                                <div ref={messageContainerRef}
                                    className='flex-1 overflow-y-auto px-6 py-6 space-y-4 text-sm'
                                >
                                    {hasMore && (
                                        <div className=' flex justify-center mb-2'>
                                            <button
                                                onClick={loadMoreMessages}
                                                className='text-xs px-4 py-1 bg-gray-400 hover:bg-gray-300'
                                            >
                                                Load Previous messages
                                            </button>
                                        </div>
                                    )}

                                    {messages?.map((msg: any, index: number) => (
                                        <div
                                            key={index}
                                            className={`flex flex-col ${msg.senderType === 'user' ? "items-end ml-auto" : "items-start"} max-w-[80%]`}>
                                            <div
                                                className={`${msg.senderType === 'user' ? "bg-blue-600 text-white" : "bg-white text-gray-800"} px-4 py-2 rounded-lg shadow-md w-fit`}>
                                                {msg.text || msg.content}
                                            </div>
                                            <div className={`text-[11px] text-gray-400 mt-1 flex items-center ${msg.senderType === 'user' ? "mr-1 justify-end" : "ml-1"}`}>
                                                {msg.time || new Date(msg.createdAt).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={scrollAnchorRef} />
                                </div>

                                <ChatInput
                                    message={message}
                                    setMessage={setMessage}
                                    onSendMessage={handleSendMessage}
                                />
                            </>
                        ) : (
                            <div className='flex-1 flex items-center justify-center text-gray-400 text-sm'>
                                Select a conversation to start chatting
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    )
}

export default function PageWithSuspense() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="text-slate-400 text-sm">Loading chat...</div>
            </div>
        }>
            <Page />
        </Suspense>
    )
}