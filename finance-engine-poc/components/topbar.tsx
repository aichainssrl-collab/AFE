"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { PartnerSwitcher } from "@/components/partner-switcher";
import { OPEN_EXPERT_CHAT_EVENT } from "@/components/expert-chat-provider";
import type { ClientProfile } from "@/lib/data";

export function TopBar({ active }: { active: ClientProfile }) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 bg-background px-6 py-3">
      <div className="flex items-center gap-3">
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
      </div>

      <div className="ml-auto flex items-center gap-3">
        <Badge variant="secondary" className="gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
          Demo Mode
        </Badge>
        <Button
          size="sm"
          className="gap-1.5 rounded-[11px] border-0 text-white shadow-sm hover:opacity-90 hover:text-white"
          style={{ backgroundImage: "linear-gradient(100deg, #5B3E91, #00B4DB)" }}
          onClick={() => window.dispatchEvent(new Event(OPEN_EXPERT_CHAT_EVENT))}
        >
          <Sparkles className="h-3.5 w-3.5" />
          Esperto AIchain
        </Button>
        <PartnerSwitcher active={active} />
      </div>
    </header>
  );
}
