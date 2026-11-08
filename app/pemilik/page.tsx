import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Prisma } from "@/app/generated/prisma/client";
import { DashboardShell } from "@/components/dashboard-shell";
import { prisma } from "@/lib/prisma";

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

  const sessionRole = String(session.role ?? "").trim().toLowerCase();

  if (sessionRole !== "pemilik") {
    redirect("/login");
  }

  const roleLabel = "Pemilik";

  let orders: Prisma.pesananGetPayload<{
    include: {
      pelanggan: true;
      detail_pesanan: {
        include: {
          menu: true;
        };
      };
    };
  }>[] = [];

  try {
    orders = await prisma.pesanan.findMany({
      where: {
        status_pesanan: "Selesai",
      },
      orderBy: [{ tanggal: "desc" }, { nomor_antrian: "desc" }],
      include: {
        pelanggan: true,
        detail_pesanan: {
          include: {
            menu: true,
          },
        },
      },
    });
  } catch {
    orders = [];
  }

  return <DashboardShell role={roleLabel} userName={session.name ?? roleLabel} orders={orders} />;
}
