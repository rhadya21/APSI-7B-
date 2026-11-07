import * as React from "react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "h-[58px] w-full rounded-full border border-white/30 bg-white/10 px-4 text-sm text-white placeholder:text-white/65 outline-none transition duration-200 ease-out focus:border-white/60 focus:bg-white/15 focus:shadow-[0_0_0_3px_rgba(255,255,255,0.12)] disabled:cursor-not-allowed disabled:opacity-70",
        className,
      )}
      {...props}
    />
  );
}
