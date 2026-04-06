"use client";

import Link from "next/link";
import { SignedIn, SignedOut } from "@neondatabase/auth/react";

const APP_HREF = "/dashboard";
const SIGN_IN_HREF = "/auth/sign-in";

type Props = {
  className?: string;
  children: React.ReactNode;
};

/**
 * Marketing CTAs: when auth is enabled, signed-out users go to sign-in; signed-in users go to the app.
 * When auth is off, always opens the app shell (demo).
 */
export function MarketingOpenAppLink({ className, children }: Props) {
  if (process.env.NEXT_PUBLIC_AUTH_ENABLED !== "true") {
    return (
      <Link href={APP_HREF} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <>
      <SignedIn>
        <Link href={APP_HREF} className={className}>
          {children}
        </Link>
      </SignedIn>
      <SignedOut>
        <Link href={SIGN_IN_HREF} className={className}>
          {children}
        </Link>
      </SignedOut>
    </>
  );
}
