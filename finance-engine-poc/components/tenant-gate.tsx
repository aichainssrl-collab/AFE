"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-context";

/**
 * TenantGate — wrapper client per pagine `/[client]/...`.
 *
 * Comportamento:
 *  - se l'utente non è loggato → redirect a /settings
 *  - se l'utente è loggato ma non ha accesso al clientId → redirect a /denied
 *  - altrimenti renderizza i children
 *
 * Mostra uno stato di loading finché l'auth non è idratata.
 */
export function TenantGate({
  clientId,
  children,
}: {
  clientId: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const { currentUser, isAuthenticated, canAccessClient, hydrated } = useAuth();
  // hydrated: false in SSR / primo render; vero dopo useEffect di AuthProvider
  const [isHydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated || !hydrated) return;
    if (!isAuthenticated) {
      router.replace("/settings");
      return;
    }
    if (!canAccessClient(clientId)) {
      router.replace("/denied");
    }
  }, [isHydrated, hydrated, isAuthenticated, canAccessClient, clientId, router]);

  if (!isHydrated || !hydrated) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Caricamento…</p>
      </div>
    );
  }

  if (!isAuthenticated || !currentUser) return null;
  if (!canAccessClient(clientId)) return null;

  return <>{children}</>;
}
