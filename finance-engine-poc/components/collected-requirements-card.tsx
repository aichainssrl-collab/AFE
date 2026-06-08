import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import requirements from "@/data/requirements_customers.json";

type Client = {
  id: string;
  name: string;
  sector: string;
  horizonMonths: string;
  anagrafica: { ragione_sociale: string; dipendenti_afc: number };
  processi: {
    processi_target: string[];
    barriera: string;
    fatture_mese: number;
    documenti_mese: number;
    tempo_chiusura: number;
  };
  compliance: { deployment: string; normative: string[] };
};

type RequirementsDoc = {
  version: string;
  title: string;
  description: string;
  exportedAt: string;
  schemaRef: string;
  totals: {
    clients: number;
    withCollectedSpecs: number;
    customSections: number;
    sharedSections: number;
  };
  sections: string[];
  clients: Client[];
};

const data = requirements as RequirementsDoc;

function formatNum(n: number): string {
  return n.toLocaleString("it-IT");
}

export function CollectedRequirementsCard() {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle>Dati raccolti — Requisiti cliente</CardTitle>
              <Badge variant="secondary" className="font-mono text-[10px]">
                v{data.version}
              </Badge>
            </div>
            <CardDescription>
              {data.description}
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            <span>exported {data.exportedAt}</span>
            <span>·</span>
            <a
              href="/data/requirements_customers.json"
              target="_blank"
              rel="noreferrer"
              className="rounded border px-2 py-0.5 font-mono text-[10px] hover:bg-secondary"
            >
              JSON
            </a>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Totals */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <div className="rounded-md border bg-secondary/40 px-3 py-2">
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
              Clienti
            </div>
            <div className="text-xl font-semibold tabular-nums">
              {data.totals.clients}
            </div>
          </div>
          <div className="rounded-md border bg-secondary/40 px-3 py-2">
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
              Con specifiche
            </div>
            <div className="text-xl font-semibold tabular-nums">
              {data.totals.withCollectedSpecs}
              <span className="ml-1 text-xs text-muted-foreground">
                / {data.totals.clients}
              </span>
            </div>
          </div>
          <div className="rounded-md border bg-secondary/40 px-3 py-2">
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
              Sezioni
            </div>
            <div className="text-xl font-semibold tabular-nums">
              {data.totals.sharedSections + data.totals.customSections}
            </div>
          </div>
          <div className="rounded-md border bg-secondary/40 px-3 py-2">
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
              Schema
            </div>
            <div className="text-[11px] font-mono">{data.schemaRef}</div>
          </div>
        </div>

        {/* Per-cliente table */}
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-left text-[11px] uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Cliente</th>
                <th className="px-3 py-2 font-medium">Settore</th>
                <th className="px-3 py-2 font-medium">AFC team</th>
                <th className="px-3 py-2 font-medium">Processi</th>
                <th className="px-3 py-2 font-medium">Barriera</th>
                <th className="px-3 py-2 font-medium">Volumi</th>
                <th className="px-3 py-2 font-medium">Horizon</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.clients.map((c) => (
                <tr key={c.id} className="hover:bg-secondary/30">
                  <td className="px-3 py-2 align-top">
                    <a
                      href={`/${c.id}`}
                      className="font-medium hover:underline"
                    >
                      {c.name}
                    </a>
                    <div className="text-[10px] font-mono text-muted-foreground">
                      id: {c.id}
                    </div>
                  </td>
                  <td className="px-3 py-2 align-top text-muted-foreground">
                    {c.sector}
                  </td>
                  <td className="px-3 py-2 align-top tabular-nums">
                    {c.anagrafica.dipendenti_afc}
                  </td>
                  <td className="px-3 py-2 align-top">
                    <div className="flex max-w-[18rem] flex-wrap gap-1">
                      {c.processi.processi_target.slice(0, 3).map((p) => (
                        <Badge
                          key={p}
                          variant="outline"
                          className="text-[10px] font-normal"
                        >
                          {p}
                        </Badge>
                      ))}
                      {c.processi.processi_target.length > 3 && (
                        <span className="text-[10px] text-muted-foreground">
                          +{c.processi.processi_target.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2 align-top text-xs">
                    {c.processi.barriera}
                  </td>
                  <td className="px-3 py-2 align-top text-xs text-muted-foreground tabular-nums">
                    {formatNum(c.processi.fatture_mese)} fatt/m
                    <br />
                    {formatNum(c.processi.documenti_mese)} doc/m
                  </td>
                  <td className="px-3 py-2 align-top text-xs tabular-nums">
                    {c.horizonMonths} mesi
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sezioni coperte */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
          <span className="text-muted-foreground">Sezioni form:</span>
          {data.sections.map((s) => (
            <Badge key={s} variant="outline" className="font-mono text-[10px]">
              {s}
            </Badge>
          ))}
          <span className="text-muted-foreground">+ 6 sezioni custom per cliente</span>
        </div>
      </CardContent>
    </Card>
  );
}
