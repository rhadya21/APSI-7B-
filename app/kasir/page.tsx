import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/dashboard-shell";

export const dynamic = "force-dynamic";

export default async function KasirPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("kopioz_session")?.value;

  if (!sessionCookie) redirect("/login");

  let session: { role?: string; name?: string };

  try {
    session = JSON.parse(sessionCookie) as { role?: string; name?: string };
  } catch {
    redirect("/login");
  }

  if (session.role !== "kasir") redirect(session.role === "pemilik" ? "/pemilik" : "/login");

  return <DashboardShell role="Kasir" userName={session.name ?? "Kasir"} />;
}
