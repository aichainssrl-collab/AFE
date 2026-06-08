"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Check } from "lucide-react";
import { CLIENTS, type ClientProfile } from "@/lib/data";
import { cn } from "@/lib/utils";

export function PartnerSwitcher({ active }: { active: ClientProfile }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-md border px-3 py-1.5 text-left hover:bg-accent"
      >
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: active.accent }} aria-hidden />
        <span className="leading-tight">
          <span className="block text-sm font-medium">{active.name}</span>
          <span className="block text-[11px] text-muted-foreground">{active.eyebrow ?? active.sector}</span>
        </span>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute right-0 z-40 mt-2 w-72 rounded-md border bg-popover p-1.5 shadow-md">
          <p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Partner Business Matching
          </p>
          {CLIENTS.map((c) => {
            const isActive = c.id === active.id;
            return (
              <Link
                key={c.id}
                href={`/${c.id}`}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent",
                  isActive && "bg-accent/60"
                )}
              >
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.accent }} aria-hidden />
                <span className="leading-tight">
                  <span className="block font-medium">{c.name}</span>
                  <span className="block text-[11px] text-muted-foreground">{c.barrierTag}</span>
                </span>
                {isActive && <Check className="ml-auto h-4 w-4 text-emerald-600" />}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
