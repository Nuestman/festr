export type UiPalette = "neutral" | "brand";

/** localStorage key — read by boot script + toggle */
export const UI_PALETTE_STORAGE_KEY = "festr-ui-palette";

/** Default from env: `neutral` (shadcn greys) or `brand` (FESTR / Neon tokens). */
export function getServerUiPalette(): UiPalette {
  const v = process.env.NEXT_PUBLIC_UI_PALETTE?.trim().toLowerCase();
  if (v === "brand") return "brand";
  return "neutral";
}

export function isUiPaletteToggleEnabled(): boolean {
  return process.env.NEXT_PUBLIC_SHOW_UI_PALETTE_TOGGLE === "true";
}
