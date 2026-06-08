"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Building2, CheckCircle2, Layers, FileText, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CLIENTS } from "@/lib/data";
import spec from "@/lib/spec-questions.json";

type Section = { questions: { id: string }[] };
const COMMON = (spec.sections as Section[]).reduce((n, s) => n + s.questions.length, 0);
const PROSPECT_SECTIONS = spec.prospectSections as Record<string, Section>;

function totalQuestions(clientId: string) {
  return COMMON + (PROSPECT_SECTIONS[clientId]?.questions.length ?? 0);
}

function answeredCount(saved: Record<string, unknown> | null) {
  if (!saved) return 0;
  return Object.values(saved).filter((v) =>
    Array.isArray(v) ? v.length > 0 : v != null && String(v).trim() !== ""
  ).length;
}

export function ProspectsDashboard() {
  const [answers, setAnswers] = useState<Record<string, Record<string, unknown> | null>>({});

  useEffect(() => {
    const next: Record<string, Record<string, unknown> | null> = {};
    for (const c of CLIENTS) {
      try {
        const raw = localStorage.getItem(`aichain:spec-form:${c.id}`);
        next[c.id] = raw ? JSON.parse(raw) : null;
      } catch {
        next[c.id] = null;
      }
    }
    setAnswers(next);
  }, []);

  const sectors = new Set(CLIENTS.map((c) => c.sector)).size;
  const services = CLIENTS.reduce((n, c) => n + c.dashboards.length, 0);
  const compiled = CLIENTS.filter((c) => answeredCount(answers[c.id]) > 0).length;

  const stats = [
    { icon: Building2, label: "Prospect", value: CLIENTS.length },
    { icon: Layers, label: "Settori", value: sectors },
    { icon: FileText, label: "Specifiche avviate", value: compiled },
    { icon: CheckCircle2, label: "Servizi totali", value: services },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-3 p-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-muted-foreground">
                <s.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-mono text-2xl font-semibold tabular-nums">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Lista prospect</CardTitle>
          <p className="text-sm text-muted-foreground">
            Tutti i prospect del programma con barriera, servizi attivi e stato delle specifiche.
          </p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Prospect</TableHead>
                <TableHead>Settore</TableHead>
                <TableHead>Barriera</TableHead>
                <TableHead className="text-center">Servizi</TableHead>
                <TableHead>Specifiche</TableHead>
                <TableHead className="text-right">Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {CLIENTS.map((c) => {
                const total = totalQuestions(c.id);
                const done = answeredCount(answers[c.id]);
                const pct = total ? Math.round((done / total) * 100) : 0;
                return (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <span
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
                          style={{ backgroundColor: c.accent }}
                        >
                          <span className="h-2 w-2 rounded-full bg-white/90" aria-hidden />
                        </span>
                        <Link href={`/${c.id}`} className="font-medium hover:underline">
                          {c.name}
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{c.sector}</TableCell>
                    <TableCell>
                      <span
                        className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                        style={{ backgroundColor: c.accentSoft, color: c.accent }}
                      >
                        {c.barrierTag}
                      </span>
                    </TableCell>
                    <TableCell className="text-center font-mono tabular-nums text-sm">{c.dashboards.length}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-secondary">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${pct}%`, backgroundColor: c.accent }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {done > 0 ? `${pct}%` : "da avviare"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/${c.id}/specifiche`}
                        className="inline-flex items-center gap-1 whitespace-nowrap text-sm font-medium hover:underline"
                        style={{ color: c.accent }}
                      >
                        Specifiche <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
