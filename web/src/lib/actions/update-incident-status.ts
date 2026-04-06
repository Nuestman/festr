"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { incidents } from "@/db/schema";
import { getDb } from "@/db/index";
import { insertAuditLog } from "@/lib/audit-log";
import { getAuthServer } from "@/lib/auth/server";
import { getEnv } from "@/lib/env";
import { canResponderUpdateIncidents } from "@/lib/profile";
import { updateIncidentStatusSchema } from "@/lib/validators/incident";

export type UpdateIncidentStatusState = { error?: string };

export async function updateIncidentStatusAction(
  _prev: UpdateIncidentStatusState,
  formData: FormData,
): Promise<UpdateIncidentStatusState> {
  const allowed = await canResponderUpdateIncidents();
  if (!allowed) {
    return { error: "forbidden" };
  }

  try {
    getEnv();
  } catch {
    return { error: "misconfigured" };
  }

  const parsed = updateIncidentStatusSchema.safeParse({
    incidentId: formData.get("incidentId"),
    status: formData.get("status"),
  });
  if (!parsed.success) {
    return { error: "validation" };
  }

  const { incidentId, status } = parsed.data;
  const db = getDb();
  const [before] = await db
    .select({ status: incidents.status })
    .from(incidents)
    .where(eq(incidents.id, incidentId))
    .limit(1);

  if (!before) {
    return { error: "not_found" };
  }

  const [row] = await db
    .update(incidents)
    .set({ status })
    .where(eq(incidents.id, incidentId))
    .returning({ id: incidents.id });

  if (!row) {
    return { error: "not_found" };
  }

  const auth = getAuthServer();
  let actorId: string | null = null;
  if (auth) {
    try {
      const { data: session } = await auth.getSession();
      actorId = session?.user?.id ?? null;
    } catch {
      actorId = null;
    }
  }

  await insertAuditLog({
    action: "incident.status_updated",
    subjectId: incidentId,
    actorId,
    meta: { from: before.status, to: status },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/incidents/${incidentId}`);
  return {};
}
