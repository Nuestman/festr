"use client";

import { forwardRef } from "react";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton, useAuthenticate } from "@neondatabase/auth/react";
import { ChevronsUpDown, UserRound } from "lucide-react";

import { formatRoleLabel, type AppHeaderProfile, type UserRole } from "@/lib/profile";
import { cn } from "@/lib/utils";

function initialsFromDisplayName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

const UserBadgeDropdownTrigger = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    displayName: string;
    roleLabel: string;
    initials: string;
  }
>(function UserBadgeDropdownTrigger(
  { displayName, roleLabel, initials, className, "aria-label": ariaLabel, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={ariaLabel ?? `${displayName}, ${roleLabel}. Open account menu`}
      className={cn(
        "flex max-w-[min(100%,17rem)] items-center gap-2 rounded-lg border border-border bg-secondary px-2 py-1.5 text-left shadow-sm outline-none transition-colors hover:bg-secondary/85 focus-visible:ring-2 focus-visible:ring-ring data-[state=open]:bg-secondary/90",
        "max-md:size-12 max-md:max-w-none max-md:justify-center max-md:gap-0 max-md:p-0",
        className,
      )}
      {...rest}
    >
      <span
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
        aria-hidden
      >
        {initials}
      </span>
      <span className="hidden min-w-0 flex-1 md:block">
        <span className="block truncate text-sm font-semibold leading-tight text-foreground">{displayName}</span>
        <span className="block truncate text-xs font-medium capitalize leading-tight text-muted-foreground">
          {roleLabel}
        </span>
      </span>
      <ChevronsUpDown className="hidden size-4 shrink-0 opacity-50 md:block" aria-hidden />
    </button>
  );
});

function SignedInUserMenu({ profileHeader }: { profileHeader: AppHeaderProfile | null }) {
  const { user } = useAuthenticate();
  const displayName =
    profileHeader?.displayName ??
    user?.name?.trim() ??
    (user?.email ? user.email.split("@")[0] : null) ??
    "Account";
  const role: UserRole = profileHeader?.role ?? "public";
  const roleLabel = formatRoleLabel(role);
  const initials = initialsFromDisplayName(displayName);

  return (
    <UserButton
      size="icon"
      trigger={
        <UserBadgeDropdownTrigger displayName={displayName} roleLabel={roleLabel} initials={initials} />
      }
      classNames={{
        content: {
          menuItem: "flex cursor-pointer items-center gap-2",
        },
      }}
      additionalLinks={[
        {
          href: "/profile",
          label: "Profile",
          signedIn: true,
          separator: true,
          icon: <UserRound className="size-4 opacity-80" aria-hidden />,
        },
      ]}
    />
  );
}

export function AppAuthNav({ profileHeader }: { profileHeader: AppHeaderProfile | null }) {
  if (process.env.NEXT_PUBLIC_AUTH_ENABLED !== "true") {
    return (
      <span
        className="hidden text-xs text-muted-foreground sm:inline"
        title="Set NEXT_PUBLIC_AUTH_ENABLED=true to enable sign-in UI"
      >
        Auth off
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <SignedOut>
        <Link href="/auth/sign-in" className={cn("festr-pill-cta text-[0.8125rem] px-3.5 py-2")}>
          Sign in
        </Link>
      </SignedOut>
      <SignedIn>
        <SignedInUserMenu profileHeader={profileHeader} />
      </SignedIn>
    </div>
  );
}
