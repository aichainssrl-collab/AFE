import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkline } from "@/components/sparkline";
import type { Kpi } from "@/lib/data";
import { cn } from "@/lib/utils";

export function KpiCard({ kpi, accent }: { kpi: Kpi; accent?: string }) {
  const toneClass =
    kpi.deltaTone === "success"
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
      : kpi.deltaTone === "danger"
      ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
      : "bg-muted text-muted-foreground";

  return (
    <Card className="gap-2">
      <CardHeader className="pb-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.label}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-end justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-2xl font-semibold tabular-nums" style={{ color: accent }}>
              {kpi.value}
            </span>
            {kpi.unit && <span className="text-sm text-muted-foreground">{kpi.unit}</span>}
          </div>
          <div className="flex items-center gap-2">
            {kpi.delta && (
              <Badge variant="secondary" className={cn("text-xs", toneClass)}>
                {kpi.delta}
              </Badge>
            )}
            {kpi.note && <span className="text-xs text-muted-foreground">{kpi.note}</span>}
          </div>
        </div>
        {kpi.spark && <Sparkline data={kpi.spark} color={accent} />}
      </CardContent>
    </Card>
  );
}
