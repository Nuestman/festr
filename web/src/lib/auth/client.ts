"use client";

import { authClient } from "@/lib/auth/auth-client";

export { authClient };

/**
 * @deprecated Prefer importing {@link authClient} from `@/lib/auth/auth-client`.
 */
export function createFestAuthClient() {
  return authClient;
}
