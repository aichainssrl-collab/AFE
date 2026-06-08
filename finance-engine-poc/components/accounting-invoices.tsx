"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Receipt, Check, Clock, AlertTriangle, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { ACCOUNTING, type Invoice } from "@/lib/data";
import { cn, toneClass } from "@/lib/utils";

const STATUS_META: Record<Invoice["status"], { label: string; cls: string }> = {
  registered: { label: "Registrata", cls: toneClass("info") },
  sent: { label: "Inviata", cls: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400" },
  paid: { label: "Pagata", cls: toneClass("success") },
  review: { label: "Da rivedere", cls: toneClass("warning") },
  overdue: { label: "Scaduta", cls: toneClass("danger") },
};

const FILTERS: [string, string][] = [["all", "Tutte"], ["Attiva", "Attive"], ["Passiva", "Passive"]];

export function AccountingInvoices({ accent, clientName }: { accent: string; clientName: string }) {
  const A = ACCOUNTING;
  const k = A.kpis;
  const [dir, setDir] = useState("all");
  const rows = A.invoices.filter((iv) => dir === "all" || iv.dir === dir);

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Registro fatture</h2>
        <p className="text-sm text-muted-foreground">
          Fatture attive e passive riconciliate in automatico dall&apos;AI, con registrazione contabile in pochi secondi.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SimpleKpi icon={<Receipt className="h-4.5 w-4.5" />} label="Fatture / mese" value={k.count} note="attive + passive" accent="#5B3E91" />
        <SimpleKpi icon={<Check className="h-4.5 w-4.5" />} label="Riconciliazione auto" value={`${k.reconciled}%`} note="+11 pt" accent="#13855A" />
        <SimpleKpi icon={<Clock className="h-4.5 w-4.5" />} label="Tempo registrazione" value={`${k.avgTime}s`} note="da 4 min manuali" accent="#00B4DB" />
        <SimpleKpi icon={<AlertTriangle className="h-4.5 w-4.5" />} label="Scadute" value={k.overdue} note="da sollecitare" accent="#C23434" />
      </div>

      <Card className="gap-0 py-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4">
          <div>
            <h3 className="text-base font-semibold">Registro fatture</h3>
            <p className="text-sm text-muted-foreground">{rows.length} documenti · {clientName} · valori in € · IVA inclusa nel totale</p>
          </div>
          <div className="flex gap-1.5">
            {FILTERS.map(([v, l]) => (
              <button
                key={v}
                onClick={() => setDir(v)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  dir === v ? "text-white border-transparent" : "text-muted-foreground hover:text-foreground"
                )}
                style={dir === v ? { backgroundColor: accent } : undefined}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Numero</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Controparte</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Scadenza</TableHead>
              <TableHead className="text-right">Imponibile</TableHead>
              <TableHead className="text-right">IVA</TableHead>
              <TableHead className="text-right">Totale</TableHead>
              <TableHead>Stato</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((iv, i) => {
              const sm = STATUS_META[iv.status];
              const active = iv.dir === "Attiva";
              return (
                <TableRow key={i}>
                  <TableCell className="font-medium">{iv.num}</TableCell>
                  <TableCell>
                    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                      active ? toneClass("success") : toneClass("neutral"))}>
                      {active ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownLeft className="h-3 w-3" />}
                      {iv.dir}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{iv.party}</TableCell>
                  <TableCell className="text-muted-foreground">{iv.date}</TableCell>
                  <TableCell className="text-muted-foreground">{iv.due}</TableCell>
                  <TableCell className="text-right">€ {iv.taxable}</TableCell>
                  <TableCell className="text-right text-muted-foreground">€ {iv.vat}</TableCell>
                  <TableCell className="text-right font-semibold">€ {iv.total}</TableCell>
                  <TableCell><Badge variant="secondary" className={sm.cls}>{sm.label}</Badge></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <div className="flex items-start gap-2 border-t px-5 py-4 text-xs text-muted-foreground">
          <Check className="mt-0.5 h-4 w-4 shrink-0" />
          Riconciliazione automatica al 99,1%: l&apos;AI abbina fatture, pagamenti e ordini, registra in contabilità e
          segnala solo i casi che richiedono verifica.
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
          <div className="font-mono text-2xl font-semibold tabular-nums" style={{ color: accent }}>{value}</div>
          {note && <div className="text-xs text-muted-foreground">{note}</div>}
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full" style={{ backgroundColor: `${accent}1a`, color: accent }}>
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
