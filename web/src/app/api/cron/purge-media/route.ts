import { insertAuditLog } from "@/lib/audit-log";
import { verifyCronRequest } from "@/lib/cron-auth";
import { getEnv } from "@/lib/env";
import { getMediaRetentionDays, purgeIncidentMediaBatch } from "@/lib/media-purge";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Vercel Cron invokes GET with `Authorization: Bearer CRON_SECRET`.
 * Deletes up to one batch of incident media older than `MEDIA_RETENTION_DAYS` (default 90).
 * Set `MEDIA_RETENTION_DAYS=0` to disable blob deletion (returns 200 with enabled: false). Use GET only.
 */
export async function GET(request: Request) {
  if (!verifyCronRequest(request)) {
    return Response.json(
      { error: "unauthorized", hint: "Set CRON_SECRET (16+ chars) and send Authorization: Bearer …" },
      { status: 401 },
    );
  }

  const retentionDays = getMediaRetentionDays();
  if (retentionDays === 0) {
    return Response.json({
      enabled: false,
      message: "MEDIA_RETENTION_DAYS is 0 — automated purge is disabled.",
    });
  }

  try {
    getEnv();
  } catch {
    return Response.json({ error: "server_misconfigured" }, { status: 503 });
  }

  try {
    const result = await purgeIncidentMediaBatch(retentionDays);
    await insertAuditLog({
      action: "media.purge_batch",
      meta: {
        retentionDays,
        deleted: result.deleted,
        failed: result.failed,
        scanned: result.scanned,
      },
    });
    return Response.json({
      enabled: true,
      retentionDays,
      ...result,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "unknown";
    if (message === "blob_not_configured") {
      return Response.json({ error: "blob_not_configured" }, { status: 503 });
    }
    throw e;
  }
}
