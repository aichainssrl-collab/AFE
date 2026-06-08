import { notFound } from "next/navigation";
import Link from "next/link";
import { SpecForm } from "@/components/spec-form";
import { ClientOverviewGate } from "@/components/client-overview-gate";
import { getClient } from "@/lib/data";

export default async function ClientSpecPage({
  params,
}: {
  params: Promise<{ client: string }>;
}) {
  const { client: clientId } = await params;
  const client = getClient(clientId);
  if (!client) notFound();

  // Pre-fill the common anagrafica fields from the prospect's known data
  const initialValues = {
    ragione_sociale: client.name,
    settore: client.sector,
    barriera: client.barrierTag,
  };

  return (
    <ClientOverviewGate clientId={client.id}>
      <Link href={`/${client.id}`} className="text-sm text-muted-foreground hover:underline">
        ← Panoramica {client.name}
      </Link>

      <div className="mt-2 mb-6 space-y-1">
        <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: client.accent }}>
          Onboarding progetto · {client.name}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">Specifiche di sviluppo</h1>
        <p className="text-sm text-muted-foreground">
          Requisiti necessari allo sviluppo dell&apos;implementazione per {client.name}. Include una sezione
          dedicata alla sua barriera: <span className="font-medium">{client.barrierTag}</span>.
        </p>
      </div>

      <SpecForm clientId={client.id} prospectName={client.name} initialValues={initialValues} />
    </ClientOverviewGate>
  );
}
