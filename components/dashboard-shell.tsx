'use client';

const menuItems = [
  { label: 'Dashboard', active: true },
  { label: 'Pembayaran' },
  { label: 'Bukti Pembayaran' },
];

const orderRows = [
  {
    id: 'OZ-0128',
    title: 'Kopi Susu Oz Large, Chocolate Oz, Americano x2',
    date: 'Rabu, 28 Okt 2026 • 14:32',
    amount: 'Rp 47.000',
    status: 'Belum lunas',
    selected: true,
  },
  {
    id: 'OZ-0125',
    title: 'Kopi Susu Strong, Butterscotch',
    date: 'Rabu, 28 Okt 2026 • 11:05',
    amount: 'Rp 31.000',
    status: 'Belum lunas',
    selected: false,
  },
  {
    id: 'OZ-0121',
    title: 'Green Tea Oz x2',
    date: 'Selasa, 27 Okt 2026 • 16:40',
    amount: 'Rp 20.000',
    status: 'Belum lunas',
    selected: false,
  },
  {
    id: 'OZ-0118',
    title: 'Kopi Susu Caramel',
    date: 'Selasa, 27 Okt 2026 • 09:15',
    amount: 'Rp 15.000',
    status: 'Belum lunas',
    selected: false,
  },
];

const selectedItems = [
  { name: 'Kopi Susu Oz Large', detail: 'Toping Oreo • x1', price: 'Rp 18.000' },
  { name: 'Chocolate Oz', detail: 'Toping Boba • x1', price: 'Rp 13.000' },
  { name: 'Americano', detail: 'Tampa topping • x2', price: 'Rp 16.000' },
];

export function DashboardShell({ role, userName }: { role: string; userName?: string }) {
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

            {menuItems.map((item) => (
              <button
                key={item.label}
                type="button"
                className={[
                  'flex w-full items-center gap-3 rounded-full px-3 py-2.5 text-left text-sm font-medium transition-colors',
                  item.active
                    ? 'bg-white/15 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]'
                    : 'text-white/75 hover:bg-white/6 hover:text-white',
                ].join(' ')}
              >
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-sm border border-white/40 text-[9px] opacity-80">
                  {item.active ? '•' : ''}
                </span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-auto rounded-[18px] bg-white/8 p-3 text-white/90 backdrop-blur-sm">
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/60">Role</p>
            <p className="mt-2 text-sm font-semibold">{role}</p>
            <p className="mt-1 text-xs text-white/70">{userName ?? 'Pengguna'}</p>
          </div>

          <form action="/logout" method="post" className="mt-3">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/8 px-3 py-2 text-sm font-medium text-white/80 transition hover:bg-white/12 hover:text-white"
            >
              <span aria-hidden="true">↩</span>
              Keluar
            </button>
          </form>
        </aside>

        <div className="relative flex-1 overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.10),transparent_28%),linear-gradient(180deg,#6579d8_0%,#5c6fd2_22%,#5669c5_100%)]">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.08),transparent_35%,rgba(255,255,255,0.02))]" />

          <div className="relative z-10 flex h-full gap-8 p-8 xl:gap-10 xl:p-10">
            <section className="flex-1 min-w-0 rounded-[28px] bg-[rgba(152,163,223,0.15)] p-4 backdrop-blur-[2px] sm:p-6 xl:p-8">
              <div className="mb-6">
                <h1 className="text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl">
                  Pesanan Belum Lunas
                </h1>
                <p className="mt-2 text-base font-medium text-white/80">
                  Pesanan Pelanggan Yang Belum Membayar
                </p>
              </div>

              <div className="mb-5 text-lg font-semibold text-white/90">
                Pilih pesanan yang akan dibayar
              </div>

              <div className="space-y-4">
                {orderRows.map((order) => (
                  <button
                    key={order.id}
                    type="button"
                    className={[
                      'flex w-full items-center gap-4 rounded-[22px] border px-4 py-4 text-left shadow-[0_10px_26px_rgba(27,43,101,0.12)] transition sm:px-5',
                      order.selected
                        ? 'border-white/70 bg-[rgba(255,255,255,0.18)]'
                        : 'border-white/20 bg-[rgba(255,255,255,0.08)]',
                    ].join(' ')}
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-white/80 bg-white/10 text-base text-white">
                      {order.selected ? '✓' : ''}
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
                  </button>
                ))}
              </div>
            </section>

            <aside className="w-full max-w-[360px] rounded-[26px] bg-[#f3f5fb] p-5 shadow-[0_18px_30px_rgba(31,42,103,0.18)]">
              <div className="mb-5 flex items-center justify-between gap-3">
                <h2 className="text-[1.9rem] font-black tracking-[-0.06em] text-[#2a355f]">
                  Pesanan dipilih
                </h2>
                <span className="rounded-full bg-[#eef2ff] px-2.5 py-1 text-xs font-semibold text-[#46569e]">
                  3 pesanan
                </span>
              </div>

              <div className="space-y-4 border-b border-[#dfe6f8] pb-4">
                <div className="text-sm text-[#6672a3]">Nomor pesanan</div>
                <div className="text-right text-sm font-semibold text-[#2d3b74]">OZ-0128</div>
              </div>

              <div className="mt-5 space-y-3">
                {selectedItems.map((item) => (
                  <div key={item.name} className="flex items-center justify-between gap-3 border-b border-[#e6ebfb] pb-3 text-[#38496d]">
                    <div>
                      <div className="text-lg font-semibold">{item.name}</div>
                      <div className="text-sm text-[#6471a3]">{item.detail}</div>
                    </div>
                    <div className="text-lg font-semibold text-[#2b335d]">{item.price}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-sm text-[#6774a4]">Total pembayaran</div>
              <div className="mt-2 text-4xl font-black tracking-[-0.06em] text-[#23305e]">Rp 47.000</div>

              <button
                type="button"
                className="mt-6 flex h-[52px] w-full items-center justify-center rounded-[16px] bg-[#5869b5] text-base font-semibold text-white shadow-[0_12px_24px_rgba(88,105,181,0.28)] transition hover:bg-[#4a5ca9]"
              >
                Rincian Pesanan
              </button>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
