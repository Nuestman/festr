import path from "path";
import { fileURLToPath } from "url";

import { config as loadEnv } from "dotenv";
import type { NextConfig } from "next";

const configDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(configDir, "..");

/**
 * Monorepo: merge repo-root env before Next’s own loading. Does not override vars already set.
 * Uses this file’s directory so it works even if `process.cwd()` is not `web/`.
 */
loadEnv({ path: path.join(repoRoot, ".env.local") });
loadEnv({ path: path.join(repoRoot, ".env") });

const nextConfig: NextConfig = {
  turbopack: {
    // Monorepo: parent repo has another package-lock.json; pin Turbopack to this app.
    root: process.cwd(),
  },
};

export default nextConfig;
