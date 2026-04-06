import { AppShellHeader } from "@/components/app/app-shell-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { getAppHeaderProfile, shouldShowDashboardNav } from "@/lib/profile";

export default async function AppShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const showDashboard = await shouldShowDashboardNav();
  const profileHeader = await getAppHeaderProfile();
  const nav = [
    ...(showDashboard ? [{ href: "/dashboard" as const, label: "Dashboard" }] : []),
    { href: "/report" as const, label: "Report" },
    { href: "/map" as const, label: "Map" },
    { href: "/learn" as const, label: "Learn" },
  ];

  return (
    <div className="flex min-h-dvh flex-1 flex-col bg-background">
      <AppShellHeader nav={nav} profileHeader={profileHeader} />
      <main className="mx-auto flex w-full min-h-0 max-w-5xl flex-1 flex-col px-6 py-8 md:px-4">{children}</main>
      <div className="shrink-0">
        <MarketingFooter />
      </div>
    </div>
  );
}
