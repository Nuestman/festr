# Contributing to FESTR

Thank you for your interest in **FESTR** (First Emergency Support & Trained Response), an initiative of the **Usmaniya Foundation for Basic Emergency Care (UFoundBEC)**.

## Versioning

The monorepo release version is in the root **`package.json`** (and **`web/package.json`** is kept in sync). See [`CHANGELOG.md`](./CHANGELOG.md) for what changed each release.

## How to contribute

1. **Issues** — Open a [GitHub issue](https://github.com/Nuestman/festr/issues) for bugs, ideas, or questions.
2. **Pull requests** — Fork the repo, create a branch, and submit a PR against `main`. Keep changes focused and describe what you changed and why.
3. **Local setup** — See the root [README.md](./README.md). Run **`npm run dev:web`** for the Next.js app (`web/`) or **`npm run dev`** for the Vite prototype (`src/` + root `index.html`). Details: [`web/README.md`](./web/README.md), [`src/README.md`](./src/README.md).

## Standards

- Match existing code style and patterns in the touched area.
- Run `npm run lint` when you touch the Vite app, and `npm run lint:web` (plus `npm run build:web` for substantive Next changes) before opening a PR.
- Do not commit secrets (`.env`, `.env.local`); use `.env.example` for documented placeholders.

Maintainer: [Numan Usman](https://nusman.dev) · [nuestman17@gmail.com](mailto:nuestman17@gmail.com)
