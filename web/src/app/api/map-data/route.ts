import { desc } from "drizzle-orm";

import { incidents, resources } from "@/db/schema";
import { getDb } from "@/db/index";
import { resourcePhotoProxyPath } from "@/lib/blob-stream";
import { getEnv } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    getEnv();
  } catch {
    return Response.json({ error: "server_misconfigured" }, { status: 503 });
  }

  const db = getDb();

  const incidentRows = await db
    .select({
      id: incidents.id,
      lat: incidents.lat,
      lng: incidents.lng,
      type: incidents.type,
      isSilentSecurity: incidents.isSilentSecurity,
      createdAt: incidents.createdAt,
    })
    .from(incidents)
    .orderBy(desc(incidents.createdAt))
    .limit(200);

  const resourceRows = await db
    .select({
      id: resources.id,
      lat: resources.lat,
      lng: resources.lng,
      kind: resources.kind,
      name: resources.name,
      photoUrl: resources.photoUrl,
    })
    .from(resources)
    .orderBy(desc(resources.createdAt))
    .limit(200);

  const resourcesOut = resourceRows.map((r) => ({
    ...r,
    photoUrl: r.photoUrl ? resourcePhotoProxyPath(r.id) : null,
  }));

  return Response.json({
    incidents: incidentRows,
    resources: resourcesOut,
  });
}
