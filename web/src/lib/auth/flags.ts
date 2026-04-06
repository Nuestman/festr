/**
 * Edge-safe: reads `AUTH_ENABLED` without importing Zod / full env parsing.
 * Use `getEnv()` in Route Handlers and Server Components when you need validated config.
 */
export function isAuthEnabled(): boolean {
  return process.env.AUTH_ENABLED === "true";
}

/**
 * Client components: set `NEXT_PUBLIC_AUTH_ENABLED` to the same value as `AUTH_ENABLED`
 * when you need to hide auth UI without a server parent.
 */
export function isAuthEnabledClient(): boolean {
  return process.env.NEXT_PUBLIC_AUTH_ENABLED === "true";
}
