import Script from "next/script";

import { UI_PALETTE_STORAGE_KEY } from "@/lib/ui-palette";

/**
 * When palette persistence is enabled, apply localStorage before paint (pairs with
 * `data-ui-palette-storage="true"` on `<html>`). When disabled, do nothing — server env wins.
 */
export function UiPaletteBootScript() {
  const key = JSON.stringify(UI_PALETTE_STORAGE_KEY);
  const snippet = `(function(){try{var el=document.documentElement;if(el.getAttribute("data-ui-palette-storage")!=="true")return;var p=localStorage.getItem(${key});if(p==="brand"||p==="neutral")el.setAttribute("data-ui-palette",p);}catch(e){}})();`;
  return <Script id="festr-ui-palette-boot" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: snippet }} />;
}
