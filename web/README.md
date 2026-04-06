# FESTR — Next.js app

[![Release](https://img.shields.io/badge/Release-v1.0.0-8b5cf6?style=for-the-badge)](https://github.com/Nuestman/festr/blob/main/CHANGELOG.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)](https://github.com/Nuestman/festr/blob/main/LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)

This directory is the **primary** FESTR application: **Next.js** (App Router), Tailwind, Neon Postgres, Drizzle, Neon Auth, Vercel Blob/Analytics. The **Vite + React** prototype lives at the repo root (`src/`, `index.html`); see [`src/README.md`](../src/README.md).

`package.json` here and `metadata` in `src/app/layout.tsx` carry the same **author**, **license**, and **repository** intent as the Vite side (root `package.json` + `index.html`).

- **Repository:** [github.com/Nuestman/festr](https://github.com/Nuestman/festr)
- **Maintainer:** [Numan Usman](https://nusman.dev) · [nuestman17@gmail.com](mailto:nuestman17@gmail.com)
- **Initiative:** Usmaniya Foundation for Basic Emergency Care (**UFoundBEC**)

Full setup, scripts, and layout are documented in the [root README](../README.md). **Implementation status:** [`docs/implementation-status.md`](../docs/implementation-status.md).

## Run locally

```bash
# repository root
npm install
cp web/.env.example web/.env.local
# edit web/.env.local, then:
npm run dev:web
```

Or from this directory after root `npm install`:

```bash
cp .env.example .env.local
npm run dev
```

App default URL: [http://localhost:17013](http://localhost:17013).

```bash
npm run build
npm run lint
```

## Env

Copy `web/.env.example` → `web/.env.local`. Never commit secrets.
