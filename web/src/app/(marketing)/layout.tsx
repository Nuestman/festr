import { MarketingLayout } from "@/components/marketing/marketing-layout";

import "@/styles/marketing-landing.css";

export default function MarketingRouteGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MarketingLayout>{children}</MarketingLayout>;
}
