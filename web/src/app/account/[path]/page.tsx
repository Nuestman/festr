import { AccountView } from "@neondatabase/auth/react";

import { AuthShell } from "@/components/auth/auth-shell";

type Props = {
  params: Promise<{ path: string }>;
};

export default async function AccountPathPage({ params }: Props) {
  const { path } = await params;
  return (
    <AuthShell subtitle="Your account and security" variant="wide">
      <AccountView path={path} />
    </AuthShell>
  );
}
