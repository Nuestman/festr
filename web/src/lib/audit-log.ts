import { auditLog } from "@/db/schema";
import { getDb } from "@/db/index";
import { getEnv } from "@/lib/env";

export type AuditMeta = Record<string, unknown>;

/**
 * Best-effort append to audit trail. Does not throw — failures are swallowed so core flows keep working.
 */
export async function insertAuditLog(entry: {
  action: string;
  subjectId?: string | null;
  actorId?: string | null;
  meta?: AuditMeta | null;
}): Promise<void> {
  try {
    getEnv();
  } catch {
    return;
  }
  try {
    const db = getDb();
    await db.insert(auditLog).values({
      action: entry.action,
      subjectId: entry.subjectId ?? null,
      actorId: entry.actorId ?? null,
      meta: entry.meta ?? null,
    });
  } catch {
    // ignore
  }
}
