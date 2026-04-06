# Changelog

All notable changes to this repository are documented here. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html) for the **monorepo release** (root `package.json` `version`; `web/package.json` is kept in sync).

## [1.0.0] — 2026-04-05

First **stable MVP** release of the **Next.js** app (`web/`): end-to-end flows for **incidents** and **resources** (create/upload, APIs, storage), data surfaced on the **dashboard** with **role-aware** behaviour (e.g. admin / responder / public, including env-configured allowlists). This **1.0.0** bump is a **major** version in semver terms (`0.x` → `1.y.z`): it signals that the core product loop is implemented and the project is declaring a baseline for future **minor** (additive) and **patch** (fixes) releases.

### Product (`web/`)

- Incidents and resources pipelines with APIs, media where applicable, and dashboard visibility by role.
- Neon Auth integration (feature-flagged), marketing → app routing, post–sign-in redirect to `/dashboard`.
- Map, learn, profile, and related routes as implemented in-tree.

### Repository & documentation

- MIT `LICENSE`, `CONTRIBUTING.md`, `SECURITY.md`, `.github/CODEOWNERS`.
- Package metadata (`author`, UFoundBEC `contributors`, `repository`, `bugs`, `homepage`) on root and `web/package.json`.
- Root / `web` / `src` READMEs, [`docs/implementation-status.md`](docs/implementation-status.md), and this changelog.
- Next.js root `metadata` (authors, publisher, keywords); Vite `index.html` author/keywords; **Trained Response** copy alignment in the prototype.

### Technical

- Monorepo version **1.0.0** on root and `festr-web`.

**Tag:** create **`v1.0.0`** on GitHub when you cut the release.

---

## Pre–1.0.0 history

Earlier **`web/package.json`** used **0.1.0** while the root stayed at **0.0.0**; there was no single semver story for the monorepo until this release.
