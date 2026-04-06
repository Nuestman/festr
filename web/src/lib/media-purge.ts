import { del } from "@vercel/blob";
import { eq, lt } from "drizzle-orm";

import { incidentMedia } from "@/db/schema";
import { getDb } from "@/db/index";
import { getEnv } from "@/lib/env";

const BATCH = 40;

export function getMediaRetentionDays(): number {
  const raw = process.env.MEDIA_RETENTION_DAYS;
  if (raw === undefined || raw === "") {
    return 90;
  }
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 0) {
    return 90;
  }
  return n;
}

/**
 * Deletes one batch of incident media blobs + DB rows older than the cutoff.
 * Run repeatedly via cron until `deleted` is 0, or increase batch size.
 */
export async function purgeIncidentMediaBatch(retentionDays: number): Promise<{
  deleted: number;
  failed: number;
  scanned: number;
}> {
  const env = getEnv();
  if (!env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("blob_not_configured");
  }

  const cutoff = new Date(Date.now() - retentionDays * 86_400_000);
  const db = getDb();
  const rows = await db
    .select({
      id: incidentMedia.id,
      blobUrl: incidentMedia.blobUrl,
    })
    .from(incidentMedia)
    .where(lt(incidentMedia.createdAt, cutoff))
    .limit(BATCH);

  let deleted = 0;
  let failed = 0;
  for (const row of rows) {
    try {
      await del(row.blobUrl, { token: env.BLOB_READ_WRITE_TOKEN });
      await db.delete(incidentMedia).where(eq(incidentMedia.id, row.id));
      deleted += 1;
    } catch {
      failed += 1;
    }
  }

  return { deleted, failed, scanned: rows.length };
}
