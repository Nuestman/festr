import type { RequestErrorContext } from "next/dist/server/instrumentation/types";

/**
 * Server-side request errors are logged here; Vercel captures stdout in production.
 * Pair with Vercel → Monitoring / Logs and optional third-party APM.
 */
export async function onRequestError(
  error: unknown,
  errorRequest: Readonly<{ path: string; method: string }>,
  errorContext: Readonly<RequestErrorContext>,
): Promise<void> {
  const message = error instanceof Error ? error.message : String(error);
  const digest = error instanceof Error && "digest" in error ? String((error as Error & { digest?: string }).digest) : "";
  console.error(
    "[festr:request-error]",
    message,
    digest ? `digest=${digest}` : "",
    errorRequest.method,
    errorRequest.path,
    errorContext.routeType,
    errorContext.routePath,
  );
}
