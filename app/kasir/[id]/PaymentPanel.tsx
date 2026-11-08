"use client";

import Image from "next/image";
import { useState } from "react";

import { bayarPesananAction } from "../actions";

const paymentMethods = [
  { value: "QRIS", label: "QRIS", icon: "◉" },
  { value: "Tunai ke Kasir", label: "Tunai ke Kasir", icon: "◌" },
  { value: "Kartu Debit", label: "Kartu Debit", icon: "◍" },
  { value: "Transfer Bank", label: "Transfer Bank", icon: "◈" },
] as const;

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

type PaymentPanelProps = {
  order: {
    id_pesanan: string;
    total_tagihan: unknown;
  };
};

function buildQrDataUrl() {
  const size = 29;
  const cellSize = 8;
  const padding = 8;

  const matrix = Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, col) => {
      const finder =
        (row < 7 && col < 7) ||
        (row < 7 && col >= size - 7) ||
        (row >= size - 7 && col < 7);

      if (finder) {
        const isBorder = row === 0 || col === 0 || row === 6 || col === 6;
        const isInner = row > 0 && row < 6 && col > 0 && col < 6;
        const isCorner = (row >= 2 && row <= 4 && col >= 2 && col <= 4) ||
          (row >= 2 && row <= 4 && col >= size - 6 && col <= size - 3) ||
          (row >= size - 6 && row <= size - 3 && col >= 2 && col <= 4);

        return isBorder || (isInner && ((row + col) % 2 === 0)) || isCorner ? 1 : 0;
      }

      return ((row * 7 + col * 11 + row * col) % 5 === 0 || (row + col) % 9 === 0) ? 1 : 0;
    }),
  );

  const rects = matrix.flatMap((row, y) =>
    row.flatMap((cell, x) => {
      if (!cell) return [];
      const xPos = padding + x * cellSize;
      const yPos = padding + y * cellSize;
      return `<rect x="${xPos}" y="${yPos}" width="${cellSize - 1}" height="${cellSize - 1}" rx="1" fill="#111827" />`;
    }),
  );

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">
      <rect width="240" height="240" fill="#ffffff"/>
      <g>${rects.join("")}</g>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function PaymentPanel({ order }: PaymentPanelProps) {
  const [selectedMethod, setSelectedMethod] = useState<(typeof paymentMethods)[number]["value"]>("QRIS");
  const [copied, setCopied] = useState(false);
  const qrImage = buildQrDataUrl();

  return (
    <div className="rounded-[28px] bg-[#f3f5fb] p-6 shadow-[0_18px_30px_rgba(31,42,103,0.18)]">
      <h2 className="text-[1.8rem] font-black tracking-[-0.06em] text-[#2a355f]">Pembayaran</h2>

      <form action={bayarPesananAction} className="mt-6 space-y-5">
        <input type="hidden" name="id_pesanan" value={order.id_pesanan} />
        <input type="hidden" name="jumlah_bayar" value={Number(order.total_tagihan ?? 0)} />

        <div className="space-y-3">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[#586ca8]">
            Pilih metode pembayaran
          </div>

          {paymentMethods.map((method) => (
            <label
              key={method.value}
              className="flex cursor-pointer items-center justify-between rounded-[16px] border border-[#dfe6f8] bg-white px-4 py-3 text-[#2f3c74] shadow-[0_10px_18px_rgba(90,107,178,0.06)] transition hover:border-[#a7b5eb]"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#8ea0d8] bg-[#eef2ff] text-xs font-bold text-[#46569e]">
                  {method.icon}
                </span>
                <span className="text-base font-semibold">{method.label}</span>
              </div>
              <input
                type="radio"
                name="metode"
                value={method.value}
                checked={selectedMethod === method.value}
                onChange={() => setSelectedMethod(method.value)}
                className="h-4 w-4 accent-[#5869b5]"
              />
            </label>
          ))}
        </div>

        <div className="rounded-[18px] border border-[#dfe6f8] bg-white p-4">
          <div className="text-sm text-[#6672a3]">Metode yang dipilih</div>
          <div className="mt-2 text-lg font-bold text-[#23305e]">{selectedMethod}</div>
        </div>

        {selectedMethod === "QRIS" && (
          <div className="rounded-[22px] border border-[#dfe7ff] bg-[linear-gradient(180deg,#f9faff_0%,#edf3ff_100%)] p-4 shadow-[0_14px_28px_rgba(90,104,174,0.08)]">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5d6db2]">QRIS</div>
              <div className="rounded-full border border-[#dfe6f8] bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#5d6db2]">
                Scan & Bayar
              </div>
            </div>

            <div className="rounded-[22px] border border-[#dce6ff] bg-white p-3 shadow-[inset_0_0_0_1px_rgba(96,120,210,0.03)]">
              <div className="flex items-center justify-center rounded-[18px] bg-[linear-gradient(135deg,#ffffff_0%,#f6f8ff_100%)] p-4">
                <div className="rounded-[18px] border border-[#dfe7ff] bg-white p-2 shadow-[0_8px_16px_rgba(87,102,177,0.08)]">
                  <Image
                    src={qrImage}
                    alt="Kode QRIS pembayaran"
                    width={160}
                    height={160}
                    unoptimized
                    className="h-40 w-40 rounded-[14px] object-contain"
                  />
                </div>
              </div>
            </div>

            <p className="mt-3 text-center text-sm leading-6 text-[#58698d]">
              Scan QR code di atas untuk membayar melalui aplikasi dompet digital Anda.
            </p>
          </div>
        )}

        {selectedMethod === "Transfer Bank" && (
          <div className="rounded-[18px] border border-[#e7ebf8] bg-[#f8f9ff] p-4">
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#5d6db2]">
              Transfer Bank
            </div>
            <div className="rounded-[14px] bg-white p-3 shadow-sm">
              <div className="flex items-center justify-between gap-3 text-sm text-[#55679d]">
                <span>Bank BCA</span>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText("1234567890");
                      setCopied(true);
                      window.setTimeout(() => setCopied(false), 1500);
                    } catch {
                      setCopied(false);
                    }
                  }}
                  className="rounded-full border border-[#dfe6f8] bg-[#f4f6ff] px-2.5 py-1 text-xs font-semibold text-[#46569e]"
                >
                  {copied ? "Tersalin" : "Salin"}
                </button>
              </div>
              <div className="mt-2 text-lg font-black tracking-[0.14em] text-[#23305e]">1234567890</div>
              <div className="mt-1 text-sm text-[#5f6ea3]">a.n. Kopi OZ</div>
            </div>
          </div>
        )}

        {selectedMethod === "Kartu Debit" && (
          <div className="rounded-[18px] border border-[#e7ebf8] bg-[#f8f9ff] p-4">
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#5d6db2]">
              Kartu Debit
            </div>
            <div className="rounded-[18px] border border-[#dde6ff] bg-gradient-to-r from-[#5d6dc8] via-[#6678d4] to-[#7a87d9] p-4 text-white shadow-[0_16px_28px_rgba(87,102,177,0.25)]">
              <div className="flex items-start justify-between">
                <div className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">Debit</div>
                <div className="text-2xl font-black">◊</div>
              </div>
              <div className="mt-8 text-lg font-semibold tracking-[0.22em]">**** 1234</div>
              <div className="mt-4 text-xs text-white/80">Kartu debit / EDC</div>
            </div>
            <p className="mt-3 text-sm text-[#58698d]">
              Masukkan kartu pada mesin EDC, pilih transaksi, lalu ikuti instruksi pembayaran.
            </p>
          </div>
        )}

        {selectedMethod === "Tunai ke Kasir" && (
          <div className="rounded-[18px] border border-[#e7ebf8] bg-[#f8f9ff] p-4">
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#5d6db2]">
              Tunai ke Kasir
            </div>
            <div className="space-y-2 text-sm text-[#566b98]">
              {[
                "1. Datang ke kasir untuk konfirmasi pesanan.",
                "2. Sampaikan nominal pembayaran yang sesuai total tagihan.",
                "3. Kasir menghitung kembalian bila ada.",
                "4. Terima struk dan pastikan status pembayaran sudah lunas.",
              ].map((step, index) => (
                <div key={step} className="flex gap-3 rounded-[12px] bg-white px-3 py-2">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#eaf0ff] text-xs font-black text-[#46569e]">
                    {index + 1}
                  </div>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-[#dfe6f8] pt-4">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[#586ca8]">
            Total pembayaran
          </div>
          <div className="mt-2 text-4xl font-black tracking-[-0.06em] text-[#23305e]">
            {formatCurrency(order.total_tagihan)}
          </div>
        </div>

        <button
          type="submit"
          className="flex h-[52px] w-full items-center justify-center rounded-[16px] bg-[#5869b5] text-base font-semibold text-white shadow-[0_12px_24px_rgba(88,105,181,0.28)] transition hover:bg-[#4a5ca9]"
        >
          Pembayaran Diterima
        </button>
      </form>
    </div>
  );
}
