"use client";

export function PrintReceiptButton({ label = "Cetak Bukti Pembayaran" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="mt-6 flex h-[52px] w-full items-center justify-center rounded-[16px] bg-white text-base font-semibold text-[#4759aa] shadow-[0_12px_24px_rgba(255,255,255,0.12)] transition hover:bg-[#edf2ff]"
    >
      {label}
    </button>
  );
}
