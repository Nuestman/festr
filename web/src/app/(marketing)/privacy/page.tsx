import type { Metadata } from "next";

import { PrivacyContent } from "@/components/marketing/privacy-content";

export const metadata: Metadata = {
  title: "Privacy — FESTR",
  description:
    "How FESTR handles personal data, location, cookies, and your rights. Read before using the site or app.",
};

export default function PrivacyPage() {
  return (
    <main id="main-content" className="privacy-main">
      <PrivacyContent />
    </main>
  );
}
