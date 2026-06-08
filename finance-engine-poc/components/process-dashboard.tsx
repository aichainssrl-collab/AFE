import { Lightbulb } from "lucide-react";
import type { ProcessDashboard } from "@/lib/data";
import { SECTOR_CONTEXT } from "@/lib/data";
import { KpiCard } from "@/components/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function SectorContextPanel({ clientId, accent }: { clientId: string; accent: string }) {
  const ctx = SECTOR_CONTEXT[clientId];
  if (!ctx) return null;

  const { benchmark: b } = ctx;
  const max = Math.max(b.you, b.sector) || 1;
  const youPct = (b.you / max) * 100;
  const sectorPct = (b.sector / max) * 100;
  const fmt = (n: number) => `${n.toLocaleString("it-IT")}${b.unit ? ` ${b.unit}` : ""}`;

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base font-medium">
            <Lightbulb className="h-4 w-4" style={{ color: accent }} />
            Cosa significa per il settore {ctx.sector}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">{ctx.intro}</p>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            {ctx.insights.map((i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: accent }} />
                {i}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Benchmark di settore</CardTitle>
          <p className="text-sm text-muted-foreground">{b.metric}</p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium" style={{ color: accent }}>
                Con AIchain
              </span>
              <span className="font-mono tabular-nums">{fmt(b.you)}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full" style={{ width: `${youPct}%`, backgroundColor: accent }} />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Media di settore</span>
              <span className="font-mono tabular-nums text-muted-foreground">{fmt(b.sector)}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full bg-muted-foreground/40" style={{ width: `${sectorPct}%` }} />
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground">
            {b.betterWhenLower ? "Valore più basso = risultato migliore." : "Valore più alto = risultato migliore."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export function ProcessDashboardView({
  dashboard,
  accent,
  clientId,
}: {
  dashboard: ProcessDashboard;
  accent?: string;
  clientId?: string;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">{dashboard.title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {dashboard.kpis.map((kpi) => (
          <KpiCard key={kpi.label} kpi={kpi} accent={accent} />
        ))}
      </div>
      {clientId && <SectorContextPanel clientId={clientId} accent={accent ?? "#5b3e91"} />}
    </section>
  );
}
