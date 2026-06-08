import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Accesso negato — AIchain Finance Engine",
};

export default function DeniedPage() {
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
      </header>

      <main className="mx-auto w-full max-w-2xl px-6 py-16 sm:px-10">
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-6">
          <h1 className="text-2xl font-semibold text-destructive">
            Accesso negato
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            L&apos;utenza attuale non è autorizzata a vedere la stanza di questo
            cliente. Ogni <code>viewer</code> può accedere <strong>solo</strong>{" "}
            alla stanza del cliente a cui è associato. Per richiedere
            l&apos;accesso, contatta un amministratore.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              href="/"
              className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-secondary"
            >
              ← Torna alla home
            </Link>
            <Link
              href="/settings"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80"
            >
              Gestione utenze
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
