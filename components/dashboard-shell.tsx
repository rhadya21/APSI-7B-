"use client";

import Link from "next/link";
import { useState } from "react";

import { Prisma } from "@/app/generated/prisma/client";

const moneyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const menuItems = [
  { label: "Dashboard" },
  { label: "Pembayaran" },
  { label: "Bukti Pembayaran", active: true },
];

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
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function DashboardShell({
  role,
  userName,
  orders,
}: {
  role: string;
  userName?: string;
  orders: OrderWithRelations[];
}) {
  const normalizedRole = String(role ?? "").trim().toLowerCase();
  const proofPageHref = normalizedRole === "pemilik" ? "/pemilik" : "/kasir/bukti-pembayaran";
  const [selectedOrderId, setSelectedOrderId] = useState(orders[0]?.id_pesanan ?? "");
  const selectedOrder = orders.find((order) => order.id_pesanan === selectedOrderId) ?? orders[0] ?? null;

  const orderRows = orders.map((order) => {
    const itemNames = order.detail_pesanan
      .map((detail) => detail.menu?.nama_menu ?? "Menu")
      .slice(0, 2)
      .join(", ");

    return {
      id: order.nomor_antrian ? `OZ-${String(order.nomor_antrian).padStart(4, "0")}` : order.id_pesanan,
      title: itemNames || "Pesanan selesai",
      date: formatDate(order.tanggal),
      amount: formatCurrency(order.total_tagihan),
      status: "Sudah lunas",
      selected: selectedOrder?.id_pesanan === order.id_pesanan,
      orderId: order.id_pesanan,
    };
  });

  const selectedItems = (selectedOrder?.detail_pesanan ?? []).map((detail) => ({
    name: detail.menu?.nama_menu ?? "Menu",
    detail: detail.kuantitas_produk ? `Qty x${detail.kuantitas_produk}` : "Qty 1",
    price: formatCurrency(detail.subtotal),
  }));

  const handlePrint = () => {
    if (!selectedOrder || typeof window === "undefined") {
      return;
    }

    window.print();
  };

  return (
    <main className="min-h-screen bg-[#5869b5] text-[#1e2b4d] print:bg-white print:text-[#1e2b4d]">
      <div className="flex min-h-screen print:block">
        <aside className="print:hidden flex w-[220px] shrink-0 flex-col bg-[#4d5fae] px-4 pb-4 pt-5 text-white shadow-[inset_-1px_0_0_rgba(255,255,255,0.12)]">
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

            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.label === "Bukti Pembayaran" ? proofPageHref : "#"}
                aria-label={item.label}
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
              </Link>
            ))}
          </nav>

          <div className="mt-auto rounded-[18px] bg-white/8 p-3 text-white/90 backdrop-blur-sm">
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/60">Role</p>
            <p className="mt-2 text-sm font-semibold">{role}</p>
            <p className="mt-1 text-xs text-white/70">{userName ?? "Pengguna"}</p>
          </div>

          <Link
            href="/login"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/8 px-3 py-2 text-sm font-medium text-white/80 transition hover:bg-white/12 hover:text-white"
          >
            <span aria-hidden="true">↩</span>
            Keluar
          </Link>
        </aside>

        <div className="relative flex-1 overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.10),transparent_28%),linear-gradient(180deg,#6579d8_0%,#5c6fd2_22%,#5669c5_100%)] print:bg-white print:shadow-none">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.08),transparent_35%,rgba(255,255,255,0.02))] print:hidden" />

          <div className="relative z-10 flex h-full gap-8 p-8 xl:gap-10 xl:p-10 print:block print:p-0">
            <section className="print:hidden min-w-0 flex-1 rounded-[28px] bg-[rgba(152,163,223,0.15)] p-4 backdrop-blur-[2px] sm:p-6 xl:p-8">
              <div className="mb-6">
                <h1 className="text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl">
                  Pesanan Sudah Lunas
                </h1>
              </div>

              <div className="mb-5 text-lg font-semibold text-white/90">Pilih pesanan untuk mencetak bukti pembayaran</div>

              <div className="space-y-4">
                {orderRows.length === 0 ? (
                  <div className="rounded-[22px] border border-white/20 bg-[rgba(255,255,255,0.08)] p-6 text-white/80">
                    Belum ada pesanan yang sudah lunas.
                  </div>
                ) : (
                  orderRows.map((order) => (
                    <Link
                      key={order.id}
                      href={normalizedRole === "pemilik" ? `/pemilik/bukti-pembayaran/${order.orderId}` : `/kasir/bukti-pembayaran/${order.orderId}`}
                      onClick={() => setSelectedOrderId(order.orderId)}
                      className={[
                        "flex w-full items-center gap-4 rounded-[22px] border px-4 py-4 text-left shadow-[0_10px_26px_rgba(27,43,101,0.12)] transition sm:px-5",
                        order.selected
                          ? "border-white/70 bg-[rgba(255,255,255,0.18)]"
                          : "border-white/20 bg-[rgba(255,255,255,0.08)]",
                      ].join(" ")}
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-white/80 bg-white/10 text-base text-white">
                        {order.selected ? "•" : ""}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="text-2xl font-black tracking-[-0.06em] text-white">{order.id}</div>
                          <div className="text-2xl font-black tracking-[-0.06em] text-white">{order.amount}</div>
                        </div>

                        <div className="mt-2 text-base text-white/85">{order.title}</div>

                        <div className="mt-3 flex items-center justify-between gap-3">
                          <div className="text-sm text-white/70">{order.date}</div>
                          <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/85">
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </section>

            <aside className="w-full max-w-[360px] rounded-[24px] bg-[#f3f5fb] p-5 shadow-[0_18px_30px_rgba(31,42,103,0.18)] print:max-w-none print:w-full print:rounded-none print:bg-white print:p-0 print:shadow-none print:mx-auto">
              <div className="print:hidden mb-5 flex items-center justify-between gap-3">
                <h2 className="text-[1.7rem] font-black tracking-[-0.06em] text-[#2a355f]">Pesanan dipilih</h2>
                <span className="rounded-full bg-[#eef2ff] px-2.5 py-1 text-xs font-semibold text-[#46569e]">
                  {selectedOrder ? "1 pesanan" : "0 pesanan"}
                </span>
              </div>

              {selectedOrder ? (
                <>
                  <div className="space-y-4 border-b border-[#dfe6f8] pb-4 print:pb-2 print:border-[#e5e7eb]">
                    <div className="flex items-center justify-between gap-3 text-sm text-[#6672a3] print:text-[#374151]">
                      <span>Nomor pesanan</span>
                      <span className="font-semibold text-[#2d3b74] print:text-[#111827]">
                        {selectedOrder.nomor_antrian
                          ? `OZ-${String(selectedOrder.nomor_antrian).padStart(4, "0")}`
                          : selectedOrder.id_pesanan}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3 print:mt-4">
                    {selectedItems.length === 0 ? (
                      <div className="text-sm text-[#6471a3] print:text-[#374151]">Tidak ada detail pesanan.</div>
                    ) : (
                      selectedItems.map((item) => (
                        <div
                          key={`${item.name}-${item.detail}`}
                          className="flex items-center justify-between gap-3 border-b border-[#e6ebfb] pb-3 text-[#38496d] print:text-[#111827] print:border-[#e5e7eb]"
                        >
                          <div>
                            <div className="text-lg font-semibold print:text-lg">{item.name}</div>
                            <div className="text-sm text-[#6471a3] print:text-[#4b5563]">{item.detail}</div>
                          </div>
                          <div className="text-lg font-semibold text-[#2b335d] print:text-[#111827]">{item.price}</div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="mt-6 border-t border-[#e6ebfb] pt-4 print:mt-5 print:border-[#e5e7eb] print:pt-3">
                    <div className="flex items-center justify-between gap-3 text-sm text-[#6672a3] print:text-[#374151]">
                      <span>Total pembayaran</span>
                      <span className="text-[1.7rem] font-black tracking-[-0.06em] text-[#2b335d] print:text-[1.5rem] print:text-[#111827]">
                        {formatCurrency(selectedOrder.total_tagihan)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handlePrint}
                    className="mt-6 flex w-full cursor-pointer items-center justify-center rounded-[14px] bg-[#5d6ec8] px-4 py-3 text-base font-semibold text-white shadow-[0_12px_24px_rgba(88,105,181,0.28)] transition hover:bg-[#4d5fae] print:hidden"
                  >
                    Cetak Bukti Pembayaran
                  </button>
                </>
              ) : (
                <div className="rounded-[16px] border border-[#dfe6f8] bg-white/70 p-4 text-sm text-[#6471a3]">
                  Pilih salah satu pesanan yang sudah lunas untuk melihat detailnya.
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
