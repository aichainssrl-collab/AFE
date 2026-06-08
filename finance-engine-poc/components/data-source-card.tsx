import { Server, Users, FileSpreadsheet, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { IngestionSource } from "@/lib/data";

const ICONS = { erp: Server, crm: Users, file: FileSpreadsheet, db: Database } as const;

const PROGRESS_TONE = (p: number) =>
  p >= 60 ? "bg-amber-500" : "bg-rose-500";

export function DataSourceCard({ source }: { source: IngestionSource }) {
  const Icon = ICONS[source.icon];
  return (
    <div className="flex items-center gap-4 rounded-lg border bg-card p-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent text-foreground/70">
        <Icon className="h-4 w-4" />
      </span>
      <div className="flex-1 space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium">{source.name}</p>
          <Badge variant="secondary" className="text-[10px] uppercase text-muted-foreground">
            {source.status}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">{source.meta}</p>
        <div className="flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full ${PROGRESS_TONE(source.progress)}`}
              style={{ width: `${source.progress}%` }}
            />
          </div>
          <span className="text-xs tabular-nums text-muted-foreground">{source.progress}%</span>
        </div>
      </div>
    </div>
  );
}
