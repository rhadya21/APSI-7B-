import Link from "next/link";
import { notFound } from "next/navigation";

import { PrintReceiptButton } from "@/components/print-receipt-button";
import { prisma } from "@/lib/prisma";

const moneyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

function formatCurrency(value: unknown) {
  const asNumber =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : value && typeof value === "object" && "toString" in value
          ? Number(String(value))
          : 0;

  return moneyFormatter.format(Number.isFinite(asNumber) ? asNumber : 0);
}

function formatDate(value?: Date | string | null) {
  if (!value) return "-";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function TransaksiPesananPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const order = await prisma.pesanan.findUnique({
    where: { id_pesanan: id },
    include: {
      pelanggan: true,
      detail_pesanan: {
        include: { menu: true },
      },
    },
  });

  if (!order) {
    notFound();
  }

  const payment = await prisma.pembayaran.findFirst({
    where: {
      id_pesanan: id,
      status_pembayaran: "Lunas",
    },
    include: {
      transaksi: true,
    },
  });

  if (!payment) {
    notFound();
  }

  const transaction = payment.transaksi[0] ?? null;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_25%),linear-gradient(180deg,#5d6fc7_0%,#5a6abf_18%,#5468be_100%)] text-[#1e2b4d]">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center p-6 xl:p-10">
        <div className="w-full max-w-5xl rounded-[36px] bg-[linear-gradient(135deg,#f9faff_0%,#edf3ff_100%)] p-5 shadow-[0_30px_80px_rgba(22,30,83,0.22)] ring-1 ring-[#dfe7ff] sm:p-7">
          <div className="mb-6 flex items-center justify-between gap-3">
            <Link
              href="/kasir"
              className="inline-flex items-center gap-2 rounded-full border border-[#dfe6f8] bg-white px-4 py-2 text-sm font-semibold text-[#3b4e92] transition hover:bg-[#f5f7ff] print:hidden"
            >
              ← Kembali
            </Link>
            <div className="rounded-full border border-[#d3f5dc] bg-[#ebfff1] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#0f8c53]">
              Pembayaran Berhasil
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="rounded-[30px] bg-[#f7f9ff] p-5 ring-1 ring-[#e4ebfb]">
              <div className="mb-6 flex items-start justify-between gap-4 border-b border-[#edf1fb] pb-5">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#6d7ca6]">Transaksi pesanan</p>
                  <h1 className="mt-2 text-3xl font-black tracking-[-0.07em] text-[#23305e]">
                    #{order.nomor_antrian ?? order.id_pesanan}
                  </h1>
                </div>
                <div className="rounded-[18px] bg-[#edf2ff] px-3 py-2 text-right">
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#5d6db2]">ID</div>
                  <div className="mt-1 text-sm font-black text-[#2d3b74]">{transaction?.id_transaksi ?? "-"}</div>
                </div>
              </div>

              <div className="space-y-4 rounded-[22px] border border-[#e9eefc] bg-white p-4 shadow-[0_12px_26px_rgba(90,104,174,0.06)]">
                <div className="flex items-center justify-between gap-3 border-b border-[#edf1fb] pb-3">
                  <span className="text-sm text-[#6d7ca6]">Pelanggan</span>
                  <div className="text-right">
                    <div className="text-base font-semibold text-[#2d3b74]">
                      {order.pelanggan?.nama_pelanggan ?? "Walk-in"}
                    </div>
                    <div className="text-[11px] font-medium text-[#2c9b5a]">Sudah dibayar</div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 border-b border-[#edf1fb] pb-3">
                  <span className="text-sm text-[#6d7ca6]">Metode</span>
                  <span className="text-base font-semibold text-[#2d3b74]">{payment.metode}</span>
                </div>

                <div className="flex items-center justify-between gap-3 border-b border-[#edf1fb] pb-3">
                  <span className="text-sm text-[#6d7ca6]">Tanggal</span>
                  <span className="text-base font-semibold text-[#2d3b74]">
                    {formatDate(transaction?.tanggal_transaksi ?? new Date())}
                  </span>
                </div>

                <div className="space-y-3 pt-1">
                  <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#5d6db2]">Item pesanan</div>

                  {order.detail_pesanan.map((detail) => (
                    <div
                      key={detail.id_detail}
                      className="flex items-center justify-between gap-3 rounded-[15px] bg-[#f7f9ff] px-3 py-3"
                    >
                      <div>
                        <div className="text-base font-semibold text-[#2d3b74]">
                          {detail.menu?.nama_menu ?? "Menu"}
                        </div>
                        <div className="text-sm text-[#697aa7]">
                          {detail.kuantitas_produk ? `Qty x${detail.kuantitas_produk}` : "Qty 1"}
                        </div>
                      </div>
                      <div className="text-base font-semibold text-[#2d3b74]">
                        {formatCurrency(detail.subtotal)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <aside className="rounded-[30px] bg-[linear-gradient(180deg,#5d6ec8_0%,#5369bd_100%)] p-6 text-white shadow-[0_22px_34px_rgba(46,60,131,0.24)]">
              <div className="mb-6 text-center">
                <div className="mx-auto mb-3 grid h-16 w-16 place-items-center rounded-full bg-white/12 text-3xl shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]">
                  ✓
                </div>
                <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/75">Pembayaran berhasil</div>
                <h2 className="mt-2 text-4xl font-black tracking-[-0.07em] text-white">
                  {formatCurrency(payment.jumlah_bayar ?? order.total_tagihan)}
                </h2>
              </div>

              <div className="space-y-3 rounded-[22px] bg-white/10 p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between gap-3 text-sm text-white/80">
                  <span>Nomor Pesanan</span>
                  <span className="font-semibold text-white">{order.id_pesanan}</span>
                </div>
                <div className="flex items-center justify-between gap-3 text-sm text-white/80">
                  <span>Metode</span>
                  <span className="font-semibold text-white">{payment.metode}</span>
                </div>
                <div className="flex items-center justify-between gap-3 text-sm text-white/80">
                  <span>Status</span>
                  <span className="font-semibold text-[#d7ffe7]">Lunas</span>
                </div>
                <div className="flex items-center justify-between gap-3 text-sm text-white/80">
                  <span>Total</span>
                  <span className="font-semibold text-white">{formatCurrency(order.total_tagihan)}</span>
                </div>
              </div>

              <PrintReceiptButton label="Cetak Bukti Pembayaran" />
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
