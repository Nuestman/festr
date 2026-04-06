import Link from "next/link";

import { buttonVariants } from "@/components/ui/button-variants";
import { getAuthServer } from "@/lib/auth/server";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const auth = getAuthServer();

  if (!auth) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-foreground">Profile</h1>
        <p className="text-muted-foreground leading-relaxed">
          Authentication is disabled on the server (
          <code className="rounded bg-muted px-1 py-0.5 text-foreground">AUTH_ENABLED</code>). Set{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-foreground">AUTH_ENABLED=true</code> and
          Neon Auth env vars to load sessions here.
        </p>
      </div>
    );
  }

  let session: Awaited<ReturnType<typeof auth.getSession>>["data"] = null;
  try {
    const res = await auth.getSession();
    session = res.data;
  } catch {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-foreground">Profile</h1>
        <p className="text-muted-foreground">
          Could not read session. Check{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-foreground">NEON_AUTH_BASE_URL</code> and{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-foreground">NEON_AUTH_COOKIE_SECRET</code>.
        </p>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-foreground">Profile</h1>
        <p className="text-muted-foreground">
          You are not signed in. Use Sign in in the header or go to the auth page.
        </p>
        <Link href="/auth/sign-in" className={cn(buttonVariants({ size: "lg" }))}>
          Sign in
        </Link>
      </div>
    );
  }

  const user = session.user;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Profile</h1>
      <dl className="grid max-w-md gap-2 text-sm">
        <dt className="text-muted-foreground">Name</dt>
        <dd className="font-medium text-foreground">{user.name ?? "—"}</dd>
        <dt className="text-muted-foreground">Email</dt>
        <dd className="font-medium text-foreground">{user.email}</dd>
      </dl>
      <p className="text-sm text-muted-foreground">
        Account settings:{" "}
        <Link
          href="/account/settings"
          className="font-medium text-primary underline underline-offset-4"
        >
          /account/settings
        </Link>
      </p>
    </div>
  );
}
