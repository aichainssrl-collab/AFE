import { Layers, TrendingUp, CheckCircle2 } from "lucide-react";
import { Sparkline } from "@/components/sparkline";
import type { Kpi } from "@/lib/data";
import { cn } from "@/lib/utils";

const ICONS = { layers: Layers, trend: TrendingUp, check: CheckCircle2 } as const;

export function KpiCardV2({
  kpi,
  accent,
  icon = "layers",
}: {
  kpi: Kpi;
  accent?: string;
  icon?: keyof typeof ICONS;
}) {
  const Icon = ICONS[icon];
  const toneClass =
    kpi.deltaTone === "success"
      ? "text-emerald-600"
      : kpi.deltaTone === "danger"
      ? "text-red-600"
      : "text-muted-foreground";

  return (
    <div className="space-y-3 rounded-lg border bg-card p-4">
      <div className="flex items-start justify-between">
        <p className="text-sm text-muted-foreground">{kpi.label}</p>
        <span
          className="flex h-8 w-8 items-center justify-center rounded-md"
          style={{ backgroundColor: `${accent}1A`, color: accent }}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="font-mono text-3xl font-semibold tabular-nums">{kpi.value}</span>
        {kpi.unit && <span className="text-sm text-muted-foreground">{kpi.unit}</span>}
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className={cn("flex items-center gap-1 text-xs font-medium", toneClass)}>
          {kpi.delta ?? kpi.note}
        </span>
        {kpi.spark && <Sparkline data={kpi.spark} color={accent} />}
      </div>
    </div>
  );
}
