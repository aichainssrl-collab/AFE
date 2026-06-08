"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Line, ComposedChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PREDICTIVE } from "@/lib/data";
import { cn, toneClass } from "@/lib/utils";

export function SystraPredictiveBudgeting({ accent, clientName }: { accent: string; clientName: string }) {
  const P = PREDICTIVE;
  const [delta, setDelta] = useState(0);
  const sens = 0.6;

  const forecast = P.forecastBase.map((v, i) => (i < P.actualMonths - 1 ? v : Math.round(v * (1 + (delta / 100) * sens))));
  const data = P.labels.map((label, i) => ({
    label,
    Pianificato: P.planned[i],
    Reale: P.actual[i],
    "Forecast AI": i >= P.actualMonths - 1 ? forecast[i] : null,
  }));

  const plannedTotal = P.planned.reduce((a, b) => a + b, 0);
  const forecastTotal = forecast.reduce((a, b) => a + b, 0);
  const variance = forecastTotal - plannedTotal;
  const varPct = ((variance / plannedTotal) * 100).toFixed(1);

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Predictive Budgeting</h2>
        <p className="text-sm text-muted-foreground">
          Budget pianificato vs spesa reale vs previsione AIchain · {clientName}. Simula uno scenario e la previsione si
          aggiorna all&apos;istante.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Stat label="Budget pianificato (anno)" value={`€ ${(plannedTotal / 1000).toFixed(2)}M`} note="12 mesi · piano approvato" accent="#A7883F" />
        <Stat label="Previsione AIchain (anno)" value={`€ ${(forecastTotal / 1000).toFixed(2)}M`} note={`scenario materie prime ${delta >= 0 ? "+" : ""}${delta}%`} accent="#00B4DB" />
        <Stat
          label="Scostamento vs piano"
          value={`${variance >= 0 ? "+€ " : "−€ "}${Math.abs(variance).toLocaleString("it-IT")}`}
          note={`${variance >= 0 ? "+" : ""}${varPct}% sul budget`}
          accent="#3A266C"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardContent className="pt-6">
            <div className="mb-1 flex items-center justify-between">
              <h3 className="text-base font-semibold">Budget vs Spesa vs Forecast</h3>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <Legend color="#E6CD74" label="Pianificato" />
                <Legend color="#3A266C" label="Reale" />
                <Legend color="#00B4DB" label="Forecast AI" dashed />
              </div>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">Valori in migliaia di € · linea tratteggiata = previsione AI</p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} domain={[0, 620]} />
                  <Tooltip />
                  <Bar dataKey="Pianificato" fill="#E6CD74" radius={3} />
                  <Bar dataKey="Reale" fill="#3A266C" radius={3} />
                  <Line type="monotone" dataKey="Forecast AI" stroke="#00B4DB" strokeWidth={3} strokeDasharray="6 6" dot={{ r: 3 }} connectNulls />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4 pt-6">
            <Badge variant="secondary" className={cn("gap-1.5", toneClass("info"))}>
              <Sparkles className="h-3.5 w-3.5" /> Scenario What-If
            </Badge>
            <div>
              <h3 className="text-base font-semibold">Costo materie prime</h3>
              <p className="text-sm text-muted-foreground">
                Trascina per simulare una variazione. Il forecast dei prossimi 6 mesi si ricalcola in tempo reale.
              </p>
            </div>

            <div className="text-3xl font-semibold tabular-nums" style={{ color: delta > 0 ? "#C23434" : delta < 0 ? "#13855A" : undefined }}>
              {delta > 0 ? "+" : ""}{delta}<span className="text-lg text-muted-foreground">%</span>
            </div>

            <input
              type="range"
              min={-20}
              max={30}
              step={1}
              value={delta}
              onChange={(e) => setDelta(parseInt(e.target.value))}
              className="w-full accent-current"
              style={{ color: accent }}
            />
            <div className="flex justify-between text-xs text-muted-foreground"><span>−20%</span><span>0</span><span>+30%</span></div>

            <div className="flex gap-1.5">
              {[-10, 0, 10, 20].map((d) => (
                <button
                  key={d}
                  onClick={() => setDelta(d)}
                  className="rounded-full border px-3 py-1 text-xs font-medium transition-colors"
                  style={delta === d ? { backgroundColor: accent, color: "#fff", borderColor: accent } : undefined}
                >
                  {d > 0 ? "+" : ""}{d}%
                </button>
              ))}
            </div>

            <div className="space-y-1.5 rounded-lg border px-3 py-2.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Impatto a 6 mesi</span>
                <b style={{ color: variance >= 0 ? "#C23434" : "#13855A" }}>
                  {variance >= 0 ? "+€ " : "−€ "}{Math.abs(variance).toLocaleString("it-IT")}k
                </b>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5" /> Confidenza modello previsionale: 96%
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function Stat({ label, value, note, accent }: { label: string; value: string; note?: string; accent: string }) {
  return (
    <Card className="gap-2">
      <CardContent className="space-y-1 pt-6">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="text-2xl font-semibold tabular-nums" style={{ color: accent }}>{value}</div>
        {note && <div className="text-xs text-muted-foreground">{note}</div>}
      </CardContent>
    </Card>
  );
}

function Legend({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) {
  return (
    <span className="flex items-center gap-1.5">
      <i className="inline-block h-0.5 w-3.5 rounded-sm" style={{ backgroundColor: color, ...(dashed ? { backgroundImage: `repeating-linear-gradient(90deg, ${color} 0 4px, transparent 4px 7px)`, backgroundColor: "transparent" } : {}) }} />
      {label}
    </span>
  );
}
