import Link from "next/link";
import { Layers, Zap } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function RecommendedDemoCta({
  title = "Demo consigliata · Data Ingestion",
  description,
  href,
  accent,
}: {
  title?: string;
  description: string;
  href: string;
  accent?: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border bg-card p-4">
      <div className="flex items-start gap-3">
        <span
          className="flex h-9 w-9 items-center justify-center rounded-md"
          style={{ backgroundColor: accent ? `${accent}1A` : undefined, color: accent }}
        >
          <Layers className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <Link
        href={href}
        className={cn(
          buttonVariants(),
          "gap-1.5 border-0 text-white hover:opacity-90 hover:text-white"
        )}
        style={{ backgroundImage: "linear-gradient(100deg, #5B3E91, #00B4DB)" }}
      >
        <Zap className="h-3.5 w-3.5" />
        Avvia demo
      </Link>
    </div>
  );
}
