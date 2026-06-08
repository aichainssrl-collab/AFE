import Link from "next/link";
import Image from "next/image";
import { SpecForm } from "@/components/spec-form";
import spec from "@/lib/spec-questions.json";

export const metadata = {
  title: "Specifiche di sviluppo — AIchain Finance Engine",
};

export default function SpecifichePage() {
  return (
    <div className="min-h-screen">
      <header className="flex items-center gap-3 px-6 py-4 sm:px-10">
        <Image src="/aichain-logo.jpeg" alt="AIchain Solutions" width={110} height={38} priority className="h-9 w-auto rounded-[3px]" />
        <span className="h-6 w-px bg-border" aria-hidden />
        <div className="leading-tight">
          <p className="text-sm font-semibold">Finance Engine</p>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">AFC Intelligence Platform</p>
        </div>
        <Link href="/" className="ml-auto text-sm text-muted-foreground hover:underline">
          ← Torna alle aziende
        </Link>
      </header>

      <main className="mx-auto w-full max-w-4xl px-6 py-8 sm:px-10">
        <div className="mb-6 space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">Onboarding progetto</p>
          <h1 className="text-2xl font-semibold tracking-tight">{spec.title}</h1>
          <p className="text-sm text-muted-foreground">{spec.description}</p>
        </div>
        <SpecForm />
      </main>
    </div>
  );
}
