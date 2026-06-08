"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Coins, Euro, Clock, TrendingUp, Check, Cloud } from "lucide-react";
import { PREDICTIVE } from "@/lib/data";
import { cn, toneClass } from "@/lib/utils";

export function SystraRoiTracker({ accent, clientName }: { accent: string; clientName: string }) {
  const r = PREDICTIVE.roiSummary;
  const [serverless, setServerless] = useState(true);

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">ROI Tracker Intelligente</h2>
        <p className="text-sm text-muted-foreground">
          Risparmio stimato sul modello Serverless pay-as-you-go per {clientName}, costruito per sciogliere
          l&apos;incertezza sul ritorno dell&apos;investimento.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon={<Coins className="h-4.5 w-4.5" />} label="Risparmio mensile" value={`€ ${r.monthlySaving}`} note="processi AFC + infrastruttura" accent="#13855A" />
        <Stat icon={<Euro className="h-4.5 w-4.5" />} label="Risparmio annuo" value={`€ ${r.annualSaving}`} note="proiezione 12 mesi" accent="#A7883F" />
        <Stat icon={<Clock className="h-4.5 w-4.5" />} label="Payback" value={r.payback} unit="mesi" note="tempo di rientro" accent="#5B3E91" />
        <Stat icon={<TrendingUp className="h-4.5 w-4.5" />} label="ROI a 12 mesi" value={r.roiPct} unit="%" note="su investimento iniziale" accent={accent} />
      </div>

      <Card className="gap-0 py-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4">
          <div>
            <h3 className="text-base font-semibold">Tradizionale vs AIchain</h3>
            <p className="text-sm text-muted-foreground">Confronto voce per voce</p>
          </div>
          <button
            onClick={() => setServerless((v) => !v)}
            className="flex items-center gap-2 text-sm"
          >
            <span className="text-muted-foreground">Modello Serverless</span>
            <span
              className={cn("relative inline-flex h-5 w-9 items-center rounded-full transition-colors", serverless ? "" : "bg-muted")}
              style={serverless ? { backgroundColor: accent } : undefined}
            >
              <span className={cn("inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform", serverless ? "translate-x-4.5" : "translate-x-0.5")} />
            </span>
          </button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Voce di costo</TableHead>
              <TableHead>Processo tradizionale</TableHead>
              <TableHead>{serverless ? "Con AIchain (Serverless)" : "Con AIchain (On-prem)"}</TableHead>
              <TableHead>Risparmio</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PREDICTIVE.roiTable.map((row, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{row.item}</TableCell>
                <TableCell className="text-muted-foreground">{row.traditional}</TableCell>
                <TableCell className="text-muted-foreground">{serverless ? row.aichain : row.aichain.replace("Pay-as-you-go", "Licenza ridotta")}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={cn("gap-1", toneClass("success"))}>
                    <Check className="h-3 w-3" /> {row.saving}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex items-start gap-2 border-t px-5 py-4 text-xs text-muted-foreground">
          <Cloud className="mt-0.5 h-4 w-4 shrink-0" />
          {serverless
            ? "Con il modello Serverless paghi solo l'elaborazione effettiva: nessun costo fisso di licenza o infrastruttura."
            : "Anche on-premise il risparmio resta significativo, ma i costi fissi di infrastruttura permangono."}
        </div>
      </Card>
    </section>
  );
}

function Stat({ icon, label, value, unit, note, accent }: { icon: React.ReactNode; label: string; value: string; unit?: string; note?: string; accent: string }) {
  return (
    <Card className="gap-2">
      <CardContent className="flex items-start justify-between gap-3 pt-6">
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">{label}</div>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-2xl font-semibold tabular-nums" style={{ color: accent }}>{value}</span>
            {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
          </div>
          {note && <div className="text-xs text-muted-foreground">{note}</div>}
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full" style={{ backgroundColor: `${accent}1a`, color: accent }}>
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
