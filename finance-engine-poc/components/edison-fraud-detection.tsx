"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Shield, AlertTriangle, Check, Target } from "lucide-react";
import { DOC_INTELLIGENCE, itNum, type Anomaly } from "@/lib/data";
import { cn, toneClass } from "@/lib/utils";

const SEV_META: Record<Anomaly["severity"], { label: string; color: string; badge: string }> = {
  high: { label: "Alta", color: "#C23434", badge: toneClass("danger") },
  medium: { label: "Media", color: "#9A6B00", badge: toneClass("warning") },
  low: { label: "Bassa", color: "#5C6178", badge: toneClass("neutral") },
};

const FILTERS: [string, string][] = [["all", "Tutte"], ["high", "Alta"], ["medium", "Media"], ["low", "Bassa"]];

export function EdisonFraudDetection({ accent }: { accent: string }) {
  const DI = DOC_INTELLIGENCE;
  const k = DI.fraudKpis;
  const [filter, setFilter] = useState("all");
  const rows = DI.anomalies
    .filter((a) => filter === "all" || a.severity === filter)
    .sort((a, b) => b.risk - a.risk);

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Anomalie rilevate</h2>
        <p className="text-sm text-muted-foreground">
          Il motore monitora ogni documento in ingresso e segnala in tempo reale rischi di frode, duplicati e incongruenze.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SimpleKpi icon={<AlertTriangle className="h-4.5 w-4.5" />} label="Anomalie / mese" value={String(k.flagged)} note="documenti segnalati" accent="#C23434" />
        <SimpleKpi icon={<Shield className="h-4.5 w-4.5" />} label="Importo a rischio" value={`€ ${k.atRisk}`} note="valore intercettato" accent="#9A6B00" />
        <SimpleKpi icon={<Check className="h-4.5 w-4.5" />} label="Importo bloccato" value={`€ ${k.blocked}`} note="prima della registrazione" accent="#13855A" />
        <SimpleKpi icon={<Target className="h-4.5 w-4.5" />} label="Falsi positivi" value={`${k.falsePos}%`} note="−9 pt vs baseline" accent={accent} />
      </div>

      <Card className="gap-0 py-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4">
          <div>
            <h3 className="text-base font-semibold">Coda anomalie</h3>
            <p className="text-sm text-muted-foreground">{itNum(rows.length)} documenti · ordinati per livello di rischio</p>
          </div>
          <div className="flex gap-1.5">
            {FILTERS.map(([v, l]) => (
              <button
                key={v}
                onClick={() => setFilter(v)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  filter === v ? "text-white border-transparent" : "text-muted-foreground hover:text-foreground"
                )}
                style={filter === v ? { backgroundColor: accent } : undefined}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Documento</TableHead>
              <TableHead>Fornitore</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Importo</TableHead>
              <TableHead>Tipo anomalia</TableHead>
              <TableHead>Gravità</TableHead>
              <TableHead>Rischio</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((a) => {
              const sm = SEV_META[a.severity];
              return (
                <TableRow key={a.id}>
                  <TableCell>
                    <div className="flex items-center gap-1.5 font-medium"><FileText className="h-4 w-4 text-muted-foreground" />{a.file}</div>
                    <div className="text-xs text-muted-foreground">{a.id}</div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{a.supplier}</TableCell>
                  <TableCell className="text-muted-foreground">{a.date}</TableCell>
                  <TableCell className="text-right font-medium">{a.amount}</TableCell>
                  <TableCell>
                    <div className="font-medium">{a.type}</div>
                    <div className="text-xs text-muted-foreground">{a.note}</div>
                  </TableCell>
                  <TableCell><Badge variant="secondary" className={sm.badge}>{sm.label}</Badge></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full" style={{ width: `${a.risk}%`, backgroundColor: sm.color }} />
                      </div>
                      <span className="text-xs font-semibold tabular-nums" style={{ color: sm.color }}>{a.risk}</span>
                    </div>
                  </TableCell>
                  <TableCell><Button size="sm" variant="outline">Rivedi</Button></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <div className="flex items-start gap-2 border-t px-5 py-4 text-xs text-muted-foreground">
          <Shield className="mt-0.5 h-4 w-4 shrink-0" />
          Ogni documento viene controllato all&apos;ingestione: importi fuori scala, duplicati, IBAN non corrispondenti e
          fornitori non in anagrafica vengono bloccati prima della registrazione contabile.
        </div>
      </Card>
    </section>
  );
}

function SimpleKpi({ icon, label, value, note, accent }: { icon: React.ReactNode; label: string; value: string; note?: string; accent: string }) {
  return (
    <Card className="gap-2">
      <CardContent className="flex items-start justify-between gap-3 pt-6">
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">{label}</div>
          <div className="text-2xl font-semibold tabular-nums" style={{ color: accent }}>{value}</div>
          {note && <div className="text-xs text-muted-foreground">{note}</div>}
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full" style={{ backgroundColor: `${accent}1a`, color: accent }}>
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
