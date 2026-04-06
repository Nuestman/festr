import { createAuthServer } from "@neondatabase/auth/next/server";

import { isAuthEnabled } from "./flags";

let authServer: ReturnType<typeof createAuthServer> | null = null;

export function getAuthServer() {
  if (!isAuthEnabled()) return null;
  if (!authServer) authServer = createAuthServer();
  return authServer;
}
