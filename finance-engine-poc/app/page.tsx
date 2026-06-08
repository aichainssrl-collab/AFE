import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ClientGrid } from "@/components/client-grid";
import { UserSwitcher } from "@/components/user-switcher";
import { CollectedRequirementsCard } from "@/components/collected-requirements-card";

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
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/dashboard"
              className="rounded-[11px] border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
            >
              Dashboard prospect →
            </Link>
            <Link
              href="/settings"
              className="rounded-[11px] border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
            >
              Settings →
            </Link>
            <Link
              href="/specifiche"
              className="rounded-[11px] border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
            >
              Specifiche di sviluppo →
            </Link>
            <UserSwitcher />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10 sm:px-10">
        <div className="mb-8">
          <CollectedRequirementsCard />
        </div>
        <ClientGrid />
      </main>
    </div>
  );
}
