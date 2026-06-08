"use client";

import { useState } from "react";
import { Layers, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { itNum } from "@/lib/data";

export function UnifiedFlowPanel({ totalRecords, totalCorrected }: { totalRecords: number; totalCorrected: number }) {
  const [analyzed, setAnalyzed] = useState(0);
  const [corrected, setCorrected] = useState(0);
  const [running, setRunning] = useState(false);

  function runCleansing() {
    if (running) return;
    setRunning(true);
    setAnalyzed(0);
    setCorrected(0);
    const steps = 24;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setAnalyzed(Math.round((totalRecords * i) / steps));
      setCorrected(Math.round((totalCorrected * i) / steps));
      if (i >= steps) {
        clearInterval(id);
        setAnalyzed(totalRecords);
        setCorrected(totalCorrected);
        setRunning(false);
      }
    }, 90);
  }

  return (
    <div className="space-y-5 rounded-lg border bg-card p-5 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-teal-100 text-teal-700">
        <Layers className="h-5 w-5" />
      </span>
      <p className="text-sm font-semibold">Flusso dati unificato</p>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-2xl font-semibold tabular-nums">{itNum(analyzed)}</p>
          <p className="text-xs text-muted-foreground">record finanziari analizzati</p>
        </div>
        <div>
          <p className="text-2xl font-semibold tabular-nums">{itNum(corrected)}</p>
          <p className="text-xs text-muted-foreground">duplicati / malformati corretti</p>
        </div>
      </div>

      <Button
        className="w-full gap-1.5 bg-violet-600 text-white hover:bg-violet-700"
        onClick={runCleansing}
        disabled={running}
      >
        <Zap className="h-3.5 w-3.5" />
        {running ? "Elaborazione in corso…" : "Esegui AI Data Cleansing & Normalizzazione"}
      </Button>
    </div>
  );
}
