import { notFound } from "next/navigation";
import Link from "next/link";
import { ValueSummary } from "@/components/value-summary";
import { getClient } from "@/lib/data";

export default async function ClientValuePage({
  params,
}: {
  params: Promise<{ client: string }>;
}) {
  const { client: clientId } = await params;
  const client = getClient(clientId);
  if (!client) notFound();

  return (
    <>
      <Link href={`/${client.id}`} className="text-sm text-muted-foreground hover:underline">
        ← Panoramica {client.name}
      </Link>

      <div className="mt-2 mb-6 space-y-1">
        <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: client.accent }}>
          Valore & risultati · {client.name}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">Perché scegliere AIchain</h1>
        <p className="text-sm text-muted-foreground">
          Come risolviamo il bisogno di {client.name} e cosa otterrà concretamente dopo averci scelto.
        </p>
      </div>

      <ValueSummary client={client} />
    </>
  );
}
