import { get } from "@vercel/blob";

import { getEnv } from "@/lib/env";

/**
 * Stream a blob through the app. Matches Vercel plan: private store + reads via server (token).
 * Legacy rows may still use `.public.blob.` URLs — `get()` access must match how the object was stored.
 */
export async function streamBlobFromStoredUrl(blobUrl: string): Promise<Response> {
  let env: ReturnType<typeof getEnv>;
  try {
    env = getEnv();
  } catch {
    return new Response("server_misconfigured", { status: 503 });
  }

  if (!env.BLOB_READ_WRITE_TOKEN) {
    return new Response("blob_not_configured", { status: 503 });
  }

  const access: "private" | "public" = blobUrl.includes(".public.blob.vercel-storage.com")
    ? "public"
    : "private";

  const result = await get(blobUrl, {
    access,
    token: env.BLOB_READ_WRITE_TOKEN,
  });

  if (!result || result.statusCode !== 200 || !result.stream) {
    return new Response("not_found", { status: 404 });
  }

  const contentType = result.blob.contentType || "application/octet-stream";

  return new Response(result.stream, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "private, max-age=120",
    },
  });
}

/** Public JSON field: use app-relative URL so clients never embed raw Blob URLs. */
export function resourcePhotoProxyPath(resourceId: string): string {
  return `/api/resources/${resourceId}/photo`;
}

export function incidentMediaProxyPath(incidentId: string, mediaId: string): string {
  return `/api/incidents/${incidentId}/media/${mediaId}`;
}
