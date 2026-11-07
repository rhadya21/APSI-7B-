import * as React from "react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export type CardProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-white/60 bg-white/5 shadow-[0_24px_70px_rgba(15,17,78,0.18)] backdrop-blur-sm",
        className,
      )}
      {...props}
    />
  );
}
