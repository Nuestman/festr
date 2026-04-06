import Link from "next/link";

import { UiPaletteToggle } from "@/components/ui/ui-palette-toggle";
import { isUiPaletteToggleEnabled } from "@/lib/ui-palette";

/** Footer block — DOM matches Vite `src/components/marketing/MarketingLayout.tsx` (lines 34–49). */
export function MarketingFooter() {
  const showPaletteToggle = isUiPaletteToggleEnabled();

  return (
    <footer className="marketing-footer">
      <div className="marketing-footer__inner">
        <div className="marketing-footer__brand">
          <span className="marketing-logo__mark marketing-logo__mark--sm" aria-hidden />
          <span>FESTR</span>
        </div>
        <nav className="marketing-footer__nav" aria-label="Footer">
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/privacy">Privacy</Link>
        </nav>
        <p className="marketing-footer__note">
          First Emergency Support &amp; Trained Response
        </p>
        {showPaletteToggle ? (
          <div className="col-span-full flex justify-center border-t border-border/60 pt-3">
            <UiPaletteToggle />
          </div>
        ) : null}
      </div>
    </footer>
  );
}
