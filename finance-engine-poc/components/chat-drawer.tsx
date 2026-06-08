"use client";

import { useEffect, useRef, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Sparkles, Send } from "lucide-react";
import { expertReplyFallback, suggestionsFor, type ClientProfile } from "@/lib/data";
import { cn } from "@/lib/utils";

type Msg = { role: "bot" | "user"; content: string };

const INTRO: Msg = {
  role: "bot",
  content:
    "Ciao, sono l'Esperto AIchain. Posso spiegarti come la piattaforma trasforma i processi AFC — Fast Closing, Document Intelligence, Forecasting, Data Cleansing. Cosa vuoi sapere?",
};

export function ChatDrawer({
  open,
  onOpenChange,
  client,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  client: ClientProfile | null;
}) {
  const [msgs, setMsgs] = useState<Msg[]>([INTRO]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const sugg = suggestionsFor(client);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [msgs, busy]);

  async function send(text?: string) {
    const q = (text ?? input).trim();
    if (!q || busy) return;
    setMsgs((m) => [...m, { role: "user", content: q }]);
    setInput("");
    setBusy(true);
    await new Promise((r) => setTimeout(r, 650));
    const answer = expertReplyFallback(q, client);
    setMsgs((m) => [...m, { role: "bot", content: answer }]);
    setBusy(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <div>
              <SheetTitle>Esperto AIchain</SheetTitle>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Consulente AFC · online
              </div>
            </div>
          </div>
          {client && (
            <div className="mt-1 rounded-md bg-muted px-3 py-1.5 text-xs text-muted-foreground">
              Contesto: <b className="text-foreground">{client.name}</b>
            </div>
          )}
        </SheetHeader>

        <div ref={bodyRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {msgs.map((m, i) => (
            <div key={i} className={cn("flex gap-2", m.role === "user" && "flex-row-reverse")}>
              {m.role === "bot" && (
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Sparkles className="h-3 w-3" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
                  m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                )}
              >
                {m.content}
              </div>
            </div>
          ))}
          {busy && (
            <div className="flex gap-2">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Sparkles className="h-3 w-3" />
              </div>
              <div className="flex items-center gap-1 rounded-2xl bg-muted px-3.5 py-2.5">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/50" style={{ animationDelay: `${i * 120}ms` }} />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5 border-t px-4 py-3">
          {sugg.map((s, i) => (
            <button
              key={i}
              className="rounded-full border px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
              onClick={() => send(s)}
              disabled={busy}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 border-t px-4 py-3">
          <input
            className="flex-1 rounded-full border bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            value={input}
            placeholder="Scrivi una domanda…"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") send(); }}
            disabled={busy}
          />
          <Button size="icon" className="rounded-full" onClick={() => send()} disabled={busy || !input.trim()} aria-label="Invia">
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="px-4 pb-3 text-center text-[11px] text-muted-foreground">
          Risposte AI a scopo dimostrativo · dati simulati
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function ExpertFab({ onClick, hidden }: { onClick: () => void; hidden?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-lg transition-all hover:shadow-xl",
        hidden && "pointer-events-none translate-y-4 opacity-0"
      )}
    >
      <Sparkles className="h-4 w-4" />
      Chiedi all&apos;Esperto
    </button>
  );
}
