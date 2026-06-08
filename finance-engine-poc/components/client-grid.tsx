"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock } from "lucide-react";
import { CLIENTS, type ClientProfile } from "@/lib/data";
import { useAuth } from "@/components/auth-context";

/**
 * Griglia dei clienti con tenant isolation.
 *
 * - Se loggato come admin: mostra tutti i clienti
 * - Se loggato come viewer: mostra SOLO il cliente a cui è associato
 *   + gli altri con un overlay "Accesso negato"
 * - Se non loggato: mostra tutti i clienti con overlay "Accedi per accedere"
 */
export function ClientGrid() {
  const { currentUser, isAuthenticated, isAdmin, hydrated } = useAuth();

  const visible = filterClients(CLIENTS, currentUser);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {visible.map((entry) => {
        const { client, allowed, reason } = entry;
        if (!allowed && reason) {
          return (
            <LockedClientCard key={client.id} client={client} reason={reason} />
          );
        }
        return <AllowedClientCard key={client.id} client={client} />;
      })}
    </div>
  );
}

function AllowedClientCard({ client }: { client: ClientProfile }) {
  return (
    <Link href={`/${client.id}`} className="group">
      <Card className="relative h-full overflow-hidden transition-all duration-150 group-hover:-translate-y-1 group-hover:shadow-lg">
        <span
          className="pointer-events-none absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 transition-transform duration-150 group-hover:scale-x-100"
          style={{ backgroundColor: client.accent }}
          aria-hidden
        />
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{client.name}</CardTitle>
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: client.accent }}
              aria-hidden
            />
          </div>
          <CardDescription>{client.sector}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">{client.pitch}</p>
          <Badge
            variant="secondary"
            className="text-xs"
            style={{ backgroundColor: client.accentSoft, color: client.accent }}
          >
            Barriera: {client.barrierTag}
          </Badge>
        </CardContent>
      </Card>
    </Link>
  );
}

function LockedClientCard({
  client,
  reason,
}: {
  client: ClientProfile;
  reason: "unauthenticated" | "other-tenant";
}) {
  return (
    <Card className="relative h-full overflow-hidden opacity-60">
      <span
        className="pointer-events-none absolute inset-x-0 top-0 h-[3px]"
        style={{ backgroundColor: client.accent, opacity: 0.3 }}
        aria-hidden
      />
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-muted-foreground">{client.name}</CardTitle>
          <Lock className="h-4 w-4 text-muted-foreground" />
        </div>
        <CardDescription>{client.sector}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          {reason === "unauthenticated"
            ? "Accedi per visualizzare questo cliente"
            : "Stanza riservata a un'altra utenza"}
        </p>
        <Badge variant="outline" className="text-xs">
          <Lock className="mr-1 h-3 w-3" /> Accesso riservato
        </Badge>
      </CardContent>
    </Card>
  );
}

/* --- Helpers ----------------------------------------------------------- */

type ClientEntry =
  | { client: ClientProfile; allowed: true; reason?: undefined }
  | { client: ClientProfile; allowed: false; reason: "unauthenticated" | "other-tenant" };

function filterClients(
  clients: ClientProfile[],
  user: ReturnType<typeof useAuth>["currentUser"],
): ClientEntry[] {
  // Render server-friendly: quando user è null in SSR, trattalo come "unauthenticated"
  return clients.map((c) => {
    if (!user) {
      // Non loggato: blocchiamo l'accesso (verrà mostrato overlay "Accedi").
      // Manteniamo comunque la card per informare l'utente che il cliente esiste.
      return { client: c, allowed: false, reason: "unauthenticated" as const };
    }
    if (user.role === "admin") {
      return { client: c, allowed: true };
    }
    // viewer
    if (user.clientId === c.id) {
      return { client: c, allowed: true };
    }
    return { client: c, allowed: false, reason: "other-tenant" as const };
  });
}
