import { and, eq } from "drizzle-orm";

import { incidentMedia } from "@/db/schema";
import { getDb } from "@/db/index";
import { streamBlobFromStoredUrl } from "@/lib/blob-stream";
import { getEnv } from "@/lib/env";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type RouteParams = { params: Promise<{ id: string; mediaId: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    getEnv();
  } catch {
    return new Response("server_misconfigured", { status: 503 });
  }

  const { id: incidentId, mediaId } = await params;
  if (!UUID.test(incidentId) || !UUID.test(mediaId)) {
    return new Response("invalid_id", { status: 400 });
  }

  const db = getDb();
  const [row] = await db
    .select({ blobUrl: incidentMedia.blobUrl })
    .from(incidentMedia)
    .where(and(eq(incidentMedia.id, mediaId), eq(incidentMedia.incidentId, incidentId)))
    .limit(1);

  if (!row) {
    return new Response("not_found", { status: 404 });
  }

  return streamBlobFromStoredUrl(row.blobUrl);
}
