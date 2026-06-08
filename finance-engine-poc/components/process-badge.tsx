import { CheckCircle2 } from "lucide-react";

export function ProcessBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-xs font-medium text-foreground/80">
      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
      {label}
    </span>
  );
}
