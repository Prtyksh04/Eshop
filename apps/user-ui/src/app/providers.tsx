'use client'
import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "sonner";
import useUser from '../hooks/useUser';
import { WebSocketProvider } from '../context/web-socket-context';

const Providers = ({ children }: { children: React.ReactNode }) => {

    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                staleTime: 1000 * 60 * 5,
            }
        }
    }));

    return (
        <QueryClientProvider client={queryClient}>
            <ProvidersWithWebSocket>
                {children}
            </ProvidersWithWebSocket>
            <Toaster />
        </QueryClientProvider>
    )
}

const ProvidersWithWebSocket = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const { user } = useUser();

    return (
        <>
            {user && <WebSocketProvider user={user}> {children} </WebSocketProvider>}
            {!user && children}
        </>
    )
}

export default Providers