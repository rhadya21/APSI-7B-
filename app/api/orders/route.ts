import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";

export async function GET() {
  try {
    await requireSession(["kasir", "pemilik"]);
    const orders = await prisma.pesanan.findMany({ orderBy: [{ tanggal: "desc" }, { nomor_antrian: "desc" }], include: { pelanggan: true, detail_pesanan: { include: { menu: true } }, pembayaran: true } });
    return NextResponse.json(orders);
  } catch (error) {
    const status = error instanceof Error && error.message === "FORBIDDEN" ? 403 : 401;
    return NextResponse.json({ error: "Unauthorized" }, { status });
  }
}
