"use client";

import { ClerkProvider, useAuth, SignIn } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import {
    AuthLoading,
    Authenticated,
    Unauthenticated,
    ConvexReactClient,
} from "convex/react";
import { Loading } from "@/components/auth/loading";

interface ConvexClientProviderProps {
    children: React.ReactNode;
};

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!;

const convex = new ConvexReactClient(convexUrl);

export const ConvexClientProvider = ({
    children,
}: ConvexClientProviderProps) => {
    return (
        <ClerkProvider>
            <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
                {/* 1. Render children only when signed IN */}
                <Authenticated>
                    {children}
                </Authenticated>

                {/* 2. Render Sign In UI when signed OUT */}
                <Unauthenticated>
                    <div className="flex h-full w-full items-center justify-center min-h-screen">
                        <SignIn routing="hash" />
                    </div>
                </Unauthenticated>

                {/* 3. Render spinner while checking auth status */}
                <AuthLoading>
                    <Loading />
                </AuthLoading>
            </ConvexProviderWithClerk>
        </ClerkProvider>
    );
};