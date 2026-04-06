# FESTR

[![Release](https://img.shields.io/badge/Release-v1.0.0-8b5cf6?style=for-the-badge)](./CHANGELOG.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-149eca?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)

[![GitHub Repo](https://img.shields.io/badge/GitHub-Nuestman%2Ffestr-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Nuestman/festr)
[![Website](https://img.shields.io/badge/Website-festr.net-0ea5e9?style=for-the-badge)](https://www.festr.net)
[![Author](https://img.shields.io/badge/Maintainer-Numan%20Usman-7c3aed?style=for-the-badge)](https://nusman.dev)

**First Emergency Support & Trained Response** — a community-powered web application for structured emergency reporting, resources, and learning.

**UFoundBEC** — Usmaniya Foundation for Basic Emergency Care. Led by [Numan Usman](https://nusman.dev) · [nuestman17@gmail.com](mailto:nuestman17@gmail.com).

**Changelog:** [`CHANGELOG.md`](./CHANGELOG.md) · **Implementation status:** [`docs/implementation-status.md`](./docs/implementation-status.md) · **Technical plan:** [`docs/technical-plan.md`](./docs/technical-plan.md)

---

## Repository layout

| Path | Role |
|------|------|
| **`web/`** | Primary **Next.js** app (App Router): marketing, auth, dashboard, APIs, Drizzle + Neon. See [`web/README.md`](./web/README.md). |
| **`src/`** | **Vite + React Router** prototype. See [`src/README.md`](./src/README.md). |
| **`docs/`** | Technical plan, implementation status, marketing notes. |

See [`docs/technical-plan.md`](./docs/technical-plan.md) for stack and phased delivery.

## Requirements

- **Node.js** (LTS recommended)
- **npm** (repo uses npm workspaces-style commands from root)

## Quick start (Next.js — primary app)

From the repository root:

```bash
npm install
cp web/.env.example web/.env.local
```

Edit `web/.env.local` with your Neon URL, auth flags, and any Map/Blob keys (see `web/.env.example`).

```bash
npm run dev:web
```

Open [http://localhost:17013](http://localhost:17013).

| Command | Description |
|---------|-------------|
| `npm run build:web` | Production build of `web/` |
| `npm run lint:web` | ESLint for `web/` |
| `npm run start:web` | Start Next production server (after build) |
| `npm run db:push` | Push Drizzle schema (runs in `web/`) |
| `npm run db:studio` | Drizzle Studio |

## Quick start (Vite — prototype)

From the repository root:

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) (Vite default).

| Command | Description |
|---------|-------------|
| `npm run build` | Production build of the Vite app |
| `npm run preview` | Preview the Vite production build |
| `npm run lint` | ESLint for the Vite / root TS sources |

Author and project metadata are in **root `package.json`**, **`index.html`**, and **[`src/README.md`](./src/README.md)**. The Next app mirrors the same maintainer/org in **`web/package.json`** and **`web/src/app/layout.tsx`** metadata.

## Contributing & security

- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [SECURITY.md](./SECURITY.md)

## License

[MIT](./LICENSE) — Copyright (c) 2026 Usmaniya Foundation for Basic Emergency Care (UFoundBEC).
