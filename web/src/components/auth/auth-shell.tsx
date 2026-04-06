import type { ReactNode } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

type AuthShellProps = {
  subtitle: string;
  children: ReactNode;
  /** Narrow (sign-in) or wider panel for account settings */
  variant?: "default" | "wide";
  homeHref?: string;
};

export function AuthShell({
  subtitle,
  children,
  variant = "default",
  homeHref = "/",
}: AuthShellProps) {
  return (
    <div className="auth-shell">
      <div className="auth-shell__aurora" aria-hidden />
      <div
        className={cn(
          "auth-shell__inner",
          variant === "wide" && "auth-shell__inner--wide",
        )}
      >
        <header className="auth-shell__header">
          <Link href={homeHref} className="auth-shell__headlink">
            <span className="auth-shell__logo" aria-hidden />
            <h1 className="auth-shell__title">FESTR</h1>
            <span className="sr-only"> — back to home</span>
          </Link>
          <p className="auth-shell__subtitle">{subtitle}</p>
        </header>
        <div className="auth-shell__panel">{children}</div>
      </div>
    </div>
  );
}
