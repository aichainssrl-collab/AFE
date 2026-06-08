import { notFound } from "next/navigation";
import { TopBar } from "@/components/topbar";
import { SidebarNav } from "@/components/sidebar-nav";
import { getClient } from "@/lib/data";

export default async function ClientLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ client: string }>;
}) {
  const { client: clientId } = await params;
  const client = getClient(clientId);
  if (!client) notFound();

  return (
    <div className="flex flex-1 flex-col">
      <TopBar active={client} />
      <div className="flex flex-1">
        <SidebarNav client={client} />
        <main className="mx-auto w-full flex-1 px-6 py-8 sm:px-10 space-y-6">{children}</main>
      </div>
    </div>
  );
}
