import { createAuthClient } from '@neondatabase/neon-js/auth'
import { BetterAuthReactAdapter } from '@neondatabase/neon-js/auth/react'

const authUrl = import.meta.env.VITE_NEON_AUTH_URL ?? ''

/** True when `VITE_NEON_AUTH_URL` is set (Neon Console → Auth → Configuration). */
export const authConfigured = authUrl.length > 0

export const authClient = createAuthClient(authUrl, {
  adapter: BetterAuthReactAdapter(),
})
