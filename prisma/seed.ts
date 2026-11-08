import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const menus = [
  ["M001", "Kopi Susu Oz Reguler", 10000],
  ["M002", "Kopi Susu Oz Large", 15000],
  ["M003", "Chocolate Oz", 10000],
  ["M004", "Green Tea Oz", 10000],
  ["M005", "Kopi Susu Strong", 13000],
  ["M006", "Kopi Susu Caramel", 15000],
  ["M007", "Americano", 8000],
  ["M008", "Butterscotch", 18000],
] as const;

async function main() {
  await prisma.pengguna.upsert({
    where: { id_pengguna: "USR01" },
    update: { nama: "Kasir Demo", username: "kasir@demo.com", password: "kasir123", role: "kasir" },
    create: { id_pengguna: "USR01", nama: "Kasir Demo", username: "kasir@demo.com", password: "kasir123", role: "kasir" },
  });
  await prisma.pengguna.upsert({
    where: { id_pengguna: "USR02" },
    update: { nama: "Pemilik Demo", username: "pemilik@demo.com", password: "pemilik123", role: "pemilik" },
    create: { id_pengguna: "USR02", nama: "Pemilik Demo", username: "pemilik@demo.com", password: "pemilik123", role: "pemilik" },
  });

  for (const [id_menu, nama_menu, harga] of menus) {
    await prisma.menu.upsert({ where: { id_menu }, update: { nama_menu, harga, status_tersedia: 1 }, create: { id_menu, nama_menu, harga, status_tersedia: 1 } });
  }

  for (let index = 1; index <= 24; index += 1) {
    const orderId = `PS${String(index).padStart(6, "0")}`;
    const paymentId = `PM${String(index).padStart(8, "0")}`;
    const transactionId = `TR${String(index).padStart(8, "0")}`;
    const first = menus[index % menus.length];
    const second = menus[(index + 2) % menus.length];
    const quantity = (index % 3) + 1;
    const total = first[2] * quantity + second[2];
    const date = new Date(Date.now() - index * 86400000);

    await prisma.pesanan.upsert({
      where: { id_pesanan: orderId },
      update: { tanggal: date, nomor_antrian: index, status_pesanan: "Selesai", total_tagihan: total, id_pengguna: "USR01" },
      create: { id_pesanan: orderId, tanggal: date, nomor_antrian: index, status_pesanan: "Selesai", total_tagihan: total, id_pengguna: "USR01" },
    });
    await prisma.detail_pesanan.upsert({
      where: { id_detail: `DT${String(index).padStart(8, "0")}` },
      update: { kuantitas_produk: quantity, subtotal: first[2] * quantity, id_pesanan: orderId, id_menu: first[0] },
      create: { id_detail: `DT${String(index).padStart(8, "0")}`, kuantitas_produk: quantity, subtotal: first[2] * quantity, id_pesanan: orderId, id_menu: first[0] },
    });
    await prisma.detail_pesanan.upsert({
      where: { id_detail: `DX${String(index).padStart(8, "0")}` },
      update: { kuantitas_produk: 1, subtotal: second[2], id_pesanan: orderId, id_menu: second[0] },
      create: { id_detail: `DX${String(index).padStart(8, "0")}`, kuantitas_produk: 1, subtotal: second[2], id_pesanan: orderId, id_menu: second[0] },
    });
    await prisma.pembayaran.upsert({
      where: { id_pembayaran: paymentId },
      update: { id_pesanan: orderId, metode: index % 2 ? "Tunai ke Kasir" : "QRIS", jumlah_bayar: total, uang_diterima: total, kembalian: 0, status_pembayaran: "Lunas", id_pengguna: "USR01" },
      create: { id_pembayaran: paymentId, id_pesanan: orderId, metode: index % 2 ? "Tunai ke Kasir" : "QRIS", jumlah_bayar: total, uang_diterima: total, kembalian: 0, status_pembayaran: "Lunas", id_pengguna: "USR01" },
    });
    await prisma.transaksi.upsert({
      where: { id_transaksi: transactionId },
      update: { tanggal_transaksi: date, total_transaksi: total, id_pembayaran: paymentId },
      create: { id_transaksi: transactionId, tanggal_transaksi: date, total_transaksi: total, id_pembayaran: paymentId },
    });
  }
}

main().finally(() => prisma.$disconnect());
