"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useCallback, useEffect, useId, useState } from "react";

import { AppAuthNav } from "@/components/auth/app-auth-nav";
import type { AppHeaderProfile } from "@/lib/profile";
import { cn } from "@/lib/utils";

export type AppShellNavItem = { href: string; label: string };

type Props = {
  nav: AppShellNavItem[];
  profileHeader: AppHeaderProfile | null;
};

function NavLinks({
  items,
  className,
  onNavigate,
  direction,
}: {
  items: AppShellNavItem[];
  className?: string;
  onNavigate?: () => void;
  direction: "row" | "col";
}) {
  return (
    <ul
      className={cn(
        direction === "row" ? "flex flex-row flex-wrap items-center justify-center gap-1" : "flex flex-col gap-0.5",
        className,
      )}
    >
      {items.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className={cn(
              "festr-header-nav__link px-2 py-2",
              direction === "col" ? "block" : "inline-block",
            )}
            onClick={onNavigate}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function AppShellHeader({ nav, profileHeader }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuId = useId();

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobile();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen, closeMobile]);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/80 bg-muted/50 backdrop-blur-md supports-[backdrop-filter]:bg-background/75">
        <div className="relative mx-auto flex max-w-5xl items-center justify-between gap-3 px-6 py-4 md:px-4">
          <Link
            href="/"
            className="relative z-10 shrink-0 font-heading text-lg font-bold tracking-tight text-foreground"
          >
            FESTR
          </Link>

          <nav
            className="absolute left-1/2 top-1/2 hidden w-full max-w-[min(100%,36rem)] -translate-x-1/2 -translate-y-1/2 justify-center md:flex md:justify-center"
            aria-label="App"
          >
            <NavLinks items={nav} direction="row" />
          </nav>

          <div className="relative z-10 ml-auto flex items-center gap-2">
            <AppAuthNav profileHeader={profileHeader} />
            <button
              type="button"
              className="flex size-12 shrink-0 items-center justify-center rounded-lg border border-border bg-background/80 text-foreground shadow-sm transition-colors hover:bg-accent md:hidden"
              aria-expanded={mobileOpen}
              aria-controls={menuId}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((o) => !o)}
            >
              {mobileOpen ? <X className="size-6" aria-hidden /> : <Menu className="size-6" aria-hidden />}
            </button>
          </div>
        </div>
      </header>

      {mobileOpen ? (
        <div
          className="fixed inset-0 z-50 md:hidden"
          id={menuId}
          role="dialog"
          aria-modal="true"
          aria-label="App menu"
        >
          <button
            type="button"
            className="absolute inset-0 min-h-[100dvh] w-full cursor-default border-0 bg-black/40 p-0 backdrop-blur-[2px]"
            aria-label="Close menu"
            onClick={closeMobile}
          />
          <nav
            className="absolute left-6 right-6 top-[calc(4.5rem+env(safe-area-inset-top,0px))] z-[1] max-h-[min(70vh,28rem)] overflow-y-auto rounded-xl border border-border bg-card p-3 shadow-lg"
            aria-label="App"
          >
            <NavLinks items={nav} direction="col" onNavigate={closeMobile} />
          </nav>
        </div>
      ) : null}
    </>
  );
}
