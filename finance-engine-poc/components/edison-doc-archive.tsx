"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, FileText, Folder, ScanLine, Clock, Shield, Cloud } from "lucide-react";
import { DOC_INTELLIGENCE, type ArchivedDocument } from "@/lib/data";
import { cn, toneClass } from "@/lib/utils";

const STATUS_META: Record<ArchivedDocument["status"], { label: string; cls: string }> = {
  registered: { label: "Registrato", cls: toneClass("success") },
  archived: { label: "Archiviato", cls: toneClass("neutral") },
  review: { label: "Da rivedere", cls: toneClass("warning") },
};

export function EdisonDocArchive({ accent }: { accent: string }) {
  const DI = DOC_INTELLIGENCE;
  const k = DI.archiveKpis;
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const cats = ["all", ...Array.from(new Set(DI.documents.map((d) => d.cat)))];

  const rows = DI.documents.filter((d) => {
    const okCat = cat === "all" || d.cat === cat;
    const okQ = !q || (d.name + " " + d.supplier + " " + d.tags.join(" ")).toLowerCase().includes(q.toLowerCase());
    return okCat && okQ;
  });

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Archivio documentale</h2>
        <p className="text-sm text-muted-foreground">
          Ogni documento è acquisito, indicizzato e ricercabile semanticamente. Conservazione a norma e audit-ready.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SimpleKpi icon={<Folder className="h-4.5 w-4.5" />} label="Documenti archiviati" value={k.total} note="indicizzati e ricercabili" accent="#00B4DB" />
        <SimpleKpi icon={<ScanLine className="h-4.5 w-4.5" />} label="Indicizzazione AI" value={`${k.indexed}%`} note="OCR + classificazione" accent="#5B3E91" />
        <SimpleKpi icon={<Clock className="h-4.5 w-4.5" />} label="Tempo di ricerca" value={`${k.search}s`} note="ricerca semantica" accent="#13855A" />
        <SimpleKpi icon={<Shield className="h-4.5 w-4.5" />} label="Conservazione" value={k.retention} note="a norma · audit-ready" accent="#A7883F" />
      </div>

      <Card className="gap-0 py-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4">
          <div className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              className="w-56 bg-transparent outline-none placeholder:text-muted-foreground"
              placeholder="Cerca documento, fornitore o tag…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  cat === c ? "text-white border-transparent" : "text-muted-foreground hover:text-foreground"
                )}
                style={cat === c ? { backgroundColor: accent } : undefined}
              >
                {c === "all" ? "Tutte" : c}
              </button>
            ))}
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Documento</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Controparte</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Dimensione</TableHead>
              <TableHead>Stato</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((d, i) => {
              const sm = STATUS_META[d.status];
              return (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center gap-1.5 font-medium"><FileText className="h-4 w-4 text-muted-foreground" />{d.name}</div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {d.tags.map((t, j) => (
                        <span key={j} className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">{t}</span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{d.type}</TableCell>
                  <TableCell><span className="rounded-full border px-2 py-0.5 text-xs">{d.cat}</span></TableCell>
                  <TableCell className="text-muted-foreground">{d.supplier}</TableCell>
                  <TableCell className="text-muted-foreground">{d.date}</TableCell>
                  <TableCell className="text-muted-foreground">{d.size}</TableCell>
                  <TableCell><Badge variant="secondary" className={sm.cls}>{sm.label}</Badge></TableCell>
                  <TableCell><Button size="sm" variant="outline">Apri</Button></TableCell>
                </TableRow>
              );
            })}
            {!rows.length && (
              <TableRow><TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">Nessun documento corrisponde alla ricerca.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex items-start gap-2 border-t px-5 py-4 text-xs text-muted-foreground">
          <Cloud className="mt-0.5 h-4 w-4 shrink-0" />
          Archivio sincronizzato in tempo reale dal flusso AIchain · ricerca semantica su contenuto e metadati, senza modifiche all&apos;ERP.
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
