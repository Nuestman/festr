import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { DM_Sans, Geist_Mono, Outfit } from "next/font/google";

import { NeonAuthProvider } from "@/components/auth/neon-auth-provider";
import { UiPaletteBootScript } from "@/components/ui/ui-palette-boot-script";
import { UiPaletteProvider } from "@/components/ui/ui-palette-context";
import { getServerUiPalette, isUiPaletteToggleEnabled } from "@/lib/ui-palette";

import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FESTR",
  description:
    "First Emergency Support & Trained Response — marketing site and app.",
  authors: [{ name: "Numan Usman", url: "https://nusman.dev" }],
  creator: "Numan Usman",
  publisher: "Usmaniya Foundation for Basic Emergency Care (UFoundBEC)",
  keywords: [
    "FESTR",
    "First Emergency Support & Trained Response",
    "emergency",
    "first aid",
    "community reporting",
    "UFoundBEC",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const uiPalette = getServerUiPalette();
  const paletteStorageEnabled = isUiPaletteToggleEnabled();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-ui-palette={uiPalette}
      data-ui-palette-storage={paletteStorageEnabled ? "true" : "false"}
      className={`${dmSans.variable} ${outfit.variable} ${geistMono.variable} h-full min-h-dvh antialiased`}
    >
      <body className="flex min-h-dvh flex-col" suppressHydrationWarning>
        <UiPaletteBootScript />
        <UiPaletteProvider defaultPalette={uiPalette} storageEnabled={paletteStorageEnabled}>
          <div className="flex min-h-0 flex-1 flex-col">
            <NeonAuthProvider>{children}</NeonAuthProvider>
          </div>
        </UiPaletteProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
