"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { NeonAuthUIProvider } from "@neondatabase/auth/react";
import type { ReactNode } from "react";

import { authClient } from "@/lib/auth/auth-client";

function NeonLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export function NeonAuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  if (process.env.NEXT_PUBLIC_AUTH_ENABLED !== "true") {
    return <>{children}</>;
  }
  return (
    <NeonAuthUIProvider
      authClient={authClient}
      redirectTo="/dashboard"
      navigate={(href) => {
        void router.push(href);
      }}
      replace={(href) => {
        void router.replace(href);
      }}
      Link={NeonLink}
      social={{ providers: ["google"] }}
    >
      {children}
    </NeonAuthUIProvider>
  );
}
