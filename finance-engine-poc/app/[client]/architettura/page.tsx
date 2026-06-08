import { notFound } from "next/navigation";
import Link from "next/link";
import { ArchitectureDiagram } from "@/components/architecture-diagram";
import { ClientOverviewGate } from "@/components/client-overview-gate";
import { getClient } from "@/lib/data";

export default async function ClientArchitecturePage({
  params,
}: {
  params: Promise<{ client: string }>;
}) {
  const { client: clientId } = await params;
  const client = getClient(clientId);
  if (!client) notFound();

  return (
    <ClientOverviewGate clientId={client.id}>
      <Link href={`/${client.id}`} className="text-sm text-muted-foreground hover:underline">
        ← Panoramica {client.name}
      </Link>

      <div className="mt-2 mb-6 space-y-1">
        <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: client.accent }}>
          Architettura · {client.name}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">Come verrà realizzata l&apos;applicazione</h1>
        <p className="text-sm text-muted-foreground">
          Visione d&apos;insieme del servizio: livelli, flusso dei dati, integrazioni, sicurezza e fasi di
          rilascio, per dare a {client.name} un quadro completo della soluzione.
        </p>
      </div>

      <ArchitectureDiagram client={client} />
    </ClientOverviewGate>
  );
}
