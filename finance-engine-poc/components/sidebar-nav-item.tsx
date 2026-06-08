"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function SidebarNavItem({
  href,
  icon: Icon,
  label,
  active,
  badge,
  accent = "#5b3e91",
  accentSoft = "#eee9f6",
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  active?: boolean;
  badge?: string;
  accent?: string;
  accentSoft?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 rounded-[11px] px-3 py-2 text-sm font-medium transition-colors",
        active ? "text-white" : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
      )}
      style={active ? { backgroundColor: accent } : undefined}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="flex-1">{label}</span>
      {badge && (
        <span
          className="rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none"
          style={
            active
              ? { backgroundColor: "rgba(255,255,255,0.22)", color: "#fff" }
              : { backgroundColor: accentSoft, color: accent }
          }
        >
          {badge}
        </span>
      )}
    </Link>
  );
}
