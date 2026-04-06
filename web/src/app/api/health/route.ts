import { sql } from "drizzle-orm";

import { getDb } from "@/db";
import { envLoadedFilesHint } from "@/lib/env-diagnostics";
import { getEnv, getEnvStatus } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function GET() {
  const status = getEnvStatus();

  if (!status.ok) {
    return Response.json(
      {
        ok: false,
        envValid: false,
        databaseReachable: false,
        databaseSummary: status.databaseSummary,
        envIssues: {
          formErrors: status.formErrors,
          fieldErrors: status.fieldErrors,
        },
        hint: envLoadedFilesHint(),
      },
      { status: 503 },
    );
  }

  try {
    await getDb().execute(sql`SELECT 1`);
    return Response.json({
      ok: true,
      envValid: true,
      databaseReachable: true,
      databaseSummary: status.databaseSummary,
      authEnabled: status.data.AUTH_ENABLED,
      mapboxConfigured: Boolean(status.data.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN),
      blobConfigured: Boolean(status.data.BLOB_READ_WRITE_TOKEN),
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "unknown_error";
    return Response.json(
      {
        ok: false,
        envValid: true,
        databaseReachable: false,
        databaseSummary: status.databaseSummary,
        error: message,
        hint: "Env parsed but SELECT 1 failed — check Neon URL, network, and IP allowlists.",
      },
      { status: 503 },
    );
  }
}

/** Same as GET but runs getEnv() so dev server logs `[festr:env] Loaded OK` on first hit. */
export async function HEAD() {
  try {
    getEnv();
    await getDb().execute(sql`SELECT 1`);
    return new Response(null, { status: 200 });
  } catch {
    return new Response(null, { status: 503 });
  }
}
