import type { Metadata } from "next";

import { AboutContent } from "@/components/marketing/about-content";

export const metadata: Metadata = {
  title: "About — FESTR",
  description:
    "Why FESTR exists: emergency preparedness, pre-hospital coordination, and community-powered reporting—built from frontline experience in Ghana.",
};

export default function AboutPage() {
  return (
    <main id="main-content" className="about-main">
      <AboutContent />
    </main>
  );
}
