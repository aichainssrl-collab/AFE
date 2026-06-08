"use client";

import { TenantGate } from "@/components/tenant-gate";
import { UserSwitcher } from "@/components/user-switcher";

/**
 * Wrapper client per le pagine /[client]/*. Mostra il UserSwitcher in alto
 * e applica il TenantGate (redirect a /denied o /settings se non autorizzato).
 */
export function ClientOverviewGate({
  clientId,
  children,
}: {
  clientId: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex justify-end px-6 pt-3 sm:px-10">
        <UserSwitcher />
      </div>
      <TenantGate clientId={clientId}>{children}</TenantGate>
    </>
  );
}
