import { desc } from "drizzle-orm";

import { incidents } from "@/db/schema";
import { getDb } from "@/db/index";
import { insertAuditLog } from "@/lib/audit-log";
import { getAuthServer } from "@/lib/auth/server";
import { getEnv } from "@/lib/env";
import {
  checkRateLimit,
  getRateLimitIncidentListPerMinute,
  getRateLimitReportsPerMinute,
} from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request-ip";
import { createIncidentBodySchema } from "@/lib/validators/incident";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    getEnv();
  } catch {
    return Response.json({ error: "server_misconfigured" }, { status: 503 });
  }

  const ip = getClientIp(request);
  const rl = checkRateLimit(`report:${ip}`, getRateLimitReportsPerMinute());
  if (!rl.ok) {
    return Response.json(
      { error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = createIncidentBodySchema.safeParse(json);
  if (!parsed.success) {
    return Response.json(
      { error: "validation_error", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const body = parsed.data;
  const auth = getAuthServer();
  let createdBy: string | null = null;
  if (auth) {
    try {
      const { data: session } = await auth.getSession();
      createdBy = session?.user?.id ?? null;
    } catch {
      createdBy = null;
    }
  }

  const db = getDb();
  const [row] = await db
    .insert(incidents)
    .values({
      type: body.type,
      description: body.description?.trim() || null,
      lat: body.lat,
      lng: body.lng,
      accuracyM: body.accuracyM ?? null,
      isSilentSecurity: body.isSilentSecurity ?? false,
      createdBy,
    })
    .returning({ id: incidents.id });

  if (!row) {
    return Response.json({ error: "insert_failed" }, { status: 500 });
  }

  await insertAuditLog({
    action: "incident.created",
    subjectId: row.id,
    actorId: createdBy,
    meta: { type: body.type },
  });

  return Response.json({ id: row.id }, { status: 201 });
}

export async function GET(request: Request) {
  try {
    getEnv();
  } catch {
    return Response.json({ error: "server_misconfigured" }, { status: 503 });
  }

  const ip = getClientIp(request);
  const rl = checkRateLimit(`incident_list:${ip}`, getRateLimitIncidentListPerMinute());
  if (!rl.ok) {
    return Response.json(
      { error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
    );
  }

  const db = getDb();
  const rows = await db
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

  return Response.json({ incidents: rows });
}
