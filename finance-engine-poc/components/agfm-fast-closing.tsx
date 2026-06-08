"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkline } from "@/components/sparkline";
import { Zap, Check, RotateCcw, Cloud } from "lucide-react";
import { FAST_CLOSING } from "@/lib/data";
import { cn, toneClass } from "@/lib/utils";

type Phase = "idle" | "running" | "done";

export function AgfmFastClosing({ accent }: { accent: string }) {
  const steps = FAST_CLOSING.steps;
  const [phase, setPhase] = useState<Phase>("idle");
  const [prog, setProg] = useState<number[]>(steps.map(() => 0));
  const [active, setActive] = useState(-1);
  const raf = useRef<number | null>(null);
  const idxRef = useRef(0);

  useEffect(() => () => { if (raf.current) cancelAnimationFrame(raf.current); }, []);

  function run() {
    setPhase("running");
    setProg(steps.map(() => 0));
    idxRef.current = 0;
    const doStep = () => {
      const i = idxRef.current;
      if (i >= steps.length) {
        setActive(-1);
        setTimeout(() => setPhase("done"), 420);
        return;
      }
      setActive(i);
      const dur = steps[i].ms;
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(100, ((now - start) / dur) * 100);
        setProg((prev) => { const n = [...prev]; n[i] = p; return n; });
        if (p < 100) raf.current = requestAnimationFrame(tick);
        else { idxRef.current = i + 1; setTimeout(doStep, 200); }
      };
      raf.current = requestAnimationFrame(tick);
    };
    doStep();
  }

  function reset() {
    if (raf.current) cancelAnimationFrame(raf.current);
    setPhase("idle");
    setProg(steps.map(() => 0));
    setActive(-1);
  }

  if (phase === "done") return <FastClosingResults accent={accent} onReset={reset} />;

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Chiusura mensile automatizzata</h2>
        <p className="text-sm text-muted-foreground">
          Un click avvia l&apos;intera pipeline AIchain. Nessun codice, nessuna configurazione — tutto gestito in Cloud.
        </p>
      </div>

      <Card>
        <CardContent className="grid gap-8 pt-6 lg:grid-cols-2">
          <div className="space-y-4">
            <Badge variant="secondary" className="gap-1.5" style={{ backgroundColor: `${accent}1a`, color: accent }}>
              <Zap className="h-3.5 w-3.5" /> Zero-Code · Cloud-managed
            </Badge>
            <h3 className="text-xl font-semibold">Pronto ad avviare la chiusura di Giugno 2026</h3>
            <p className="text-sm text-muted-foreground">
              Il motore riconcilia fatture, verifica le quadrature e genera il report di chiusura in autonomia.
              Il team AFC supervisiona soltanto il risultato.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-2 text-sm">
              <div><div className="text-xs text-muted-foreground">Periodo</div><div className="font-medium">01–30 Giu 2026</div></div>
              <div><div className="text-xs text-muted-foreground">Movimenti</div><div className="font-medium">2.847</div></div>
              <div><div className="text-xs text-muted-foreground">Fonti</div><div className="font-medium">ERP + Banca</div></div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            {phase === "idle" ? (
              <button
                onClick={run}
                className="group relative flex h-44 w-44 flex-col items-center justify-center gap-2 rounded-full text-white shadow-lg transition-transform hover:scale-105"
                style={{ backgroundColor: accent }}
              >
                <span className="absolute inset-[-8px] rounded-full border-2 opacity-30 group-hover:animate-ping" style={{ borderColor: accent }} />
                <Zap className="h-9 w-9" fill="currentColor" />
                <span className="px-4 text-center text-sm font-semibold">Avvia Chiusura Mensile</span>
              </button>
            ) : (
              <div className="w-full space-y-4">
                {steps.map((s, i) => {
                  const done = prog[i] >= 100;
                  const isActive = active === i;
                  return (
                    <div key={i} className="flex gap-3">
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm"
                        style={
                          done
                            ? { backgroundColor: accent, color: "#fff", borderColor: accent }
                            : isActive
                            ? { borderColor: accent, color: accent, borderWidth: 2 }
                            : { color: "var(--muted-foreground)", borderColor: "var(--border)" }
                        }
                      >
                        {done ? <Check className="h-4 w-4" strokeWidth={2.6} /> : <span className="text-xs font-semibold">{i + 1}</span>}
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{s.label}</span>
                          <span className="tabular-nums text-muted-foreground">{Math.round(prog[i])}%</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full transition-[width] duration-150"
                            style={{ width: `${prog[i]}%`, backgroundColor: accent }}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {done ? s.detail : isActive ? "Elaborazione in corso…" : "In coda"}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function FastClosingResults({ accent, onReset }: { accent: string; onReset: () => void }) {
  const k = FAST_CLOSING.kpis;
  const rows: [string, string, number][] = [
    ["Gennaio", "5,0 gg", 100],
    ["Marzo", "4,1 gg", 82],
    ["Maggio", "2,8 gg", 56],
    ["Giugno", "1,5 gg", 30],
  ];
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Chiusura completata</h2>
          <p className="text-sm text-muted-foreground">Bilancio quadrato e report generato in autonomia.</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onReset} className="gap-1.5">
          <RotateCcw className="h-3.5 w-3.5" /> Nuova chiusura
        </Button>
      </div>

      <Card>
        <CardContent className="flex items-center gap-3 pt-6">
          <div className={cn("flex h-9 w-9 items-center justify-center rounded-full", toneClass("success"))}>
            <Check className="h-4.5 w-4.5" strokeWidth={2.6} />
          </div>
          <div className="text-sm">
            <strong>Chiusura di Giugno 2026 completata.</strong> Nessuna configurazione tecnica richiesta — sistema
            completamente gestito in Cloud.
          </div>
          <Badge variant="secondary" className={cn("ml-auto gap-1.5", toneClass("success"))}>
            <Cloud className="h-3.5 w-3.5" /> Serverless
          </Badge>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiBox label="Tempo di chiusura" value={k.closingDays} unit="giorni" delta={`${k.closingDelta} vs mese precedente`} accent="#5B3E91" spark={FAST_CLOSING.closingTrend} />
        <KpiBox label="Forecasting Accuracy" value={k.accuracy} unit="%" delta="+16,6 pt su 12 mesi" accent="#00B4DB" spark={FAST_CLOSING.accuracySeries} />
        <KpiBox label="Ore/uomo risparmiate" value={k.hoursSaved} unit="h" note="sul ciclo di chiusura" accent="#3A266C" />
        <KpiBox label="Costo evitato / mese" value={`€ ${k.costSaved}`} note="riduzione costi operativi AFC" accent="#A7883F" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base font-medium">Forecasting Accuracy</CardTitle></CardHeader>
          <CardContent>
            <p className="mb-2 text-sm text-muted-foreground">Precisione delle previsioni AIchain, ultimi 12 mesi</p>
            <Sparkline data={FAST_CLOSING.accuracySeries} color="#00B4DB" />
            <Badge variant="secondary" className={cn("mt-3", toneClass("info"))}>
              Picco a 94,8% — Giugno 2026
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base font-medium">Tempo di chiusura</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">Giorni/uomo per ciclo, ultimi 6 mesi · −70% riduzione vs baseline</p>
            {rows.map(([m, v, w]) => (
              <div key={m} className="flex items-center gap-3 text-sm">
                <span className="w-16 shrink-0">{m}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full" style={{ width: `${w}%`, backgroundColor: accent }} />
                </div>
                <span className="w-12 shrink-0 text-right tabular-nums text-muted-foreground">{v}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function KpiBox({ label, value, unit, delta, note, accent, spark }: { label: string; value: string; unit?: string; delta?: string; note?: string; accent: string; spark?: number[] }) {
  return (
    <Card className="gap-2">
      <CardHeader className="pb-0"><CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle></CardHeader>
      <CardContent className="flex items-end justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-2xl font-semibold tabular-nums" style={{ color: accent }}>{value}</span>
            {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
          </div>
          {delta && <Badge variant="secondary" className={cn("text-xs", toneClass("success"))}>{delta}</Badge>}
          {note && !delta && <span className="text-xs text-muted-foreground">{note}</span>}
        </div>
        {spark && <Sparkline data={spark} color={accent} />}
      </CardContent>
    </Card>
  );
}
