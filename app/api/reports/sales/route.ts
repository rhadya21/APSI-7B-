import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    await requireSession("pemilik");
    const url = new URL(request.url);
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");
    const search = url.searchParams.get("search")?.trim();
    const orders = await prisma.pesanan.findMany({ where: { status_pesanan: "Selesai", ...(from || to ? { tanggal: { ...(from ? { gte: new Date(from) } : {}), ...(to ? { lte: new Date(`${to}T23:59:59`) } : {}) } } : {}), ...(search ? { id_pesanan: { contains: search, mode: "insensitive" } } : {}) }, orderBy: { tanggal: "desc" }, include: { detail_pesanan: { include: { menu: true } }, pembayaran: true } });
    const totalSales = orders.reduce((sum, order) => sum + Number(order.total_tagihan ?? 0), 0);
    return NextResponse.json({ summary: { totalSales, transactionCount: orders.length }, orders });
  } catch (error) {
    const status = error instanceof Error && error.message === "FORBIDDEN" ? 403 : 401;
    return NextResponse.json({ error: status === 403 ? "Forbidden" : "Unauthorized" }, { status });
  }
}
