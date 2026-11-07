import * as React from "react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  const variantClasses: Record<ButtonVariant, string> = {
    primary:
      "border border-white/35 bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] hover:bg-white/15",
    secondary:
      "border border-[#d9c3a7] bg-[#f8efe7] text-[#2d1f17] hover:bg-[#f2e5d6]",
    ghost:
      "border border-transparent bg-transparent text-white/80 hover:bg-white/5 hover:text-white",
  };

  const sizeClasses: Record<ButtonSize, string> = {
    sm: "h-10 px-4 text-sm",
    md: "h-[54px] px-5 text-base",
    lg: "h-[60px] px-6 text-lg",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold transition duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-white/60 disabled:cursor-not-allowed disabled:opacity-60",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
