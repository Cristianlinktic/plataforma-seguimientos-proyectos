import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const BUTTON_VARIANTS = {
  primary: "bg-indigo text-paper hover:bg-indigo-ink disabled:bg-indigo/50",
  secondary:
    "bg-transparent text-ink border border-line-strong hover:bg-paper-dim disabled:text-ink-faint",
  ghost: "bg-transparent text-ink-soft hover:bg-paper-dim hover:text-ink",
  danger: "bg-danger text-paper hover:bg-danger/90 disabled:bg-danger/50",
} as const;

export const BUTTON_SIZES = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
} as const;

export function buttonClassName({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: keyof typeof BUTTON_VARIANTS;
  size?: keyof typeof BUTTON_SIZES;
  className?: string;
} = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:cursor-not-allowed",
    BUTTON_VARIANTS[variant],
    BUTTON_SIZES[size],
    className
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof BUTTON_VARIANTS;
  size?: keyof typeof BUTTON_SIZES;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", ...props },
  ref
) {
  return <button ref={ref} className={buttonClassName({ variant, size, className })} {...props} />;
});
