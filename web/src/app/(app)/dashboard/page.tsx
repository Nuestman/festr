import { desc, eq } from "drizzle-orm";
import Link from "next/link";

import { IncidentStatusForm } from "@/components/app/incident-status-form";
import { incidents } from "@/db/schema";
import { getDb } from "@/db/index";
import { getAuthServer } from "@/lib/auth/server";
import { isAuthEnabled } from "@/lib/auth/flags";
import { getEnv } from "@/lib/env";
import { canResponderUpdateIncidents, getOrCreateProfile, isResponderOrAdmin } from "@/lib/profile";
import { incidentStatuses } from "@/lib/validators/incident";

export const dynamic = "force-dynamic";

type Search = { status?: string };

type Props = { searchParams: Promise<Search> };

export default async function DashboardPage({ searchParams }: Props) {
  const sp = await searchParams;
  const statusParam = sp.status;
  const statusFilter =
    statusParam === "open" || statusParam === "triaged" || statusParam === "closed"
      ? statusParam
      : undefined;

  try {
    getEnv();
  } catch {
    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground leading-relaxed">
          Server environment did not validate (missing <code className="rounded bg-muted px-1 py-0.5 text-foreground">DATABASE_URL</code>, invalid optional URLs like empty{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-foreground">NEXT_PUBLIC_APP_URL=</code>, or auth vars when{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-foreground">AUTH_ENABLED=true</code>). In dev, check the terminal for{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-foreground">[festr:env]</code> logs.
        </p>
        <p>
          <Link href="/api/health" className="font-medium text-primary underline underline-offset-4">
            Open /api/health
          </Link>{" "}
          for a JSON breakdown (no secrets).
        </p>
      </div>
    );
  }

  if (isAuthEnabled()) {
    const auth = getAuthServer();
    if (!auth) {
      return (
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Authentication is not configured.</p>
        </div>
      );
    }
    let session: Awaited<ReturnType<typeof auth.getSession>>["data"];
    try {
      const res = await auth.getSession();
      session = res.data;
    } catch {
      return (
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Could not read session.</p>
        </div>
      );
    }
    const user = session?.user;
    if (!user?.id || !user.email) {
      return (
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Sign in with a responder account to view this page.</p>
          <Link
            href="/auth/sign-in"
            className="font-medium text-primary underline underline-offset-4"
          >
            Sign in
          </Link>
        </div>
      );
    }
    const profile = await getOrCreateProfile({
      userId: user.id,
      email: user.email,
      name: user.name ?? null,
    });
    if (!isResponderOrAdmin(profile.role)) {
      return (
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold text-foreground">Responder dashboard</h1>
          <p className="max-w-xl text-muted-foreground leading-relaxed">
            This area is for verified responders and administrators. Your account is signed in but
            does not have access yet. Ask an administrator to grant access, or set{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-foreground">FESTR_RESPONDER_EMAILS</code>{" "}
            / <code className="rounded bg-muted px-1 py-0.5 text-foreground">FESTR_ADMIN_EMAILS</code>{" "}
            for staging.
          </p>
          <Link href="/report" className="font-medium text-primary underline underline-offset-4">
            Go to Report
          </Link>
        </div>
      );
    }
  }

  const canUpdate = await canResponderUpdateIncidents();
  const db = getDb();
  const whereClause = statusFilter ? eq(incidents.status, statusFilter) : undefined;
  const rows = whereClause
    ? await db
        .select({
          id: incidents.id,
          type: incidents.type,
          status: incidents.status,
          createdAt: incidents.createdAt,
          isSilentSecurity: incidents.isSilentSecurity,
        })
        .from(incidents)
        .where(whereClause)
        .orderBy(desc(incidents.createdAt))
        .limit(50)
    : await db
        .select({
          id: incidents.id,
          type: incidents.type,
          status: incidents.status,
          createdAt: incidents.createdAt,
          isSilentSecurity: incidents.isSilentSecurity,
        })
        .from(incidents)
        .orderBy(desc(incidents.createdAt))
        .limit(50);

  const filterHref = (s: string | "all") => {
    const params = new URLSearchParams();
    if (s !== "all") params.set("status", s);
    const q = params.toString();
    return q ? `/dashboard?${q}` : "/dashboard";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Responder dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Recent incidents ·{" "}
            <Link href="/map" className="font-medium text-primary underline underline-offset-4">
              Open map
            </Link>
          </p>
        </div>
      </div>

      {!isAuthEnabled() && (
        <p className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
          Authentication is off — this list is for demos. Status updates require{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-foreground">AUTH_ENABLED=true</code> and a
          responder profile.
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-muted-foreground">Filter:</span>
        <Link
          href={filterHref("all")}
          className={`rounded-md px-2 py-1 text-sm ${!statusFilter ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          All
        </Link>
        {incidentStatuses.map((s) => (
          <Link
            key={s}
            href={filterHref(s)}
            className={`rounded-md px-2 py-1 text-sm capitalize ${statusFilter === s ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            {s}
          </Link>
        ))}
      </div>

      {rows.length === 0 ? (
        <p className="text-muted-foreground">
          No incidents{statusFilter ? ` with status “${statusFilter}”` : ""}. Use Report to submit the
          first one.
        </p>
      ) : (
        <ul className="divide-y divide-border rounded-lg border border-border bg-card">
          {rows.map((r) => (
            <li
              key={r.id}
              className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/incidents/${r.id}`}
                    className="font-medium text-primary underline underline-offset-4"
                  >
                    {r.type}
                  </Link>
                  {r.isSilentSecurity && (
                    <span className="text-xs text-muted-foreground">(silent)</span>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">{r.createdAt.toISOString()}</div>
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                <IncidentStatusForm
                  incidentId={r.id}
                  currentStatus={r.status}
                  canUpdate={canUpdate}
                  compact
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
