"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

export function Providers({
    children,
}: {
    children: React.ReactNode;
}) {

    const queryClient = new QueryClient();

    return (
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </GoogleOAuthProvider>
    );
}