import { forwardRef } from "react";
import type { InputHTMLAttributes, LabelHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft", className)}
      {...props}
    />
  );
}

const fieldBase =
  "w-full rounded-md border border-line-strong bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-indigo focus:outline-none focus:ring-2 focus:ring-indigo/20 disabled:bg-paper-dim disabled:text-ink-faint";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return <input ref={ref} className={cn(fieldBase, className)} {...props} />;
  }
);

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, ...props }, ref) {
    return <textarea ref={ref} className={cn(fieldBase, "min-h-20 resize-y", className)} {...props} />;
  }
);

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, ...props }, ref) {
    return <select ref={ref} className={cn(fieldBase, "appearance-none bg-[right_0.6rem_center] bg-no-repeat pr-8", className)} {...props} />;
  }
);

export function FieldError({ children }: { children?: string | string[] }) {
  if (!children || (Array.isArray(children) && children.length === 0)) return null;
  const messages = Array.isArray(children) ? children : [children];
  return (
    <p className="mt-1 text-xs text-danger">
      {messages.join(" ")}
    </p>
  );
}
