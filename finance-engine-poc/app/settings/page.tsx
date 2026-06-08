import Link from "next/link";
import Image from "next/image";
import { SettingsPanel } from "@/components/settings-panel";

export const metadata = {
  title: "Settings — Utenze per cliente — AIchain Finance Engine",
};

export default function SettingsPage() {
  return (
    <div className="min-h-screen">
      <header className="flex items-center gap-3 px-6 py-4 sm:px-10">
        <Image
          src="/aichain-logo.jpeg"
          alt="AIchain Solutions"
          width={110}
          height={38}
          priority
          className="h-9 w-auto rounded-[3px]"
        />
        <span className="h-6 w-px bg-border" aria-hidden />
        <div className="leading-tight">
          <p className="text-sm font-semibold">Finance Engine</p>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
            AFC Intelligence Platform
          </p>
        </div>
        <Link
          href="/"
          className="ml-auto text-sm text-muted-foreground hover:underline"
        >
          ← Selezione azienda
        </Link>
      </header>

      <main className="mx-auto w-full max-w-5xl px-6 py-8 sm:px-10">
        <div className="mb-6 space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">
            V-Lab Smart Finance
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">
            Settings · Utenze per cliente
          </h1>
          <p className="text-sm text-muted-foreground">
            Crea le utenze che possono accedere al POC. Ogni <code>viewer</code>{" "}
            vede solo la stanza del cliente a cui è associato, senza poter
            navigare nelle altre. Solo un <code>admin</code> può gestire le
            utenze.
          </p>
        </div>
        <SettingsPanel />
      </main>
    </div>
  );
}
