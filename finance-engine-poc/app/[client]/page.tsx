import { notFound } from "next/navigation";
import { OverviewHeroCard } from "@/components/overview-hero-card";
import { KpiCardV2 } from "@/components/kpi-card-v2";
import { RecommendedDemoCta } from "@/components/recommended-demo-cta";
import { OverviewAnalytics } from "@/components/overview-analytics";
import { Glossario } from "@/components/glossario";
import { getClient, CLIENT_FLAGSHIP, PROCESS_NAV_META } from "@/lib/data";

const KPI_ICONS = ["layers", "trend", "check"] as const;

export default async function ClientOverviewPage({
  params,
}: {
  params: Promise<{ client: string }>;
}) {
  const { client: clientId } = await params;
  const client = getClient(clientId);
  if (!client) notFound();

  const flagshipId = CLIENT_FLAGSHIP[client.id] ?? client.dashboards[0]?.id;
  const flagshipLabel = PROCESS_NAV_META[flagshipId]?.navLabel ?? "Demo";

  return (
    <>
      <OverviewHeroCard client={client} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {client.overviewKpis.map((kpi, i) => (
          <KpiCardV2 key={kpi.label} kpi={kpi} accent={client.accent} icon={KPI_ICONS[i % KPI_ICONS.length]} />
        ))}
      </div>

      <OverviewAnalytics clientId={client.id} accent={client.accent} />

      <RecommendedDemoCta
        title={`Demo consigliata · ${flagshipLabel}`}
        description={`Avvia il flusso che risponde direttamente alla barriera di ${client.name}.`}
        href={`/${client.id}/${flagshipId}`}
        accent={client.accent}
      />

      <div className="space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Processi AFC coinvolti
        </p>
        <div className="flex flex-wrap gap-2">
          {client.processNames.map((p) => (
            <span
              key={p}
              className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-xs font-medium text-foreground/80"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" aria-hidden />
              {p}
            </span>
          ))}
        </div>
      </div>

      <Glossario />
    </>
  );
}
