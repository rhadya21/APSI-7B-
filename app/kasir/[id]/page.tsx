import Link from "next/link";
import { notFound } from "next/navigation";

import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";

import { PaymentPanel } from "./PaymentPanel";

const moneyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

type OrderWithRelations = Prisma.pesananGetPayload<{
  include: {
    pelanggan: true;
    detail_pesanan: {
      include: {
        menu: true;
      };
    };
  };
}>;

type OrderDetail = NonNullable<OrderWithRelations["detail_pesanan"]>[number];

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

function normalizeStatus(value?: string | null) {
  const status = (value ?? "Menunggu").trim().toLowerCase();
  switch (status) {
    case "menunggu":
      return "Menunggu";
    case "diproses":
      return "Diproses";
    case "selesai":
      return "Selesai";
    case "batal":
      return "Batal";
    default:
      return "Menunggu";
  }
}

function badgeColor(status: string) {
  switch (status) {
    case "Menunggu":
      return "bg-[#fef3c7] text-[#92400e] border border-[#f6d589]";
    case "Diproses":
      return "bg-[#e0e7ff] text-[#3730a3] border border-[#c7d2fe]";
    case "Selesai":
      return "bg-[#dcfce7] text-[#166534] border border-[#bbf7d0]";
    case "Batal":
      return "bg-[#fee2e2] text-[#991b1b] border border-[#fecaca]";
    default:
      return "bg-[#f3f4f6] text-[#374151] border border-[#e5e7eb]";
  }
}

export default async function KasirOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const order = await prisma.pesanan.findUnique({
    where: { id_pesanan: id },
    include: {
      pelanggan: true,
      detail_pesanan: {
        include: {
          menu: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  const status = normalizeStatus(order.status_pesanan);

  return (
    <main className="min-h-screen bg-[#5869b5] text-[#1e2b4d]">
      <div className="flex min-h-screen">
        <aside className="flex w-[220px] shrink-0 flex-col bg-[#4d5fae] px-4 pb-4 pt-5 text-white shadow-[inset_-1px_0_0_rgba(255,255,255,0.12)]">
          <div className="mb-8 px-2">
            <div className="flex flex-col leading-[0.72] text-[2.3rem] font-black tracking-[-0.12em] text-white/95">
              <span>ko</span>
              <span>pi</span>
              <span>oz</span>
            </div>
          </div>

          <nav className="space-y-2">
            <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55">
              Working Space
            </div>
            {[
              { label: "Dashboard", href: "/kasir" },
              { label: "Pembayaran", href: "/kasir", active: true },
              { label: "Bukti Pembayaran", href: "/kasir/bukti-pembayaran" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={[
                  "flex w-full items-center gap-3 rounded-full px-3 py-2.5 text-left text-sm font-medium transition-colors",
                  item.active
                    ? "bg-white/15 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                    : "text-white/75 hover:bg-white/6 hover:text-white",
                ].join(" ")}
              >
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-sm border border-white/40 text-[9px] opacity-80">
                  {item.active ? "•" : ""}
                </span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="mt-auto rounded-[18px] bg-white/8 p-3 text-white/90 backdrop-blur-sm">
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/60">Role</p>
            <p className="mt-2 text-sm font-semibold">Kasir</p>
            <p className="mt-1 text-xs text-white/70">Rahma</p>
          </div>
        </aside>

        <div className="relative flex-1 overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.10),transparent_28%),linear-gradient(180deg,#6579d8_0%,#5c6fd2_22%,#5669c5_100%)]">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.08),transparent_35%,rgba(255,255,255,0.02))]" />

          <div className="relative z-10 mx-auto max-w-6xl p-8 xl:p-10">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <Link
                href="/kasir"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                ← Kembali
              </Link>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${badgeColor(status)}`}>
                {status}
              </span>
            </div>

            <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[28px] bg-[rgba(152,163,223,0.15)] p-6 backdrop-blur-[2px]">
                <div className="mb-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">Rincian pesanan</p>
                  <h1 className="mt-3 text-4xl font-black tracking-[-0.06em] text-white">
                    #{order.nomor_antrian ?? order.id_pesanan}
                  </h1>
                </div>

                <div className="space-y-5 rounded-[22px] border border-white/15 bg-[rgba(255,255,255,0.08)] p-5 text-white">
                  <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
                    <span className="text-sm text-white/75">Pelanggan</span>
                    <div className="text-right">
                      <div className="text-base font-semibold text-white">
                        {order.pelanggan?.nama_pelanggan ?? "Walk-in"}
                      </div>
                      <div className="text-xs font-medium text-[#fef3c7]">Belum bayar</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
                    <span className="text-sm text-white/75">Nomor Pesanan</span>
                    <span className="text-base font-medium text-white">{order.id_pesanan}</span>
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm text-white/75">Daftar Produk</div>
                    {order.detail_pesanan.map((detail: OrderDetail) => (
                      <div
                        key={detail.id_detail}
                        className="flex items-center justify-between gap-3 rounded-[14px] border border-white/12 bg-white/5 px-3 py-3"
                      >
                        <div>
                          <div className="text-base font-semibold text-white">
                            {detail.menu?.nama_menu ?? "Menu"}
                          </div>
                          <div className="text-sm text-white/70">
                            {detail.kuantitas_produk ? `Qty x${detail.kuantitas_produk}` : "Qty 1"}
                          </div>
                        </div>
                        <div className="text-base font-semibold text-white">
                          {formatCurrency(detail.subtotal)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-2">
                    <span className="text-sm text-white/75">Total Tagihan</span>
                    <span className="text-3xl font-black tracking-[-0.06em] text-white">
                      {formatCurrency(order.total_tagihan)}
                    </span>
                  </div>
                </div>
              </div>

              <PaymentPanel order={order} />
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
