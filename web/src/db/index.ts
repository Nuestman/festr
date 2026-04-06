import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "@/db/schema";
import { getEnv } from "@/lib/env";

let db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (!db) {
    const { DATABASE_URL } = getEnv();
    db = drizzle({ client: neon(DATABASE_URL), schema });
  }
  return db;
}

export * from "@/db/schema";
