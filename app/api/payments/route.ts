import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";

const methods = new Set(["QRIS", "Tunai ke Kasir", "Kartu Debit", "Transfer Bank"]);
const id = (prefix: string) => `${prefix}${Date.now().toString(36).slice(-8).toUpperCase()}`.slice(0, 10);

export async function POST(request: Request) {
  try {
    const session = await requireSession("kasir");
    const body = (await request.json()) as { orderId?: string; method?: string; received?: number };
    const order = body.orderId ? await prisma.pesanan.findUnique({ where: { id_pesanan: body.orderId } }) : null;
    if (!order?.total_tagihan || !body.method || !methods.has(body.method)) return NextResponse.json({ error: "Pesanan atau metode pembayaran tidak valid" }, { status: 400 });
    const total = Number(order.total_tagihan);
    const received = body.method === "Tunai ke Kasir" ? Number(body.received) : total;
    if (!Number.isFinite(received) || received < total) return NextResponse.json({ error: "Uang diterima kurang atau tidak valid" }, { status: 400 });
    const paymentId = id("PM");
    const transactionId = id("TR");
    await prisma.$transaction(async (tx) => {
      await tx.pembayaran.create({ data: { id_pembayaran: paymentId, id_pesanan: order.id_pesanan, metode: body.method, jumlah_bayar: total, uang_diterima: received, kembalian: received - total, status_pembayaran: "Lunas", id_pengguna: session.userId } });
      await tx.transaksi.create({ data: { id_transaksi: transactionId, tanggal_transaksi: new Date(), total_transaksi: total, id_pembayaran: paymentId } });
      await tx.pesanan.update({ where: { id_pesanan: order.id_pesanan }, data: { status_pesanan: "Selesai" } });
    });
    return NextResponse.json({ transactionId, paymentId, orderId: order.id_pesanan, total, received, change: received - total }, { status: 201 });
  } catch (error) {
    const status = error instanceof Error && error.message === "FORBIDDEN" ? 403 : 401;
    return NextResponse.json({ error: status === 403 ? "Forbidden" : "Unauthorized" }, { status });
  }
}
