import Link from "next/link";
import { ArrowRight, CheckCircle2, Target, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  VALUE_PROPS,
  CLIENT_FLAGSHIP,
  PROCESS_NAV_META,
  type ClientProfile,
} from "@/lib/data";

export function ValueSummary({ client }: { client: ClientProfile }) {
  const v = VALUE_PROPS[client.id];
  if (!v) return null;

  const accent = client.accent;
  const flagshipId = CLIENT_FLAGSHIP[client.id] ?? client.dashboards[0]?.id;
  const flagshipLabel = PROCESS_NAV_META[flagshipId]?.navLabel ?? "Demo";

  return (
    <div className="space-y-6">
      {/* Need */}
      <div className="rounded-lg border border-l-4 bg-card p-5" style={{ borderLeftColor: accent }}>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Il bisogno</p>
        <p className="mt-1 text-sm">{client.barrier}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* How we solve it */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base font-medium">
              <Target className="h-4 w-4" style={{ color: accent }} />
              Come lo risolviamo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {v.howWeSolve.map((step, i) => (
                <li key={step} className="flex items-start gap-3">
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: accent }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-sm text-muted-foreground">{step}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        {/* What you get */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base font-medium">
              <Sparkles className="h-4 w-4" style={{ color: accent }} />
              Cosa avrai con AIchain
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {v.whatYouGet.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: accent }} />
                  <span className="text-sm text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Before -> After */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Prima → Dopo</CardTitle>
          <p className="text-sm text-muted-foreground">Il cambiamento concreto per {client.name}.</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="hidden grid-cols-[1fr_auto_1fr] gap-4 px-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground sm:grid">
              <span>Oggi</span>
              <span />
              <span>Con AIchain</span>
            </div>
            {v.transform.map((t) => (
              <div
                key={t.label}
                className="grid grid-cols-1 items-center gap-2 rounded-md border p-3 sm:grid-cols-[1fr_auto_1fr] sm:gap-4"
              >
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{t.label}</p>
                  <p className="text-sm text-muted-foreground line-through decoration-muted-foreground/40">{t.prima}</p>
                </div>
                <ArrowRight className="hidden h-4 w-4 shrink-0 text-muted-foreground sm:block" />
                <p className="text-sm font-semibold" style={{ color: accent }}>
                  {t.dopo}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Outcome + CTA */}
      <div
        className="flex flex-wrap items-center justify-between gap-4 rounded-lg p-5"
        style={{ backgroundColor: `${accent}12` }}
      >
        <p className="text-base font-semibold" style={{ color: accent }}>
          {v.outcome}
        </p>
        <Link
          href={`/${client.id}/${flagshipId}`}
          className={cn(buttonVariants(), "gap-1.5 border-0 text-white hover:opacity-90 hover:text-white")}
          style={{ backgroundColor: accent }}
        >
          Vedi la demo · {flagshipLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
