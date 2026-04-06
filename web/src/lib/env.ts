import { z } from "zod";

import { envLoadedFilesHint, summarizeDatabaseUrl } from "@/lib/env-diagnostics";

/** Empty env values in `.env` files often become `""` and break `.url()` / `.optional()`. */
function emptyToUndefined(value: unknown): unknown {
  if (value === undefined || value === null) return undefined;
  if (typeof value === "string" && value.trim() === "") return undefined;
  return value;
}

const optionalUrl = z.preprocess(emptyToUndefined, z.string().url().optional());

const optionalNonEmpty = z.preprocess(emptyToUndefined, z.string().min(1).optional());

const envSchema = z
  .object({
    DATABASE_URL: z.preprocess(
      (v) => (typeof v === "string" ? v.trim() : v),
      z.string().min(1, "DATABASE_URL is required"),
    ),
    NEXT_PUBLIC_APP_URL: optionalUrl,
    AUTH_ENABLED: z
      .string()
      .optional()
      .transform((v) => v === "true"),
    NEON_AUTH_BASE_URL: optionalUrl,
    NEON_AUTH_COOKIE_SECRET: z.preprocess(emptyToUndefined, z.string().min(32).optional()),
    BLOB_READ_WRITE_TOKEN: optionalNonEmpty,
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: optionalNonEmpty,
    FESTR_ADMIN_EMAILS: optionalNonEmpty,
    FESTR_RESPONDER_EMAILS: optionalNonEmpty,
  })
  .superRefine((data, ctx) => {
    if (!data.AUTH_ENABLED) return;
    if (!data.NEON_AUTH_BASE_URL) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "NEON_AUTH_BASE_URL is required when AUTH_ENABLED=true",
        path: ["NEON_AUTH_BASE_URL"],
      });
    }
    if (!data.NEON_AUTH_COOKIE_SECRET) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "NEON_AUTH_COOKIE_SECRET is required when AUTH_ENABLED=true (32+ characters)",
        path: ["NEON_AUTH_COOKIE_SECRET"],
      });
    }
  });

export type Env = z.infer<typeof envSchema>;

export type EnvStatus =
  | {
      ok: true;
      data: Env;
      databaseSummary: string | null;
    }
  | {
      ok: false;
      formErrors: string[];
      fieldErrors: Record<string, string[] | undefined>;
      databaseSummary: string | null;
    };

let cached: Env | null = null;
let envLogged = false;

export function getEnvStatus(): EnvStatus {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const flat = parsed.error.flatten();
    return {
      ok: false,
      formErrors: flat.formErrors,
      fieldErrors: flat.fieldErrors,
      databaseSummary: summarizeDatabaseUrl(process.env.DATABASE_URL),
    };
  }
  return {
    ok: true,
    data: parsed.data,
    databaseSummary: summarizeDatabaseUrl(parsed.data.DATABASE_URL),
  };
}

export function getEnv(): Env {
  if (cached) return cached;
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const flat = parsed.error.flatten();
    if (process.env.NODE_ENV === "development") {
      console.error("[festr:env] Validation failed — field errors:", flat.fieldErrors);
      console.error("[festr:env] Form errors:", flat.formErrors);
      console.error("[festr:env]", envLoadedFilesHint());
      console.error(
        "[festr:env] DATABASE_URL non-empty:",
        Boolean(process.env.DATABASE_URL?.trim()),
        "| summary:",
        summarizeDatabaseUrl(process.env.DATABASE_URL) ?? "(none)",
      );
    }
    throw parsed.error;
  }
  cached = parsed.data;
  if (!envLogged && process.env.NODE_ENV === "development") {
    envLogged = true;
    console.info(
      "[festr:env] Loaded OK — DB:",
      summarizeDatabaseUrl(cached.DATABASE_URL),
      "| AUTH_ENABLED:",
      cached.AUTH_ENABLED,
    );
  }
  return cached;
}

export function resetEnvCacheForTests(): void {
  cached = null;
  envLogged = false;
}
