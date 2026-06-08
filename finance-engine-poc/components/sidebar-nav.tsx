"use client";

import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Zap,
  Target,
  Receipt,
  Gauge,
  ScanLine,
  ShieldAlert,
  FolderOpen,
  TrendingUp,
  Coins,
  Layers,
  ClipboardList,
  Network,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { SidebarNavItem } from "@/components/sidebar-nav-item";
import { PROCESS_NAV_META, CLIENT_FLAGSHIP, type ClientProfile, type NavIconKey } from "@/lib/data";

const ICONS: Record<NavIconKey, LucideIcon> = {
  grid: LayoutDashboard,
  bolt: Zap,
  target: Target,
  receipt: Receipt,
  gauge: Gauge,
  scan: ScanLine,
  shield: ShieldAlert,
  folder: FolderOpen,
  trend: TrendingUp,
  coins: Coins,
  layers: Layers,
};

export function SidebarNav({ client }: { client: ClientProfile }) {
  const pathname = usePathname();
  const base = `/${client.id}`;
  const flagshipId = CLIENT_FLAGSHIP[client.id];

  // Nav is derived from the client's actual dashboards, so every link resolves
  // to a real route (no 404s), plus a fixed "Panoramica" entry for the overview.
  const items = [
    { href: base, icon: ICONS.grid, label: "Panoramica", badge: undefined as string | undefined },
    { href: `${base}/valore`, icon: Trophy, label: "Valore & risultati", badge: undefined as string | undefined },
    ...client.dashboards.map((d) => {
      const meta = PROCESS_NAV_META[d.id];
      return {
        href: `${base}/${d.id}`,
        icon: meta ? ICONS[meta.icon] : LayoutDashboard,
        label: meta?.navLabel ?? d.title,
        badge: d.id === flagshipId ? "DEMO" : undefined,
      };
    }),
    { href: `${base}/architettura`, icon: Network, label: "Architettura", badge: undefined as string | undefined },
    { href: `${base}/specifiche`, icon: ClipboardList, label: "Specifiche progetto", badge: undefined as string | undefined },
  ];

  return (
    <aside className="flex w-64 shrink-0 flex-col gap-1 border-r bg-background px-3 py-4">
      <div className="mb-3 rounded-[13px] bg-secondary px-3 py-2.5">
        {client.logo ? (
          <span
            className="mb-2 flex h-10 items-center justify-center rounded-md border px-3"
            style={{
              backgroundColor: client.logoBg === "white" ? "#ffffff" : client.accent,
              borderColor: client.logoBg === "white" ? "var(--border)" : client.accent,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={client.logo} alt={client.name} className="max-h-5 w-auto" />
          </span>
        ) : (
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: client.accent }} aria-hidden />
            <span className="text-sm font-semibold">{client.name}</span>
          </div>
        )}
        <p className="mt-0.5 text-[11px] text-muted-foreground">{client.barrierTag}</p>
      </div>

      {items.map((item) => (
        <SidebarNavItem
          key={item.href}
          href={item.href}
          icon={item.icon}
          label={item.label}
          badge={item.badge}
          active={pathname === item.href}
          accent={client.accent}
          accentSoft={client.accentSoft}
        />
      ))}
    </aside>
  );
}
