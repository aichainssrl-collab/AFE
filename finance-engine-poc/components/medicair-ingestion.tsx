"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkline } from "@/components/sparkline";
import { Server, Users, Sheet, Box, Layers, RefreshCw, Sparkles, Check } from "lucide-react";
import { Line, ComposedChart, ResponsiveContainer, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import { CLEANSING, itNum } from "@/lib/data";
import { cn, toneClass } from "@/lib/utils";

const ICONS: Record<string, React.ElementType> = { server: Server, users: Users, sheet: Sheet, box: Box };

type Phase = "sources" | "cleansing" | "done";

export function MedicairIngestion({ accent }: { accent: string }) {
  const C = CLEANSING;
  const [phase, setPhase] = useState<Phase>("sources");
  const [scanned, setScanned] = useState(0);
  const [fixed, setFixed] = useState(0);
  const [health, setHealth] = useState(C.sources.map((s) => s.health));
  const raf = useRef<number | null>(null);

  useEffect(() => () => { if (raf.current) cancelAnimationFrame(raf.current); }, []);

  function run() {
    setPhase("cleansing");
    const dur = 3200;
    const start = performance.now();
    const baseHealth = C.sources.map((s) => s.health);
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const ease = 1 - Math.pow(1 - p, 3);
      setScanned(Math.round(C.totalRecords * ease));
      setFixed(Math.round(C.fixedRecords * ease));
      setHealth(baseHealth.map((h) => Math.round(h + (98 - h) * ease)));
      if (p < 1) raf.current = requestAnimationFrame(tick);
      else setTimeout(() => setPhase("done"), 500);
    };
    raf.current = requestAnimationFrame(tick);
  }

  function reset() {
    if (raf.current) cancelAnimationFrame(raf.current);
    setPhase("sources");
    setScanned(0);
    setFixed(0);
    setHealth(C.sources.map((s) => s.health));
  }

  if (phase === "done") return <UnifiedDashboard accent={accent} onReset={reset} />;

  const running = phase === "cleansing";

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Fonti dati &amp; Normalizzazione AI</h2>
        <p className="text-sm text-muted-foreground">
          Dati frammentati tra ERP, CRM ed Excel. Un click li unifica in un unico flusso pulito, pronto per l&apos;AFC.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.1fr_auto_1fr] lg:items-center">
        <div className="space-y-3">
          {C.sources.map((s, i) => {
            const Icon = ICONS[s.icon] ?? Server;
            const h = health[i];
            return (
              <Card key={i} className={running ? "border-current/40 transition-colors" : undefined} style={running ? { borderColor: `${accent}55` } : undefined}>
                <CardContent className="flex items-center gap-3 pt-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: `${accent}1a`, color: accent }}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <div className="text-sm font-medium">{s.name}</div>
                    <div className="text-xs text-muted-foreground">{s.type} · {itNum(s.records)} record</div>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full transition-[width] duration-200" style={{ width: `${h}%`, backgroundColor: h >= 90 ? "#1FAE6F" : h >= 60 ? "#D79A14" : "#D64545" }} />
                      </div>
                      <span className="text-xs font-medium tabular-nums">{h}%</span>
                    </div>
                  </div>
                  {!running && phase === "sources" && <span className="text-xs text-muted-foreground">disconnesso</span>}
                  {running && <RefreshCw className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="hidden justify-center lg:flex">
          <Layers className="h-6 w-6 text-muted-foreground" />
        </div>

        <Card className={running ? "shadow-md" : undefined} style={running ? { borderColor: accent } : undefined}>
          <CardContent className="space-y-5 pt-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full" style={{ backgroundColor: running ? `${accent}1a` : "var(--muted)", color: running ? accent : "var(--muted-foreground)" }}>
              <Layers className="h-6 w-6" />
            </div>
            <div className="text-base font-semibold">{running ? "Unificazione in corso…" : "Flusso dati unificato"}</div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="font-mono text-2xl font-semibold tabular-nums">{itNum(scanned)}</div>
                <div className="text-xs text-muted-foreground">record finanziari analizzati</div>
              </div>
              <div>
                <div className="font-mono text-2xl font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">{itNum(fixed)}</div>
                <div className="text-xs text-muted-foreground">duplicati / malformati corretti</div>
              </div>
            </div>

            {phase === "sources" ? (
              <Button size="lg" className="w-full gap-2" style={{ backgroundColor: accent }} onClick={run}>
                <Sparkles className="h-4 w-4" /> Esegui AI Data Cleansing &amp; Normalizzazione
              </Button>
            ) : (
              <div className="flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full transition-[width] duration-150" style={{ width: `${(scanned / C.totalRecords) * 100}%`, backgroundColor: accent }} />
                </div>
                <span className="text-sm font-medium tabular-nums">{Math.round((scanned / C.totalRecords) * 100)}%</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function UnifiedDashboard({ accent, onReset }: { accent: string; onReset: () => void }) {
  const C = CLEANSING;
  const F = C.unifiedForecast;
  const data = F.labels.map((label, i) => ({
    label,
    Reale: F.actual[i],
    Forecast: i >= F.actualMonths - 1 ? F.forecast[i] : null,
  }));

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Dashboard unificata</h2>
          <p className="text-sm text-muted-foreground">
            Dati puliti e normalizzati: i grafici predittivi e la timeline di Fast Closing sono ora sbloccati.
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={onReset} className="gap-1.5">
          <RefreshCw className="h-3.5 w-3.5" /> Nuova ingestion
        </Button>
      </div>

      <Card>
        <CardContent className="flex items-center gap-3 pt-6">
          <div className={cn("flex h-9 w-9 items-center justify-center rounded-full", toneClass("success"))}>
            <Check className="h-4.5 w-4.5" strokeWidth={2.6} />
          </div>
          <div>
            <strong>Stato del Dato: </strong>
            <Badge className="ml-1 bg-emerald-600 text-white hover:bg-emerald-600">OTTIMIZZATO</Badge>
            <div className="mt-0.5 text-sm text-muted-foreground">Pronto per l&apos;elaborazione AFC · 4 fonti unificate in un unico flusso</div>
          </div>
          <Badge variant="secondary" className={cn("ml-auto gap-1.5", toneClass("success"))}>
            <Layers className="h-3.5 w-3.5" /> 1 flusso · 0 silos
          </Badge>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Stat label="Record unificati" value={itNum(C.totalRecords)} note="da 4 fonti eterogenee" accent="#00897B" />
        <Stat label="Record corretti" value={itNum(C.fixedRecords)} note={`${C.duplicates} duplicati · ${C.malformed} malformati`} accent="#13855A" spark={[55, 60, 70, 82, 92, 98]} />
        <Stat label="Qualità del dato" value="98" unit="%" note="+38 pt post-cleansing" accent="#5B3E91" />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="mb-1 flex items-center justify-between">
            <h3 className="text-base font-semibold">Forecasting unificato — Ricavi dispositivi</h3>
            <Badge variant="secondary" className="gap-1.5 bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400">
              Previsione +16% a 4 mesi
            </Badge>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">Sbloccato dopo la pulizia dei dati · valori in migliaia di €</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} domain={[110, 175]} />
                <Tooltip />
                <Line type="monotone" dataKey="Reale" stroke="#00897B" strokeWidth={3} dot={{ r: 3 }} connectNulls />
                <Line type="monotone" dataKey="Forecast" stroke="#5B3E91" strokeWidth={3} strokeDasharray="6 6" dot={{ r: 3 }} connectNulls />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function Stat({ label, value, unit, note, accent, spark }: { label: string; value: string; unit?: string; note?: string; accent: string; spark?: number[] }) {
  return (
    <Card className="gap-2">
      <CardContent className="flex items-end justify-between gap-3 pt-6">
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">{label}</div>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-2xl font-semibold tabular-nums" style={{ color: accent }}>{value}</span>
            {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
          </div>
          {note && <div className="text-xs text-muted-foreground">{note}</div>}
        </div>
        {spark && <Sparkline data={spark} color={accent} />}
      </CardContent>
    </Card>
  );
}
