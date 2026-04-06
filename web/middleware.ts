import { neonAuthMiddleware } from "@neondatabase/auth/next/server";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { isAuthEnabled } from "@/lib/auth/flags";

const withNeonAuth =
  isAuthEnabled() && process.env.NEON_AUTH_BASE_URL
    ? neonAuthMiddleware({
        loginUrl: "/auth/sign-in",
      })
    : null;

export default async function middleware(request: NextRequest) {
  if (!isAuthEnabled()) {
    return NextResponse.next();
  }
  if (!withNeonAuth) {
    return NextResponse.next();
  }
  return withNeonAuth(request);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/report/:path*",
    "/map/:path*",
    "/learn/:path*",
    "/profile/:path*",
    "/account/:path*",
  ],
};
