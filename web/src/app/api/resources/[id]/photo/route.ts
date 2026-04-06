import { put } from "@vercel/blob";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";

import { resources } from "@/db/schema";
import { getDb } from "@/db/index";
import { getEnv } from "@/lib/env";
import { resourcePhotoProxyPath, streamBlobFromStoredUrl } from "@/lib/blob-stream";
import { resolveAllowedImageMime } from "@/lib/upload-mime";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

type RouteParams = { params: Promise<{ id: string }> };

/** Short-lived read via app (private Blob); DB still stores canonical blob URL for delete/SDK. */
export async function GET(_request: Request, { params }: RouteParams) {
  try {
    getEnv();
  } catch {
    return new Response("server_misconfigured", { status: 503 });
  }

  const { id: resourceId } = await params;
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      resourceId,
    )
  ) {
    return new Response("invalid_resource_id", { status: 400 });
  }

  const db = getDb();
  const [row] = await db
    .select({ photoUrl: resources.photoUrl })
    .from(resources)
    .where(eq(resources.id, resourceId))
    .limit(1);

  if (!row?.photoUrl) {
    return new Response("not_found", { status: 404 });
  }

  return streamBlobFromStoredUrl(row.photoUrl);
}

export async function POST(request: Request, { params }: RouteParams) {
  let env: ReturnType<typeof getEnv>;
  try {
    env = getEnv();
  } catch {
    return Response.json({ error: "server_misconfigured" }, { status: 503 });
  }

  if (!env.BLOB_READ_WRITE_TOKEN) {
    return Response.json({ error: "blob_not_configured" }, { status: 503 });
  }

  const { id: resourceId } = await params;
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      resourceId,
    )
  ) {
    return Response.json({ error: "invalid_resource_id" }, { status: 400 });
  }

  const db = getDb();
  const [resource] = await db
    .select({ id: resources.id, kind: resources.kind })
    .from(resources)
    .where(eq(resources.id, resourceId))
    .limit(1);

  if (!resource) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }

  const kindSegment = String(resource.kind).replace(/[^a-z0-9_]/gi, "") || "other";

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
    return Response.json({ error: "file_too_large", maxBytes: MAX_BYTES }, { status: 400 });
  }

  const resolved = resolveAllowedImageMime(file, ALLOWED_MIME);
  if (!resolved.ok) {
    return Response.json(
      {
        error: "unsupported_type",
        allowed: [...ALLOWED_MIME],
        hint: "Use JPEG, PNG, or WebP. If the type is empty, ensure the filename ends with .jpg, .png, or .webp.",
      },
      { status: 400 },
    );
  }

  const safeExt =
    file.name.split(".").pop()?.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8) || "jpg";
  const pathname = `festr/resources/${kindSegment}/${resourceId}/${randomUUID()}.${safeExt}`;

  let blob: Awaited<ReturnType<typeof put>>;
  try {
    blob = await put(pathname, file, {
      access: "private",
      token: env.BLOB_READ_WRITE_TOKEN,
      contentType: resolved.mime,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "blob_put_failed";
    return Response.json({ error: "blob_put_failed", message }, { status: 502 });
  }

  await db
    .update(resources)
    .set({ photoUrl: blob.url })
    .where(eq(resources.id, resourceId));

  return Response.json({ url: resourcePhotoProxyPath(resourceId) }, { status: 201 });
}
