import { eq } from "drizzle-orm";

import { profiles } from "@/db/schema";
import { getDb } from "@/db/index";
import { getEnv } from "@/lib/env";
import { getAuthServer } from "@/lib/auth/server";
import { isAuthEnabled } from "@/lib/auth/flags";

export type UserRole = "public" | "responder" | "admin";

export type AppHeaderProfile = {
  displayName: string;
  role: UserRole;
};

function parseEmailList(raw: string | undefined): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

function roleRank(role: UserRole): number {
  switch (role) {
    case "public":
      return 0;
    case "responder":
      return 1;
    case "admin":
      return 2;
    default: {
      const _exhaustive: never = role;
      return _exhaustive;
    }
  }
}

function roleFromEnvEmail(email: string): UserRole {
  const normalized = email.trim().toLowerCase();
  const env = getEnv();
  const admins = parseEmailList(env.FESTR_ADMIN_EMAILS);
  const responders = parseEmailList(env.FESTR_RESPONDER_EMAILS);
  if (admins.includes(normalized)) return "admin";
  if (responders.includes(normalized)) return "responder";
  return "public";
}

function mergeRoles(current: UserRole, fromEnv: UserRole): UserRole {
  return roleRank(fromEnv) > roleRank(current) ? fromEnv : current;
}

export function isResponderOrAdmin(role: UserRole): boolean {
  return role === "responder" || role === "admin";
}

export function formatRoleLabel(role: UserRole): string {
  switch (role) {
    case "admin":
      return "Admin";
    case "responder":
      return "Responder";
    case "public":
      return "Public";
    default: {
      const _exhaustive: never = role;
      return _exhaustive;
    }
  }
}

/** Profile summary for app header (name + role). Null when auth off or signed out. */
export async function getAppHeaderProfile(): Promise<AppHeaderProfile | null> {
  if (!isAuthEnabled()) return null;
  const auth = getAuthServer();
  if (!auth) return null;
  try {
    const { data: session } = await auth.getSession();
    const user = session?.user;
    if (!user?.id || !user.email) return null;
    const profile = await getOrCreateProfile({
      userId: user.id,
      email: user.email,
      name: user.name ?? null,
    });
    const displayName =
      profile.displayName?.trim() ||
      user.name?.trim() ||
      user.email.split("@")[0] ||
      "User";
    return { displayName, role: profile.role as UserRole };
  } catch {
    return null;
  }
}

export async function getOrCreateProfile(input: {
  userId: string;
  email: string;
  name?: string | null;
}) {
  getEnv();
  const db = getDb();
  const desiredFromEnv = roleFromEnvEmail(input.email);
  const displayName = input.name?.trim() || null;

  // Idempotent create: layout + dashboard (or parallel RSC) must not race duplicate inserts.
  await db
    .insert(profiles)
    .values({
      id: input.userId,
      displayName,
      role: desiredFromEnv,
    })
    .onConflictDoNothing({ target: profiles.id });

  const [row] = await db.select().from(profiles).where(eq(profiles.id, input.userId)).limit(1);
  if (!row) {
    throw new Error("profile_missing_after_upsert");
  }

  const merged = mergeRoles(row.role as UserRole, desiredFromEnv);
  const updates: { role?: UserRole; displayName?: string | null } = {};
  if (merged !== row.role) {
    updates.role = merged;
  }
  if (displayName && displayName !== row.displayName) {
    updates.displayName = displayName;
  }
  if (Object.keys(updates).length > 0) {
    await db
      .update(profiles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(profiles.id, input.userId));
    const [fresh] = await db.select().from(profiles).where(eq(profiles.id, input.userId)).limit(1);
    return fresh ?? row;
  }

  return row;
}

/** When auth is off, the app shell shows Dashboard for demos; when auth is on, only responders/admins. */
export async function shouldShowDashboardNav(): Promise<boolean> {
  if (!isAuthEnabled()) return true;
  const auth = getAuthServer();
  if (!auth) return false;
  try {
    const { data: session } = await auth.getSession();
    const user = session?.user;
    if (!user?.id || !user.email) return false;
    const profile = await getOrCreateProfile({
      userId: user.id,
      email: user.email,
      name: user.name ?? null,
    });
    return isResponderOrAdmin(profile.role);
  } catch {
    return false;
  }
}

export async function canResponderUpdateIncidents(): Promise<boolean> {
  if (!isAuthEnabled()) return false;
  const auth = getAuthServer();
  if (!auth) return false;
  try {
    const { data: session } = await auth.getSession();
    const user = session?.user;
    if (!user?.id || !user.email) return false;
    const profile = await getOrCreateProfile({
      userId: user.id,
      email: user.email,
      name: user.name ?? null,
    });
    return isResponderOrAdmin(profile.role);
  } catch {
    return false;
  }
}
