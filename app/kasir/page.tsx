import Link from "next/link";

import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

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

export default async function KasirPage(props: {
  searchParams?: Promise<Record<string, string | string[] | undefined>> | Record<string, string | string[] | undefined>;
}) {
  const resolvedSearchParams = props.searchParams ? await Promise.resolve(props.searchParams) : {};
  const requestedOrderId =
    typeof resolvedSearchParams.order === "string"
      ? resolvedSearchParams.order
      : Array.isArray(resolvedSearchParams.order)
        ? resolvedSearchParams.order[0]
        : undefined;

  let orders: OrderWithRelations[] = [];

  try {
    orders = await prisma.pesanan.findMany({
      where: {
        status_pesanan: {
          notIn: ["Selesai", "Batal"],
        },
      },
      orderBy: [{ nomor_antrian: "asc" }, { tanggal: "desc" }],
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

  const selectedOrder =
    orders.find((order) => order.id_pesanan === requestedOrderId) ?? orders[0] ?? null;

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
              <a
                key={item.label}
                href={item.href}
                className={[
                  "flex w-full cursor-pointer items-center gap-3 rounded-full px-3 py-2.5 text-left text-sm font-medium transition-colors",
                  item.active
                    ? "bg-white/15 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                    : "text-white/75 hover:bg-white/6 hover:text-white",
                ].join(" ")}
              >
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-sm border border-white/40 text-[9px] opacity-80">
                  {item.active ? "•" : ""}
                </span>
                <span>{item.label}</span>
              </a>
            ))}
          </nav>

          <div className="mt-auto rounded-[18px] bg-white/8 p-3 text-white/90 backdrop-blur-sm">
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/60">Role</p>
            <p className="mt-2 text-sm font-semibold">Kasir</p>
            <p className="mt-1 text-xs text-white/70">Rahma</p>
          </div>

          <a
            href="/login"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/8 px-3 py-2 text-sm font-medium text-white/80 transition hover:bg-white/12 hover:text-white"
          >
            <span aria-hidden="true">↩</span>
            Keluar
          </a>
        </aside>

        <div className="relative flex-1 overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.10),transparent_28%),linear-gradient(180deg,#6579d8_0%,#5c6fd2_22%,#5669c5_100%)]">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.08),transparent_35%,rgba(255,255,255,0.02))]" />

          <div className="relative z-10 flex h-full gap-8 p-8 xl:gap-10 xl:p-10">
            <section className="min-w-0 flex-1 rounded-[28px] bg-[rgba(152,163,223,0.15)] p-4 backdrop-blur-[2px] sm:p-6 xl:p-8">
              <div className="mb-6">
                <h1 className="text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl">
                  Pesanan Belum Lunas
                </h1>
                <p className="mt-2 text-base font-medium text-white/80">
                  Pesanan Pelanggan Yang Belum Membayar
                </p>
              </div>

              <div className="mb-5 text-lg font-semibold text-white/90">Pilih pesanan yang akan dibayar</div>

              {(resolvedSearchParams.error || resolvedSearchParams.success) && (
                <div
                  className={[
                    "mb-4 rounded-[18px] border px-4 py-3 text-sm font-medium",
                    resolvedSearchParams.error
                      ? "border-red-200 bg-red-100/90 text-red-700"
                      : "border-emerald-200 bg-emerald-100/90 text-emerald-700",
                  ].join(" ")}
                >
                  {resolvedSearchParams.error === "missing_order" && "Pesanan belum dipilih."}
                  {resolvedSearchParams.error === "invalid_payment_method" && "Metode pembayaran tidak valid."}
                  {resolvedSearchParams.error === "order_not_found" && "Pesanan tidak ditemukan."}
                  {resolvedSearchParams.error === "payment_amount_mismatch" && "Jumlah pembayaran harus sama dengan total tagihan pesanan."}
                  {resolvedSearchParams.error === "order_already_paid" && "Pesanan ini sudah dibayar sebelumnya."}
                  {resolvedSearchParams.success === "payment_created" && "Pembayaran berhasil disimpan dan transaksi otomatis dibuat."}
                </div>
              )}

              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="rounded-[22px] border border-white/20 bg-[rgba(255,255,255,0.08)] p-6 text-white/80">
                    Belum ada data pesanan.
                  </div>
                ) : (
                  orders.map((order) => {
                    const status = normalizeStatus(order.status_pesanan);
                    const itemNames = order.detail_pesanan
                      .map((detail: OrderDetail) => detail.menu?.nama_menu ?? null)
                      .filter(Boolean)
                      .slice(0, 2);

                    const title = itemNames.length > 0 ? itemNames.join(", ") : "Pesanan baru";

                    return (
                      <a
                        key={order.id_pesanan}
                        href={`?order=${encodeURIComponent(order.id_pesanan)}`}
                        className={[
                          "flex w-full items-center gap-4 rounded-[22px] border px-4 py-4 text-left shadow-[0_10px_26px_rgba(27,43,101,0.12)] transition sm:px-5",
                          selectedOrder?.id_pesanan === order.id_pesanan
                            ? "border-white/70 bg-[rgba(255,255,255,0.18)]"
                            : "border-white/20 bg-[rgba(255,255,255,0.08)]",
                        ].join(" ")}
                      >
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-white/80 bg-white/10 text-base text-white">
                          {selectedOrder?.id_pesanan === order.id_pesanan ? "✓" : ""}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="text-2xl font-black tracking-[-0.06em] text-white">
                              #{order.nomor_antrian ?? order.id_pesanan}
                            </div>
                            <div className="text-2xl font-black tracking-[-0.06em] text-white">
                              {formatCurrency(order.total_tagihan)}
                            </div>
                          </div>

                          <div className="mt-2 text-base text-white/85">{title}</div>

                          <div className="mt-3 flex items-center justify-between gap-3">
                            <div className="text-sm text-white/70">{order.pelanggan?.nama_pelanggan ?? "Walk-in"}</div>
                            <span className={`rounded-full px-3 py-1 text-xs font-medium ${badgeColor(status)}`}>
                              {status}
                            </span>
                          </div>
                        </div>
                      </a>
                    );
                  })
                )}
              </div>
            </section>

            <aside className="w-full max-w-[360px] rounded-[26px] bg-[#f3f5fb] p-5 shadow-[0_18px_30px_rgba(31,42,103,0.18)]">
              {selectedOrder ? (
                <>
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <h2 className="text-[1.9rem] font-black tracking-[-0.06em] text-[#2a355f]">
                      Pesanan dipilih
                    </h2>
                    <span className="rounded-full bg-[#eef2ff] px-2.5 py-1 text-xs font-semibold text-[#46569e]">
                      {selectedOrder.detail_pesanan.length} item
                    </span>
                  </div>

                  <div className="space-y-4 border-b border-[#dfe6f8] pb-4">
                    <div className="text-sm text-[#6672a3]">Nomor pesanan</div>
                    <div className="text-right text-sm font-semibold text-[#2d3b74]">
                      {selectedOrder.id_pesanan}
                    </div>
                    <div className="text-right text-sm text-[#5f709d]">
                      {selectedOrder.pelanggan?.nama_pelanggan ?? "Walk-in"}
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    {selectedOrder.detail_pesanan.map((detail: OrderDetail) => (
                      <div
                        key={detail.id_detail}
                        className="flex items-center justify-between gap-3 border-b border-[#e6ebfb] pb-3 text-[#38496d]"
                      >
                        <div>
                          <div className="text-lg font-semibold">{detail.menu?.nama_menu ?? "Menu"}</div>
                          <div className="text-sm text-[#6471a3]">
                            {detail.kuantitas_produk ? `Qty x${detail.kuantitas_produk}` : "Qty 1"}
                          </div>
                        </div>
                        <div className="text-lg font-semibold text-[#2b335d]">
                          {formatCurrency(detail.subtotal)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 text-sm text-[#6774a4]">Total pembayaran</div>
                  <div className="mt-2 text-4xl font-black tracking-[-0.06em] text-[#23305e]">
                    {formatCurrency(selectedOrder.total_tagihan)}
                  </div>

                  <Link
                    href={`/kasir/${selectedOrder.id_pesanan}`}
                    className="mt-6 flex h-[52px] w-full items-center justify-center rounded-[16px] bg-[#5869b5] text-base font-semibold text-white shadow-[0_12px_24px_rgba(88,105,181,0.28)] transition hover:bg-[#4a5ca9]"
                  >
                    Rincian Pesanan
                  </Link>
                </>
              ) : (
                <div className="flex h-full items-center justify-center text-[#5b6fb7]">
                  Tidak ada pesanan dipilih
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
