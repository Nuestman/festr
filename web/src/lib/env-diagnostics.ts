/**
 * Safe summaries for logs and /api/health — never log raw connection strings.
 */
export function summarizeDatabaseUrl(raw: string | undefined): string | null {
  if (!raw?.trim()) return null;
  try {
    const u = new URL(raw.trim());
    const host = u.hostname || "unknown-host";
    const db = u.pathname.replace(/^\//, "") || "(default)";
    return `${u.protocol}//${host}/${db}`;
  } catch {
    return "invalid-url";
  }
}

export function envLoadedFilesHint(): string {
  const cwd = process.cwd();
  return `cwd=${cwd}; check web/.env, web/.env.local, and repo-root .env / .env.local`;
}
