"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CLIENTS } from "@/lib/data";
import { cn } from "@/lib/utils";

export function ClientNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2">
      {CLIENTS.map((c) => {
        const href = `/${c.id}`;
        const active = pathname === href || pathname?.startsWith(`${href}/`);
        return (
          <Link
            key={c.id}
            href={href}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium border transition-colors",
              active
                ? "text-white border-transparent"
                : "text-foreground/70 border-border hover:text-foreground"
            )}
            style={active ? { backgroundColor: c.accent } : undefined}
          >
            {c.name}
          </Link>
        );
      })}
    </nav>
  );
}
