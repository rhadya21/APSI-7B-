import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/dashboard-shell";

export const dynamic = "force-dynamic";

export default async function PemilikPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("kopioz_session")?.value;

  if (!sessionCookie) redirect("/login");

  let session: { role?: string; name?: string };

  try {
    session = JSON.parse(sessionCookie) as { role?: string; name?: string };
  } catch {
    redirect("/login");
  }

  if (session.role !== "pemilik") redirect(session.role === "kasir" ? "/kasir" : "/login");

  return <DashboardShell role="Pemilik" userName={session.name ?? "Pemilik"} />;
}
