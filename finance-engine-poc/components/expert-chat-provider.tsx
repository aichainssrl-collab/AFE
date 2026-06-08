"use client";

import { useEffect, useState } from "react";

export const OPEN_EXPERT_CHAT_EVENT = "aichain:open-expert-chat";
import { usePathname } from "next/navigation";
import { ChatDrawer, ExpertFab } from "@/components/chat-drawer";
import { getClient } from "@/lib/data";

export function ExpertChatProvider() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener(OPEN_EXPERT_CHAT_EVENT, handler);
    return () => window.removeEventListener(OPEN_EXPERT_CHAT_EVENT, handler);
  }, []);

  const seg = pathname?.split("/").filter(Boolean)[0];
  const client = seg ? getClient(seg) ?? null : null;

  return (
    <>
      <ExpertFab onClick={() => setOpen(true)} hidden={open} />
      <ChatDrawer open={open} onOpenChange={setOpen} client={client} />
    </>
  );
}
