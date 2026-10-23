"use client";

import { useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { VaultProvider } from "@/context/VaultContext";

export function Providers({
    children,
}: {
    children: React.ReactNode;
}) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
            },
        },
    }));

    return (
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
            <QueryClientProvider client={queryClient}>
                <VaultProvider>
                    {children}
                </VaultProvider>
            </QueryClientProvider>
        </GoogleOAuthProvider>
    );
}