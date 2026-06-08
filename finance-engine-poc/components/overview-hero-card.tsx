import { ProcessBadge } from "@/components/process-badge";
import { BarrierResponseBox } from "@/components/barrier-response-box";
import type { ClientProfile } from "@/lib/data";

export function OverviewHeroCard({ client }: { client: ClientProfile }) {
  return (
    <div
      className="space-y-4 rounded-lg border border-l-4 bg-card p-5"
      style={{ borderLeftColor: client.accent }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {client.logo && (
            <span
              className="flex h-12 shrink-0 items-center justify-center rounded-md border px-3"
              style={{
                backgroundColor: client.logoBg === "white" ? "#ffffff" : client.accent,
                borderColor: client.logoBg === "white" ? "var(--border)" : client.accent,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={client.logo} alt={client.name} className="max-h-6 w-auto" />
            </span>
          )}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: client.accent }}>
              {client.eyebrow ?? client.sector}
            </p>
            <h2 className="text-2xl font-semibold tracking-tight">{client.name}</h2>
          </div>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          {client.objectives.map((o) => (
            <ProcessBadge key={o} label={o} />
          ))}
        </div>
      </div>

      <BarrierResponseBox barrier={client.barrier} response={client.pitch} />
    </div>
  );
}
