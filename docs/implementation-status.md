# FESTR — implementation status

**Monorepo version:** **1.0.0** (see root and `web/package.json`, and [`CHANGELOG.md`](../CHANGELOG.md)).  
**Plan reference:** [`technical-plan.md`](./technical-plan.md).

This is a **living snapshot** of progress against the phased plan. Update it when phases complete or scope shifts.

---

## Summary

| Area | State |
|------|--------|
| **Primary app** | Next.js 16 App Router in `web/` — marketing + app routes, APIs, Drizzle + Neon. **v1.0.0** MVP: incidents + resources, dashboard by role. |
| **Prototype** | Vite + React Router at repo root (`src/`, `index.html`) — marketing parity; not the deployment target. |
| **Auth** | Neon Auth wired (`/api/auth`, `NeonAuthUIProvider`, `AuthView`); gated by `AUTH_ENABLED` / `NEXT_PUBLIC_AUTH_ENABLED`. Middleware uses Neon helper when auth package is active. |
| **Data & APIs** | Incidents, resources, map data, geocode, health; media upload routes; cron purge; audit / rate-limit as implemented. |
| **Governance** | MIT license, CONTRIBUTING, SECURITY, CODEOWNERS, package + HTML metadata for maintainer and UFoundBEC. |

---

## Phases vs plan

| Phase | Plan (short) | Status | Notes |
|-------|----------------|--------|--------|
| **0** — Foundation | Next + Tailwind + DB connect; deploy path | **Done** | Drizzle + Neon; Vercel-oriented layout. |
| **1** — Marketing + app shell | `(marketing)` + `(app)` shell | **Done** | Landing, about, contact, privacy; app shell with dashboard, report, map, learn, profile, incidents, resources. |
| **2** — Neon Auth | Wired + flag | **Done** | Sign-in/up flows; post–sign-in redirect to `/dashboard`; marketing CTAs respect session when auth on. |
| **3** — Incidents + Blob | Core MVP | **Done (MVP)** | Create/list incidents, media APIs, storage path — aligned with **v1.0.0** scope. |
| **4** — Map & resources | Map + pins + resource flows | **Done (MVP)** | Resources upload/flow + map integration as shipped; further polish can be **1.x** minors. |
| **5** — Education | MDX learn hub | **In progress** | Learn routes + content under `web/src/content/learn/`; expand over time. |
| **6** — Responder dashboard | Role-based | **Done (MVP)** | Dashboard + role behaviour (incl. env allowlists); deeper responder tooling can grow in **1.x**. |
| **7** — Hardening | Rate limits, audit, monitoring | **Ongoing** | Partially implemented; continuous improvement in patch/minor releases. |

---

## Open follow-ups (from plan)

- CI: keep `lint` / `build` / `typecheck` green on `main` before tags.
- Tag **`v1.0.0`** on GitHub after push when ready (see [`CHANGELOG.md`](../CHANGELOG.md)).

---

*Last updated: 2026-04-05 — aligned with v1.0.0 and [`CHANGELOG.md`](../CHANGELOG.md).*
