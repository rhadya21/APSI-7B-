"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const allowedPaymentMethods = new Set(["QRIS", "Tunai ke Kasir", "Kartu Debit", "Transfer Bank"]);

export async function bayarPesananAction(formData: FormData) {
  const orderId = String(formData.get("id_pesanan") ?? "").trim();
  const selectedMethod = String(formData.get("metode") ?? "").trim();
  const jumlahBayarRaw = String(formData.get("jumlah_bayar") ?? "").trim();
  const session = await getSession();

  if (!orderId) {
    redirect("/kasir?error=missing_order");
  }

  if (!allowedPaymentMethods.has(selectedMethod)) {
    redirect(`/kasir?error=invalid_payment_method&order=${encodeURIComponent(orderId)}`);
  }

  const order = await prisma.pesanan.findUnique({
    where: { id_pesanan: orderId },
  });

  if (!order || order.total_tagihan == null) {
    redirect(`/kasir?error=order_not_found&order=${encodeURIComponent(orderId)}`);
  }

  const totalTagihan = Number(order.total_tagihan);
  const jumlahBayar = Number(jumlahBayarRaw || totalTagihan);

  if (!Number.isFinite(totalTagihan) || !Number.isFinite(jumlahBayar) || jumlahBayar < totalTagihan) {
    redirect(`/kasir?error=payment_amount_mismatch&order=${encodeURIComponent(orderId)}`);
  }

  const existingPayment = await prisma.pembayaran.findFirst({
    where: {
      id_pesanan: orderId,
      status_pembayaran: "Lunas",
    },
  });

  if (existingPayment || order.status_pesanan?.trim().toLowerCase() === "selesai") {
    redirect(`/kasir?error=order_already_paid&order=${encodeURIComponent(orderId)}`);
  }

  const paymentId = `PM${Date.now().toString().slice(-6)}`;
  const transactionId = `TR${Date.now().toString().slice(-6)}`;

  await prisma.$transaction(async (tx) => {
    await tx.pembayaran.create({
      data: {
        id_pembayaran: paymentId,
        id_pesanan: order.id_pesanan,
        metode: selectedMethod,
        jumlah_bayar: totalTagihan,
        uang_diterima: jumlahBayar,
        kembalian: jumlahBayar - totalTagihan,
        status_pembayaran: "Lunas",
        id_pengguna: session?.userId ?? order.id_pengguna ?? "USR01",
      },
    });

    await tx.transaksi.create({
      data: {
        id_transaksi: transactionId,
        tanggal_transaksi: new Date(),
        total_transaksi: totalTagihan,
        id_pembayaran: paymentId,
      },
    });

    await tx.pesanan.update({
      where: { id_pesanan: order.id_pesanan },
      data: {
        status_pesanan: "Selesai",
      },
    });
  });

  revalidatePath("/kasir");
  redirect(`/kasir/transaksi/${encodeURIComponent(orderId)}`);
}
