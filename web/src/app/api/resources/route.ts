import { desc } from "drizzle-orm";

import { resources } from "@/db/schema";
import { getDb } from "@/db/index";
import { resourcePhotoProxyPath } from "@/lib/blob-stream";
import { getAuthServer } from "@/lib/auth/server";
import { getEnv } from "@/lib/env";
import { createResourceBodySchema } from "@/lib/validators/resource";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    getEnv();
  } catch {
    return Response.json({ error: "server_misconfigured" }, { status: 503 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = createResourceBodySchema.safeParse(json);
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
    .insert(resources)
    .values({
      kind: body.kind,
      name: body.name.trim(),
      lat: body.lat,
      lng: body.lng,
      source: body.source?.trim() || null,
      createdBy,
    })
    .returning({ id: resources.id });

  if (!row) {
    return Response.json({ error: "insert_failed" }, { status: 500 });
  }

  return Response.json({ id: row.id }, { status: 201 });
}

export async function GET() {
  try {
    getEnv();
  } catch {
    return Response.json({ error: "server_misconfigured" }, { status: 503 });
  }

  const db = getDb();
  const rows = await db
    .select({
      id: resources.id,
      kind: resources.kind,
      name: resources.name,
      lat: resources.lat,
      lng: resources.lng,
      source: resources.source,
      photoUrl: resources.photoUrl,
      createdAt: resources.createdAt,
    })
    .from(resources)
    .orderBy(desc(resources.createdAt))
    .limit(100);

  const list = rows.map((r) => ({
    ...r,
    photoUrl: r.photoUrl ? resourcePhotoProxyPath(r.id) : null,
  }));

  return Response.json({ resources: list });
}
