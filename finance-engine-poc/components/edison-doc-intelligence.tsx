"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Upload, FileText, ScanLine, AlertTriangle, RefreshCw, Check, Cloud } from "lucide-react";
import { DOC_INTELLIGENCE } from "@/lib/data";
import { cn, toneClass } from "@/lib/utils";

type Phase = "idle" | "processing" | "ready";
type Sync = "none" | "syncing" | "synced";

export function EdisonDocIntelligence({ accent }: { accent: string }) {
  const DI = DOC_INTELLIGENCE;
  const [phase, setPhase] = useState<Phase>("idle");
  const [revealed, setRevealed] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [sync, setSync] = useState<Sync>("none");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function start() {
    if (phase !== "idle") return;
    setPhase("processing");
    setRevealed(0);
    DI.fields.forEach((_, i) => {
      timers.current.push(setTimeout(() => setRevealed(i + 1), 350 + i * 320));
    });
    timers.current.push(setTimeout(() => setPhase("ready"), 350 + DI.fields.length * 320 + 500));
  }

  function reset() {
    timers.current.forEach(clearTimeout);
    setPhase("idle");
    setRevealed(0);
    setSync("none");
  }

  function doSync() {
    setSync("syncing");
    setTimeout(() => setSync("synced"), 1600);
  }

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Estrazione documentale &amp; Fraud Detection</h2>
          <p className="text-sm text-muted-foreground">
            Carica una fattura: l&apos;AI estrae i campi e segnala anomalie. Nessuna modifica all&apos;ERP esistente.
          </p>
        </div>
        {phase !== "idle" && (
          <Button variant="ghost" size="sm" onClick={reset} className="gap-1.5">
            <RefreshCw className="h-3.5 w-3.5" /> Nuovo documento
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* LEFT */}
        <div>
          {phase === "idle" ? (
            <button
              onClick={start}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); start(); }}
              className="flex h-full min-h-[360px] w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition-colors"
              style={dragOver ? { borderColor: accent, backgroundColor: `${accent}0d` } : undefined}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full" style={{ backgroundColor: `${accent}1a`, color: accent }}>
                <Upload className="h-7 w-7" />
              </div>
              <div className="text-base font-medium">Trascina qui un documento</div>
              <div className="text-sm text-muted-foreground">
                PDF, immagine o scansione · oppure <span style={{ color: accent }}>sfoglia</span>
              </div>
              <div className="mt-2 flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs text-muted-foreground">
                <FileText className="h-3.5 w-3.5" /> {DI.fileName}
              </div>
            </button>
          ) : (
            <Card className="relative overflow-hidden">
              {phase === "processing" && (
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1 animate-pulse" style={{ backgroundColor: accent }} />
              )}
              <CardContent className="space-y-3 pt-6 text-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold">Energetica Sud S.p.A.</div>
                    <div className="text-xs text-muted-foreground">Via dell&apos;Energia 12 · 70126 Bari (BA)</div>
                    <div className="text-xs text-muted-foreground">P.IVA IT 04821970651</div>
                  </div>
                  <Badge variant="outline">FATTURA</Badge>
                </div>
                <Row k="N. Documento" v="FT-2026-008842" />
                <Row k="Data emissione" v="28/05/2026" />
                <Row k="Scadenza" v="27/06/2026" />
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="py-1.5 font-normal">Descrizione</th>
                      <th className="py-1.5 font-normal">Q.tà</th>
                      <th className="py-1.5 text-right font-normal">Importo</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b"><td className="py-1.5">Fornitura energia MT — Maggio 2026</td><td>1</td><td className="text-right">€ 31.200,00</td></tr>
                    <tr><td className="py-1.5">Oneri di rete e dispacciamento</td><td>1</td><td className="text-right">€ 7.220,00</td></tr>
                  </tbody>
                </table>
                <div className="space-y-1 border-t pt-2">
                  <Row k="Imponibile" v="€ 38.420,00" />
                  <Row k="IVA 22%" v="€ 8.452,40" />
                  <Row k="Totale" v="€ 46.872,40" bold />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* RIGHT */}
        <div className="space-y-4">
          <Card className="gap-0 py-0">
            <div className="flex items-center gap-3 border-b px-4 py-3">
              <div className="flex h-8.5 w-8.5 items-center justify-center rounded-full" style={{ backgroundColor: `${accent}1a`, color: accent }}>
                <ScanLine className="h-4.5 w-4.5" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold">Campi estratti dall&apos;AI</div>
                <div className="text-xs text-muted-foreground">
                  {phase === "idle" ? "In attesa di un documento" : `${revealed}/${DI.fields.length} campi · OCR + NLP`}
                </div>
              </div>
              {phase === "processing" && <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />}
              {phase === "ready" && (
                <Badge variant="secondary" className={cn("gap-1", toneClass("success"))}>
                  <Check className="h-3 w-3" /> Completato
                </Badge>
              )}
            </div>
            <div className="space-y-2 px-4 py-3">
              {phase === "idle" ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  I campi compariranno qui non appena carichi il documento.
                </div>
              ) : (
                DI.fields.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition-all duration-300"
                    style={{ opacity: i < revealed ? 1 : 0, transform: i < revealed ? "translateY(0)" : "translateY(6px)" }}
                  >
                    <div>
                      <div className="text-xs text-muted-foreground">{f.key}</div>
                      <div className="font-medium">{f.value}</div>
                    </div>
                    <div
                      className="flex items-center gap-1.5 text-xs font-medium"
                      style={{ color: f.conf >= 98 ? "#13855A" : f.conf >= 95 ? "#9A6B00" : "#C23434" }}
                    >
                      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: f.conf >= 98 ? "#1FAE6F" : f.conf >= 95 ? "#D79A14" : "#D64545" }} />
                      {f.conf}%
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {phase === "ready" && (
            <>
              <Card className="border-red-200 dark:border-red-900">
                <CardContent className="space-y-3 pt-6">
                  <div className="flex items-start gap-3">
                    <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full", toneClass("danger"))}>
                      <AlertTriangle className="h-4.5 w-4.5" strokeWidth={2.2} />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{DI.anomaly.title}</div>
                      <div className="text-xs text-muted-foreground">Anomaly Detection · priorità alta</div>
                    </div>
                    <Badge className="bg-red-600 text-white hover:bg-red-600">+{DI.anomaly.deltaPct}%</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{DI.anomaly.text}</p>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex-1 rounded-lg border px-3 py-2">
                      <div className="text-xs text-muted-foreground">Media storica fornitore</div>
                      <div className="font-semibold">{DI.anomaly.historicalAvg}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">vs</div>
                    <div className="flex-1 rounded-lg border border-red-200 bg-red-50 px-3 py-2 dark:border-red-900 dark:bg-red-950/40">
                      <div className="text-xs text-muted-foreground">Questa fattura</div>
                      <div className="font-semibold text-red-600 dark:text-red-400">{DI.anomaly.thisInvoice}</div>
                    </div>
                  </div>
                  <HistoryBars data={DI.history} labels={DI.historyLabels} />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center justify-between gap-4 pt-6">
                  <div className="flex items-center gap-3">
                    <div className={cn("flex h-9 w-9 items-center justify-center rounded-full", toneClass("success"))}>
                      {sync === "synced" ? <Check className="h-4.5 w-4.5" /> : <RefreshCw className="h-4.5 w-4.5" />}
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        {sync === "synced" ? "Dato sincronizzato con l'ERP" : "API Gateway · integrazione non invasiva"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {sync === "synced" ? "Nessuna modifica strutturale all'ERP." : "Invio del dato pulito, senza toccare l'ERP attuale."}
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={doSync}
                    disabled={sync !== "none"}
                    style={sync === "none" ? { backgroundColor: accent } : undefined}
                    variant={sync === "synced" ? "secondary" : "default"}
                    className="gap-1.5 whitespace-nowrap"
                  >
                    {sync === "syncing" ? <RefreshCw className="h-4 w-4 animate-spin" /> : sync === "synced" ? <Check className="h-4 w-4" /> : <RefreshCw className="h-4 w-4" />}
                    {sync === "none" ? "Sincronizza con ERP" : sync === "syncing" ? "Sincronizzazione…" : "Sincronizzato"}
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>

    </section>
  );
}

function Row({ k, v, bold }: { k: string; v: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{k}</span>
      <span className={bold ? "font-semibold" : "font-medium"}>{v}</span>
    </div>
  );
}

function HistoryBars({ data, labels }: { data: number[]; labels: string[] }) {
  const max = Math.max(...data) * 1.1;
  return (
    <div className="flex items-end gap-2 pt-2">
      {data.map((v, i) => {
        const last = i === data.length - 1;
        return (
          <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
            <div className="flex h-20 w-full items-end overflow-hidden rounded bg-muted">
              <div
                className="w-full rounded-t"
                style={{ height: `${(v / max) * 100}%`, backgroundColor: last ? "#C23434" : "#9CA1B5" }}
              />
            </div>
            <div className="text-[10px] text-muted-foreground">{labels[i]}</div>
          </div>
        );
      })}
    </div>
  );
}
