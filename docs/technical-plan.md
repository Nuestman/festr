# FESTR — Technical implementation plan

This document describes the stack, architecture, environments, auth strategy (including temporary disable), data model direction, Vercel Blob usage, and phased delivery for FESTR (**First Emergency Support & Trained Response**).

**Release:** **v1.0.0** — see [`CHANGELOG.md`](../CHANGELOG.md). **Live progress vs these phases:** [`implementation-status.md`](./implementation-status.md).

---

## 1. Goals and constraints

| Goal | Detail |
|------|--------|
| **Product** | Public marketing site + authenticated (later) web app: incidents, map/resources, education, responder tooling (phased). |
| **Stack** | Next.js (App Router), React, Tailwind CSS, shadcn/ui, Neon Postgres, Vercel Blob, Vercel Hosting. |
| **Auth** | Neon Auth (Better Auth) aligned with Neon; **feature-flagged off** for early builds after wiring is complete. |
| **Public vs app** | **Route groups**: marketing pages need **no** session; app routes may eventually require auth. |

**Note:** If a Vite + React prototype exists in the repo, this plan assumes a **Next.js app** as the primary codebase (new `app/` project or migration). Treat the Vite app as prototype until Next bootstrap reaches parity.

---

## 2. High-level architecture

```
[User] → Vercel Edge / Node (Next.js)
           ├── Static / ISR: landing, legal, marketing
           ├── RSC + Server Actions / Route Handlers: app UI + APIs
           └── Auth: Neon Auth (Next.js server integration) [FEATURE FLAG]

Neon Postgres          ← Prisma or Drizzle (pick one)
  ├── public schema (or app_* prefix) — application tables
  └── neon_auth.*      ← managed by Neon Auth (when enabled)

Vercel Blob            ← uploads (photos/videos) via signed upload URLs or server upload

External (later): Mapbox/Google Maps, SMS/email providers, partner webhooks
```

---

## 3. Repository layout (Next.js App Router)

Use **route groups** so URLs stay clean and layouts stay separate:

```
app/
  (marketing)/                    # no auth layout
    layout.tsx                      # marketing chrome, nav, footer
    page.tsx                        # landing
    about/page.tsx
    privacy/page.tsx
    contact/page.tsx

  (app)/                            # product shell (future: auth-gated)
    layout.tsx                      # app sidebar / bottom nav shell
    dashboard/page.tsx
    report/page.tsx
    map/page.tsx
    learn/page.tsx
    settings/page.tsx

  api/
    health/route.ts
    upload/route.ts                 # Blob presign or proxy upload
    webhooks/...                    # later

  auth/[...path]/route.ts           # Neon Auth handler (Next.js) when enabled

lib/
  db/                               # Drizzle or Prisma client + schema
  auth/
    server.ts                       # createNeonAuth (when enabled)
    client.ts                       # createAuthClient (when enabled)
    flags.ts                        # AUTH_ENABLED, etc.

components/
  ui/                               # shadcn
  marketing/
  app/
```

- **`(marketing)`**: default for SEO, fast loads, no session logic in layout.
- **`(app)`**: FESTR product UI; same deployment, different layout and later middleware.

---

## 4. Tech choices (fixed decisions)

| Layer | Choice | Role |
|-------|--------|------|
| **Framework** | Next.js 15+ (App Router) | RSC, route handlers, metadata API, Vercel-first. |
| **Styling** | Tailwind CSS v4 (or v3 if shadcn template locks v3) | Utilities; align with shadcn. |
| **Components** | shadcn/ui | Forms, dialogs, command palette, data tables later. |
| **DB access** | **Drizzle ORM** + `@neondatabase/serverless` (or Neon serverless driver) | Type-safe, good for Neon; Prisma is fine if the team prefers. |
| **Auth** | `@neondatabase/auth` (Neon Auth) + Next.js server routes | Users/sessions in DB; branch-friendly. |
| **Files** | `@vercel/blob` | `put` / multipart; store `url` + metadata in Postgres. |
| **Hosting** | Vercel | Same project: previews per branch. |

### Tailwind + shadcn + Neon Auth CSS

With Next + shadcn, prefer **`@import "@neondatabase/auth/ui/tailwind"`** in global CSS (per Neon docs) and **do not** also import the full `auth/ui/css` bundle — avoids duplicate styles.

---

## 5. Environments and configuration

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Neon pooled connection string (server only). |
| `NEON_AUTH_BASE_URL` | From Neon Console → Auth (when auth on). |
| `NEON_AUTH_COOKIE_SECRET` | 32+ characters; server only. |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob (server). |
| `NEXT_PUBLIC_APP_URL` | Canonical URL (OAuth redirects, links). |
| `AUTH_ENABLED` | `"true"` / `"false"` — feature flag for auth enforcement. |

Use **Vercel Project → Environment Variables** for Preview vs Production. Never expose database or Blob write tokens to the client.

---

## 6. Auth design (full setup, then temporarily disabled)

### 6.1 When `AUTH_ENABLED=true`

- Implement Neon Auth **per official Next.js path**: `createNeonAuth` in `lib/auth/server.ts`, `app/api/auth/[...path]/route.ts`, optional **middleware** for protected prefixes (e.g. `/dashboard`, routes under `(app)` as needed).
- Client: `createAuthClient` from `@neondatabase/auth/next`.
- UI: shadcn + Neon Auth UI components where useful, or custom forms calling the client.

### 6.2 When `AUTH_ENABLED=false` (initial stages)

- **Do not** delete auth code; **short-circuit** behavior:
  - **Middleware:** if `AUTH_ENABLED` is false, **do not** redirect to sign-in; allow defined `(app)` routes.
  - **Server components:** no `getSession()` gates, or return a **dev user / null** consistently.
  - **API routes:** either open for internal testing with a **static shared secret** header, or **IP allowlist** in preview only — document the risk.
- **UI:** hide sign-in / profile; optional banner: “Authentication temporarily disabled.”
- **Database:** optional `dev_user_id` UUID in env for attributing writes during demo (or nullable `created_by`).

### 6.3 Re-enable auth

- Set `AUTH_ENABLED=true`, run smoke tests on sign-in, session cookies, protected routes.

---

## 7. Neon Postgres — conceptual schema (evolve by phase)

Use one schema (e.g. `public`) for app data; **do not** hand-edit `neon_auth` tables.

### Core (Phase 1–2)

- **`profiles`** — `id` (uuid, FK to auth user when auth on), `display_name`, `phone` (optional), `role` enum (`public`, `responder`, `admin`), timestamps.
- **`incidents`** — `id`, `type` enum, `description` (optional), `lat`, `lng`, `accuracy_m`, `status` enum, `is_silent_security` bool, `created_at`, `created_by` nullable.
- **`incident_media`** — `id`, `incident_id`, `blob_url`, `mime`, `size_bytes`, `created_at`.

### Phase 3+

- **`resources`** — AEDs, hospitals, etc.: `kind`, `lat`, `lng`, `name`, `verified_at`, `source`.
- **`audit_log`** — moderation / status changes.

### Indexes

- `(lat, lng)` — PostGIS later, or btree on `lat`/`lng` for MVP; `created_at DESC` on incidents.

### Migrations

- Drizzle Kit or Prisma Migrate; run in CI against a Neon **branch** per PR if branching is adopted.

---

## 8. Vercel Blob — pattern

1. **Client** requests **upload permission** from `POST /api/upload` (or a Server Action).
2. **Server** validates (size, MIME, optional auth later), calls `put()` from `@vercel/blob` or returns a **presigned** flow per current Blob API.
3. **Server** inserts a row in `incident_media` with the returned URL.
4. **Serving:** Store uses **private** blobs; the app streams reads via `/api/...` routes (`get()` + token) with short `Cache-Control`, matching sensitive incident/resource media.

**Limits:** enforce max file size and allowed types (e.g. `image/jpeg`, `image/png`, `video/mp4`) in API.

---

## 9. Landing vs app — UX and SEO

- **Marketing `(marketing)`**: `generateMetadata`, OG images, `sitemap.ts`, `robots.ts`, fast LCP (optimize images with `next/image`).
- **App `(app)`**: may use `noindex` until the product is public, or keep indexed only for marketing URLs.
- **Single domain:** e.g. `festr.app` → `/` marketing, `/report` app — simpler than subdomain split for MVP unless isolation is required.

---

## 10. Security and compliance (minimum discipline)

- **HTTPS** everywhere (Vercel default).
- **Rate limiting** on report and upload APIs (Vercel KV / Upstash Redis or middleware + token bucket later).
- **Input validation:** Zod on all server inputs.
- **Location:** avoid logging exact coordinates in client analytics without consent.
- **Security / silent alerts:** legal review for false alarms and obligations to emergency services before promising dispatch.

---

## 11. Implementation phases

### Phase 0 — Foundation

- Create Next.js app with TypeScript, ESLint, Tailwind, **shadcn init**.
- Add Drizzle (or Prisma) + Neon `DATABASE_URL`; first migration (health check table or migrations metadata).
- Deploy to Vercel; connect repo; Preview deployments on.
- **Marketing layout** + single landing page + placeholder app route.

**Exit criteria:** Production URL loads; DB connects from Vercel.

---

### Phase 1 — Marketing site + app shell (auth off)

- Build **`(marketing)`** pages: home, about, contact, privacy.
- Build **`(app)`** shell: navigation (Report / Map / Learn / Profile), empty pages.
- **`AUTH_ENABLED=false`**; no middleware enforcement.
- Optional: feature-flag component for “Beta”.

**Exit criteria:** Clear separation of landing vs app; navigable information architecture.

---

### Phase 2 — Neon Auth wired, then disabled for demo if needed

- Implement Neon Auth (server + API route + client + UI CSS).
- Test **sign-up / sign-in / sign-out** on Preview with `AUTH_ENABLED=true`.
- For public demo: set `AUTH_ENABLED=false` but keep code paths tested in Preview/staging.

**Exit criteria:** Auth works in staging; production can run without auth for user tests.

---

### Phase 3 — Incidents + Blob (core MVP)

- Tables: `incidents`, `incident_media`, optional `profiles` if auth on.
- **Report flow:** form + geolocation (`navigator.geolocation` + fallback manual map pin later).
- **Upload:** API + Blob + DB row.
- **List/detail:** server components reading from Neon.

**Exit criteria:** End-to-end “create incident with optional media” stored in Neon and files in Blob.

---

### Phase 4 — Map and resources

- Integrate **Mapbox** or Google Maps (`NEXT_PUBLIC_*` token with client restrictions).
- Map view: incidents and/or AED pins from DB.
- “Add AED” flow: form + geocode + photo.

**Exit criteria:** Map reads from Postgres; writes for resources behind validation.

---

### Phase 5 — Education hub

- Content: MDX or CMS later; start with static MDX under `(app)/learn/...`.
- Search later.

**Exit criteria:** Learn section shippable and linkable.

---

### Phase 6 — Responder dashboard (role-based)

- `AUTH_ENABLED=true` in production when ready.
- Roles in `profiles`; middleware protects `/admin` or `/responder`.
- Dashboard: table of incidents, filters, status updates, map.

**Exit criteria:** Only `responder` / `admin` can access dashboard.

---

### Phase 7 — Hardening

- Rate limits, abuse flags, audit log, retention policy for media, backups (Neon PITR per plan), monitoring (Vercel Analytics + error tracking).
- Operational detail: Neon backups / PITR, Blob retention + cron, and Vercel observability — see `docs/operations.md`.

---

## 12. CI/CD

- **GitHub → Vercel** automatic builds.
- **Checks:** `lint`, `typecheck`, `build`; optional `db:migrate` in release workflow (run Neon migrations with care).
- **Branch DBs:** optional Neon branch per preview (advanced).

---

## 13. Migration from a legacy Vite app

1. Scaffold Next app in the repo (or `apps/web` if moving to a monorepo).
2. Port **brand tokens** (e.g. orange / blue) into `globals.css` + shadcn theme.
3. Retire the Vite app when Next parity exceeds it; keep `.env.example` updated.

---

## 14. Open decisions (record before coding)

| Topic | Options |
|-------|---------|
| **ORM** | Drizzle vs Prisma |
| **Maps** | Mapbox vs Google |
| **Guest reporting** | Anonymous incidents vs phone OTP later |
| **i18n** | English first; structure copy for additional languages later |

---

## 15. Summary

- **Next.js route groups** separate marketing from the app.
- **Neon** holds relational data; **Vercel Blob** holds media; **Vercel** hosts the app.
- **Neon Auth** is implemented end-to-end but **gated by `AUTH_ENABLED`** so public pages and core flows can ship before login is mandatory.
- Delivery is **phased**: foundation → shell → auth (tested) → incidents + blob → map → learn → responder dashboard → hardening.

---

*Last updated: 2026-04-05 — stack and auth strategy unchanged; cross-links to [`implementation-status.md`](./implementation-status.md) and [`CHANGELOG.md`](../CHANGELOG.md) (v1.0.0).*
