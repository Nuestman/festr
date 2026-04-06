import { put } from "@vercel/blob";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";

import { incidentMedia, incidents } from "@/db/schema";
import { getDb } from "@/db/index";
import { getEnv } from "@/lib/env";
import { checkRateLimit, getRateLimitUploadsPerMinute } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request-ip";
import { incidentMediaProxyPath } from "@/lib/blob-stream";
import { resolveAllowedImageMime } from "@/lib/upload-mime";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED_IMAGE = new Set(["image/jpeg", "image/png", "image/webp"]);
const ALLOWED_MIME = new Set([...ALLOWED_IMAGE, "video/mp4"]);

type RouteParams = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: RouteParams) {
  let env: ReturnType<typeof getEnv>;
  try {
    env = getEnv();
  } catch {
    return Response.json({ error: "server_misconfigured" }, { status: 503 });
  }

  if (!env.BLOB_READ_WRITE_TOKEN) {
    return Response.json(
      { error: "blob_not_configured", message: "Set BLOB_READ_WRITE_TOKEN for uploads." },
      { status: 503 },
    );
  }

  const ip = getClientIp(request);
  const rl = checkRateLimit(`upload:${ip}`, getRateLimitUploadsPerMinute());
  if (!rl.ok) {
    return Response.json(
      { error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
    );
  }

  const { id: incidentId } = await params;
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      incidentId,
    )
  ) {
    return Response.json({ error: "invalid_incident_id" }, { status: 400 });
  }

  const db = getDb();
  const [incident] = await db
    .select({ id: incidents.id, type: incidents.type })
    .from(incidents)
    .where(eq(incidents.id, incidentId))
    .limit(1);

  if (!incident) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }

  const typeSegment = String(incident.type).replace(/[^a-z0-9_]/gi, "") || "other";

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: "invalid_form_data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "file_required" }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return Response.json(
      { error: "file_too_large", maxBytes: MAX_BYTES },
      { status: 400 },
    );
  }

  let contentType = file.type?.trim() ?? "";
  if (contentType === "image/jpg") contentType = "image/jpeg";

  if (ALLOWED_IMAGE.has(contentType)) {
    // ok
  } else if (contentType === "video/mp4") {
    // ok
  } else if (!contentType || !ALLOWED_MIME.has(contentType)) {
    const img = resolveAllowedImageMime(file, ALLOWED_IMAGE);
    if (img.ok) {
      contentType = img.mime;
    } else if (file.name.toLowerCase().endsWith(".mp4")) {
      contentType = "video/mp4";
    } else {
      return Response.json(
        {
          error: "unsupported_type",
          allowed: [...ALLOWED_MIME],
          hint: "Images: JPEG/PNG/WebP (extension helps if type is missing). Video: MP4.",
        },
        { status: 400 },
      );
    }
  }

  const safeExt =
    file.name.split(".").pop()?.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8) || "bin";
  const pathname = `festr/incidents/${typeSegment}/${incidentId}/${randomUUID()}.${safeExt}`;

  let blob: Awaited<ReturnType<typeof put>>;
  try {
    blob = await put(pathname, file, {
      access: "private",
      token: env.BLOB_READ_WRITE_TOKEN,
      contentType,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "blob_put_failed";
    return Response.json({ error: "blob_put_failed", message }, { status: 502 });
  }

  const [mediaRow] = await db
    .insert(incidentMedia)
    .values({
      incidentId,
      blobUrl: blob.url,
      mime: contentType,
      sizeBytes: file.size,
    })
    .returning({ id: incidentMedia.id });

  if (!mediaRow) {
    return Response.json({ error: "insert_failed" }, { status: 500 });
  }

  return Response.json(
    {
      id: mediaRow.id,
      url: incidentMediaProxyPath(incidentId, mediaRow.id),
      mime: contentType,
      sizeBytes: file.size,
    },
    { status: 201 },
  );
}
