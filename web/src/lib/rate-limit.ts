/**
 * In-process sliding window rate limiter (per server instance).
 * For multi-region serverless, prefer Redis / Vercel KV; this still reduces casual abuse.
 */

const WINDOW_MS = 60_000;

const buckets = new Map<string, number[]>();

function prune(key: string, now: number, windowMs: number) {
  const arr = buckets.get(key) ?? [];
  const recent = arr.filter((t) => now - t < windowMs);
  if (recent.length === 0) {
    buckets.delete(key);
  } else {
    buckets.set(key, recent);
  }
  return recent;
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}

export function checkRateLimit(
  key: string,
  maxPerWindow: number,
  windowMs: number = WINDOW_MS,
): { ok: true } | { ok: false; retryAfterSec: number } {
  const max = clamp(Math.floor(maxPerWindow), 1, 10_000);
  const now = Date.now();
  const recent = prune(key, now, windowMs);
  if (recent.length >= max) {
    const oldest = Math.min(...recent);
    const retryAfterSec = Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1000));
    return { ok: false, retryAfterSec };
  }
  recent.push(now);
  buckets.set(key, recent);
  return { ok: true };
}

export function getRateLimitReportsPerMinute(): number {
  const raw = process.env.RATE_LIMIT_REPORTS_PER_MINUTE;
  const n = raw ? Number.parseInt(raw, 10) : 30;
  return Number.isFinite(n) && n > 0 ? clamp(n, 1, 500) : 30;
}

export function getRateLimitUploadsPerMinute(): number {
  const raw = process.env.RATE_LIMIT_UPLOADS_PER_MINUTE;
  const n = raw ? Number.parseInt(raw, 10) : 20;
  return Number.isFinite(n) && n > 0 ? clamp(n, 1, 500) : 20;
}

export function getRateLimitIncidentListPerMinute(): number {
  const raw = process.env.RATE_LIMIT_INCIDENT_LIST_PER_MINUTE;
  const n = raw ? Number.parseInt(raw, 10) : 120;
  return Number.isFinite(n) && n > 0 ? clamp(n, 1, 2000) : 120;
}
