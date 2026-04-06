/**
 * Vercel Cron sends `Authorization: Bearer <CRON_SECRET>` when `CRON_SECRET` is set in the project.
 */
export function verifyCronRequest(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret || secret.length < 16) {
    return false;
  }
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}
