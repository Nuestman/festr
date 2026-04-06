# FESTR — Operations (backups, retention, observability)

This note complements `docs/technical-plan.md` with **Phase 7** operational practices.

## Neon Postgres — backups and PITR

- **Point-in-time recovery (PITR)** availability depends on your **Neon plan** (see [Neon backups](https://neon.tech/docs/manage/backups) in Neon’s documentation).
- Enable **automatic backups** in the Neon project settings where available; configure **retention** to match your compliance needs.
- For **preview branches** or PR databases, use Neon **branching** and treat short-lived branches as disposable unless you snapshot them on purpose.
- **Restore workflow:** use Neon Console or CLI to restore to a timestamp or branch; then point `DATABASE_URL` at the restored branch (or swap DNS/credentials after validation).

## Vercel Blob — private storage & reads

- The app uses **`access: 'private'`** on upload (per technical plan). Your Vercel Blob store must allow private objects.
- Postgres stores the **canonical Blob URL** (for `del()` and SDK `get()`). Browsers load media only through:
  - `GET /api/incidents/[incidentId]/media/[mediaId]`
  - `GET /api/resources/[resourceId]/photo` (same path as upload; GET streams, POST uploads)
- Public JSON APIs return **app-relative** `photoUrl` paths (e.g. `/api/resources/…/photo`), not raw `.vercel-storage.com` URLs.
- Legacy rows that still use **`.public.blob.`** URLs are streamed with `access: 'public'` until you re-upload or migrate.

## Vercel Blob — media retention

- Incident uploads are stored in **Vercel Blob**; metadata lives in Postgres (`incident_media`).
- **`MEDIA_RETENTION_DAYS`** (default `90`) controls how long media is kept. Set to **`0`** to **disable** automated deletion.
- **`POST`/`GET /api/cron/purge-media`** (see `web/src/app/api/cron/purge-media/route.ts`) deletes **one batch** of rows older than the retention window (blob first, then DB row). Schedule it with **Vercel Cron** via `web/vercel.json` (weekly by default) or call it manually with a valid secret.
- **`CRON_SECRET`:** must be **at least 16 characters**. Vercel Cron sends `Authorization: Bearer <CRON_SECRET>` when the secret is configured on the project.
- **Multi-step cleanup:** each cron run processes up to one batch; if you have a large backlog, shorten the cron interval temporarily or run the endpoint manually until `deleted` returns `0`.
- **Production note:** confirm legal/policy requirements before shortening retention; adjust defaults and copy in privacy docs accordingly.

## Observability (Vercel)

- **Web Analytics:** `@vercel/analytics` is wired in `web/src/app/layout.tsx`. Enable **Analytics** for the Vercel project in the dashboard.
- **Speed Insights:** `@vercel/speed-insights` is included in the same layout. Enable **Speed Insights** in the project settings.
- **Server errors:** `web/src/instrumentation.ts` exports `onRequestError` and logs structured lines to **stdout** (visible under Vercel → Logs). For richer error tracking, add a third-party APM (e.g. Sentry) later.

## Environment variables (reference)

| Variable | Role |
|----------|------|
| `DATABASE_URL` | Neon connection string (server only). |
| `BLOB_READ_WRITE_TOKEN` | Required for uploads and for automated blob deletion. |
| `MEDIA_RETENTION_DAYS` | Days to keep incident media; `0` disables purge. |
| `CRON_SECRET` | Protects `/api/cron/purge-media` (Bearer token). |

See `web/.env.example` for the full list used by the app.
