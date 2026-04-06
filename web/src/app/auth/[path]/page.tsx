import { AuthView } from "@neondatabase/auth/react";

import { AuthShell } from "@/components/auth/auth-shell";

type Props = {
  params: Promise<{ path: string }>;
};

export default async function AuthPathPage({ params }: Props) {
  const { path } = await params;
  return (
    <AuthShell subtitle="Secure access for field operations">
      <AuthView path={path} />
    </AuthShell>
  );
}
