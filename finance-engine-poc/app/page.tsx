import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CLIENTS } from "@/lib/data";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-background">
      <header className="px-6 py-10 sm:px-10">
        <div className="mx-auto flex max-w-5xl flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <Badge variant="outline" className="mb-2">V-Lab Smart Finance · Business Matching</Badge>
            <h1 className="text-3xl font-semibold tracking-tight">AIchain Finance Engine</h1>
            <p className="max-w-2xl text-muted-foreground">
              Demo dei processi AFC potenziati dall&apos;AI per cinque aziende del programma. Seleziona un&apos;azienda per
              esplorare panoramica, KPI e dashboard di processo costruiti sul suo caso specifico.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/dashboard"
              className="rounded-[11px] border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
            >
              Dashboard prospect →
            </Link>
            <Link
              href="/specifiche"
              className="rounded-[11px] border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
            >
              Specifiche di sviluppo →
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10 sm:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {CLIENTS.map((c) => (
            <Link key={c.id} href={`/${c.id}`} className="group">
              <Card className="relative h-full overflow-hidden transition-all duration-150 group-hover:-translate-y-1 group-hover:shadow-lg">
                <span
                  className="pointer-events-none absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 transition-transform duration-150 group-hover:scale-x-100"
                  style={{ backgroundColor: c.accent }}
                  aria-hidden
                />
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{c.name}</CardTitle>
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: c.accent }}
                      aria-hidden
                    />
                  </div>
                  <CardDescription>{c.sector}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{c.pitch}</p>
                  <Badge
                    variant="secondary"
                    className="text-xs"
                    style={{ backgroundColor: c.accentSoft, color: c.accent }}
                  >
                    Barriera: {c.barrierTag}
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
