import { ShieldAlert, Sparkles } from "lucide-react";

export function BarrierResponseBox({ barrier, response }: { barrier: string; response: string }) {
  return (
    <div className="grid grid-cols-1 gap-px overflow-hidden rounded-md border bg-border md:grid-cols-2">
      <div className="flex gap-3 bg-rose-50 p-4 dark:bg-rose-950/30">
        <ShieldAlert className="h-5 w-5 shrink-0 text-rose-500" />
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-rose-600">
            Barriera all&apos;adozione
          </p>
          <p className="mt-1 text-sm text-foreground/80">{barrier}</p>
        </div>
      </div>
      <div className="flex gap-3 bg-violet-50 p-4 dark:bg-violet-950/30">
        <Sparkles className="h-5 w-5 shrink-0 text-violet-600" />
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-violet-600">
            La risposta AIchain
          </p>
          <p className="mt-1 text-sm text-foreground/80">{response}</p>
        </div>
      </div>
    </div>
  );
}
