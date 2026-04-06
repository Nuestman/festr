import path from "path";
import { fileURLToPath } from "url";

import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

/** Config file lives in `web/`; also load repo-root `.env` when running `npm run db:push` from monorepo root. */
const webDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(webDir, "..");

config({ path: path.join(repoRoot, ".env.local") });
config({ path: path.join(repoRoot, ".env") });
config({ path: path.join(webDir, ".env.local"), override: true });
config({ path: path.join(webDir, ".env"), override: true });

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
});
