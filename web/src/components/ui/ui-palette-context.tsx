"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { type UiPalette, UI_PALETTE_STORAGE_KEY } from "@/lib/ui-palette";

type Ctx = {
  storageEnabled: boolean;
  palette: UiPalette;
  setPalette: (next: UiPalette) => void;
};

const UiPaletteContext = createContext<Ctx | null>(null);

export function useUiPalette() {
  const v = useContext(UiPaletteContext);
  if (!v) {
    throw new Error("useUiPalette must be used within UiPaletteProvider");
  }
  return v;
}

export function UiPaletteProvider({
  children,
  defaultPalette,
  storageEnabled,
}: {
  children: ReactNode;
  defaultPalette: UiPalette;
  storageEnabled: boolean;
}) {
  const [palette, setPaletteState] = useState<UiPalette>(() => {
    if (typeof document === "undefined") return defaultPalette;
    const attr = document.documentElement.getAttribute("data-ui-palette");
    return attr === "brand" ? "brand" : attr === "neutral" ? "neutral" : defaultPalette;
  });

  const applyToDom = useCallback((next: UiPalette) => {
    document.documentElement.setAttribute("data-ui-palette", next);
  }, []);

  const setPalette = useCallback(
    (next: UiPalette) => {
      applyToDom(next);
      setPaletteState(next);
      if (storageEnabled) {
        try {
          localStorage.setItem(UI_PALETTE_STORAGE_KEY, next);
        } catch {
          /* ignore */
        }
      }
    },
    [applyToDom, storageEnabled],
  );

  useEffect(() => {
    const root = document.documentElement;
    if (!storageEnabled) {
      try {
        localStorage.removeItem(UI_PALETTE_STORAGE_KEY);
      } catch {
        /* ignore */
      }
      applyToDom(defaultPalette);
      setPaletteState(defaultPalette);
      return;
    }

    try {
      const stored = localStorage.getItem(UI_PALETTE_STORAGE_KEY);
      if (stored === "brand" || stored === "neutral") {
        applyToDom(stored);
        setPaletteState(stored);
        return;
      }
    } catch {
      /* ignore */
    }
    applyToDom(defaultPalette);
    setPaletteState(defaultPalette);
  }, [applyToDom, defaultPalette, storageEnabled]);

  const value = useMemo(
    () => ({
      storageEnabled,
      palette,
      setPalette,
    }),
    [palette, setPalette, storageEnabled],
  );

  return <UiPaletteContext.Provider value={value}>{children}</UiPaletteContext.Provider>;
}
