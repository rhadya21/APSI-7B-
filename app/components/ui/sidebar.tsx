import * as React from "react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  items?: Array<{ label: string; active?: boolean; icon?: React.ReactNode }>;
}

export function Sidebar({
  title = "Kopi OZ",
  items = [
    { label: "Dashboard", active: true },
    { label: "Pesanan" },
    { label: "Menu" },
    { label: "Stok" },
    { label: "Laporan" },
  ],
  className,
  ...props
}: SidebarProps) {
  return (
    <aside
      className={cn(
        "flex w-[240px] flex-col rounded-[24px] border border-[#e9dccb] bg-[#f9f4ef] p-5 text-[#261d17] shadow-sm",
        className,
      )}
      {...props}
    >
      <div className="mb-8 text-2xl font-black tracking-[-0.08em] text-[#1d1a16]">
        {title}
      </div>

      <nav className="space-y-2">
        {items.map((item) => (
          <button
            key={item.label}
            type="button"
            className={cn(
              "flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm font-medium transition",
              item.active
                ? "bg-[#5b6fb7] text-white shadow-[0_8px_20px_rgba(91,111,183,0.22)]"
                : "text-[#453d37] hover:bg-white hover:text-[#241c17]",
            )}
          >
            {item.icon}
            <span className={cn(item.icon ? "ml-2" : "")}>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
