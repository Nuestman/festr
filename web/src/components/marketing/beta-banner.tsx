/**
 * Optional strip when `NEXT_PUBLIC_BETA_BANNER=true` (e.g. public previews).
 */
export function BetaBanner() {
  if (process.env.NEXT_PUBLIC_BETA_BANNER !== "true") {
    return null;
  }
  return (
    <div
      role="status"
      className="border-b border-amber-200 bg-amber-50 px-6 py-2 text-center text-sm text-amber-950 md:px-4 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100"
    >
      Beta — features and policies may change. Not for emergency dispatch.
    </div>
  );
}
