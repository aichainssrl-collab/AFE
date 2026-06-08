"use client";

import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { OPEN_EXPERT_CHAT_EVENT } from "@/components/expert-chat-provider";

export function ExpertChatButton() {
  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-1.5"
      onClick={() => window.dispatchEvent(new Event(OPEN_EXPERT_CHAT_EVENT))}
    >
      <Sparkles className="h-3.5 w-3.5" />
      Esperto AIchain
    </Button>
  );
}
