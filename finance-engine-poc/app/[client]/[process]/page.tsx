import { notFound } from "next/navigation";
import Link from "next/link";
import { ProcessDashboardView } from "@/components/process-dashboard";
import { AgfmFastClosing } from "@/components/agfm-fast-closing";
import { EdisonDocIntelligence } from "@/components/edison-doc-intelligence";
import { EdisonFraudDetection } from "@/components/edison-fraud-detection";
import { EdisonDocArchive } from "@/components/edison-doc-archive";
import { AccountingInvoices } from "@/components/accounting-invoices";
import { SystraPredictiveBudgeting } from "@/components/systra-predictive-budgeting";
import { SystraRoiTracker } from "@/components/systra-roi-tracker";
import { MedicairIngestion } from "@/components/medicair-ingestion";
import { getClient } from "@/lib/data";

export default async function ProcessPage({
  params,
}: {
  params: Promise<{ client: string; process: string }>;
}) {
  const { client: clientId, process: processId } = await params;
  const client = getClient(clientId);
  if (!client) notFound();

  const dashboard = client.dashboards.find((d) => d.id === processId);
  if (!dashboard) notFound();

  const accent = client.accent;
  let interactive: React.ReactNode = null;

  if ((client.id === "agfm" || client.id === "capitani-picone") && processId === "fast-closing") {
    interactive = <AgfmFastClosing accent={accent} />;
  } else if (client.id === "edison" && processId === "doc-intelligence") {
    interactive = <EdisonDocIntelligence accent={accent} />;
  } else if (client.id === "edison" && processId === "fraud") {
    interactive = <EdisonFraudDetection accent={accent} />;
  } else if (client.id === "edison" && processId === "doc-archive") {
    interactive = <EdisonDocArchive accent={accent} />;
  } else if (processId === "accounting") {
    interactive = <AccountingInvoices accent={accent} clientName={client.name} />;
  } else if (
    (client.id === "systra" || client.id === "basedigitale" || client.id === "capitani-picone") &&
    processId === "predictive-budgeting"
  ) {
    interactive = <SystraPredictiveBudgeting accent={accent} clientName={client.name} />;
  } else if ((client.id === "systra" || client.id === "basedigitale") && processId === "roi-tracker") {
    interactive = <SystraRoiTracker accent={accent} clientName={client.name} />;
  } else if (client.id === "medicair" && processId === "data-ingestion") {
    interactive = <MedicairIngestion accent={accent} />;
  }

  return (
    <>
      <Link href={`/${client.id}`} className="text-sm text-muted-foreground hover:underline">
        ← Panoramica {client.name}
      </Link>
      {interactive ?? <ProcessDashboardView dashboard={dashboard} accent={client.accent} clientId={client.id} />}
    </>
  );
}
