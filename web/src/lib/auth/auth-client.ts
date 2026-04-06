"use client";

import { createAuthClient } from "@neondatabase/auth/next";

/**
 * Singleton client for Neon Auth (Better Auth). Next.js proxies to `/api/auth/*`.
 * Use with {@link NeonAuthUIProvider} when `NEXT_PUBLIC_AUTH_ENABLED=true`.
 */
export const authClient = createAuthClient();
