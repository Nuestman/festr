import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";

import { IncidentStatusForm } from "@/components/app/incident-status-form";
import { incidentMedia, incidents } from "@/db/schema";
import { getDb } from "@/db/index";
import { getEnv } from "@/lib/env";
import { incidentMediaProxyPath } from "@/lib/blob-stream";
import { canResponderUpdateIncidents } from "@/lib/profile";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function IncidentDetailPage({ params }: Props) {
  const { id } = await params;

  try {
    getEnv();
  } catch {
    notFound();
  }

  const db = getDb();
  const [incident] = await db.select().from(incidents).where(eq(incidents.id, id)).limit(1);

  if (!incident) {
    notFound();
  }

  const media = await db
    .select()
    .from(incidentMedia)
    .where(eq(incidentMedia.incidentId, id));

  const canUpdate = await canResponderUpdateIncidents();

  return (
    <div className="space-y-8">
      <p>
        <Link href="/map" className="text-sm text-muted-foreground hover:text-foreground">
          ← Map
        </Link>
      </p>
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-foreground">Incident</h1>
        <p className="text-sm text-muted-foreground font-mono">{incident.id}</p>
      </div>

      <dl className="grid max-w-xl gap-3 text-sm">
        <div className="grid grid-cols-[8rem_1fr] gap-2">
          <dt className="text-muted-foreground">Type</dt>
          <dd className="font-medium text-foreground">{incident.type}</dd>
        </div>
        <div className="grid grid-cols-[8rem_1fr] gap-2 sm:grid-cols-1">
          <dt className="text-muted-foreground sm:col-span-1">Status</dt>
          <dd className="sm:col-span-1">
            {canUpdate ? (
              <IncidentStatusForm
                incidentId={incident.id}
                currentStatus={incident.status}
                canUpdate
              />
            ) : (
              <span className="capitalize">{incident.status}</span>
            )}
          </dd>
        </div>
        <div className="grid grid-cols-[8rem_1fr] gap-2">
          <dt className="text-muted-foreground">Location</dt>
          <dd>
            {incident.lat.toFixed(5)}, {incident.lng.toFixed(5)}
            {incident.accuracyM != null && (
              <span className="text-muted-foreground"> (±{Math.round(incident.accuracyM)} m)</span>
            )}
          </dd>
        </div>
        <div className="grid grid-cols-[8rem_1fr] gap-2">
          <dt className="text-muted-foreground">Silent</dt>
          <dd>{incident.isSilentSecurity ? "Yes" : "No"}</dd>
        </div>
        <div className="grid grid-cols-[8rem_1fr] gap-2">
          <dt className="text-muted-foreground">Reported</dt>
          <dd>{incident.createdAt.toISOString()}</dd>
        </div>
        {incident.description && (
          <div className="grid grid-cols-[8rem_1fr] gap-2 sm:grid-cols-1">
            <dt className="text-muted-foreground sm:col-span-1">Description</dt>
            <dd className="whitespace-pre-wrap sm:col-span-1">{incident.description}</dd>
          </div>
        )}
      </dl>

      {media.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Media</h2>
          <ul className="flex flex-col gap-4">
            {media.map((m) => (
              <li key={m.id}>
                {m.mime.startsWith("image/") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={incidentMediaProxyPath(incident.id, m.id)}
                    alt=""
                    className="max-h-96 max-w-full rounded-lg border border-border object-contain"
                  />
                ) : (
                  <video
                    src={incidentMediaProxyPath(incident.id, m.id)}
                    controls
                    className="max-h-96 max-w-full rounded-lg border border-border"
                  />
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  {m.mime} · {(m.sizeBytes / 1024).toFixed(1)} KB
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
