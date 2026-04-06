"use client";

import { Palette } from "lucide-react";

import { useUiPalette } from "@/components/ui/ui-palette-context";
import type { UiPalette } from "@/lib/ui-palette";
import { cn } from "@/lib/utils";

function segmentClass(active: boolean) {
  return cn(
    "relative z-10 inline-flex min-h-9 min-w-[5.5rem] flex-1 items-center justify-center rounded-md px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm",
    active
      ? "bg-background text-foreground shadow-sm"
      : "text-muted-foreground hover:text-foreground",
  );
}

export function UiPaletteToggle({ className }: { className?: string }) {
  const { palette, setPalette } = useUiPalette();

  const select = (next: UiPalette) => {
    setPalette(next);
  };

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="flex items-center gap-2 text-muted-foreground">
        <Palette className="size-3.5 shrink-0 opacity-70" aria-hidden />
        <span className="text-xs font-medium tracking-wide">Interface</span>
      </div>
      <div
        role="group"
        aria-label="Interface color palette"
        className="inline-flex rounded-lg border border-border bg-muted/80 p-1 shadow-inner"
      >
        <button
          type="button"
          role="radio"
          aria-checked={palette === "neutral"}
          className={segmentClass(palette === "neutral")}
          onClick={() => select("neutral")}
        >
          Standard
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={palette === "brand"}
          className={segmentClass(palette === "brand")}
          onClick={() => select("brand")}
        >
          Brand
        </button>
      </div>
    </div>
  );
}
