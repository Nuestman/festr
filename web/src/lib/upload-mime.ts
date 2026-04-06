/**
 * Browsers often send empty `File.type` (especially on Windows) or non-standard `image/jpg`.
 */
export function resolveAllowedImageMime(
  file: File,
  allowed: Set<string>,
): { ok: true; mime: string } | { ok: false } {
  let t = file.type?.trim() ?? "";
  if (t === "image/jpg") t = "image/jpeg";
  if (t && allowed.has(t)) {
    return { ok: true, mime: t };
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const fromExt =
    ext === "jpg" || ext === "jpeg"
      ? "image/jpeg"
      : ext === "png"
        ? "image/png"
        : ext === "webp"
          ? "image/webp"
          : null;

  if (fromExt && allowed.has(fromExt)) {
    return { ok: true, mime: fromExt };
  }

  return { ok: false };
}
