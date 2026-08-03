// src/demos/_shared/Field.tsx
import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export const Field = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    hint?: string;
    error?: string;
    trailing?: ReactNode;
  }
>(({ label, hint, error, trailing, className, style, ...props }, ref) => {
  return (
    <label className="block">
      {label && (
        <div className="mb-1 text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>
          {label}
        </div>
      )}
      <div className="relative">
        <input
          ref={ref}
          className={cn(
            "w-full rounded-sm border bg-transparent px-3 py-1.5 text-sm focus:outline-none focus:ring-1",
            className,
          )}
          style={{
            height: 36,
            borderColor: error ? "var(--bad)" : "var(--border)",
            color: "var(--fg)",
            ...style,
          }}
          {...props}
        />
        {trailing && (
          <div
            className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-xs"
            style={{ color: "var(--muted)" }}
          >
            {trailing}
          </div>
        )}
      </div>
      {(hint || error) && (
        <div
          className="mt-1 text-xs"
          style={{ color: error ? "var(--bad)" : "var(--muted)" }}
        >
          {error || hint}
        </div>
      )}
    </label>
  );
});
Field.displayName = "Field";
