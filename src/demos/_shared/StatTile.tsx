// src/demos/_shared/StatTile.tsx
import type { ReactNode } from "react";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "ok" | "warn" | "bad" | "info" | "accent" | "emerald" | "amber" | "red" | "blue" | "violet";

const toneClass: Record<Tone, string> = {
  neutral: "text-[var(--fg)]",
  ok: "text-emerald-500 dark:text-emerald-400",
  warn: "text-amber-500 dark:text-amber-400",
  bad: "text-red-500 dark:text-red-400",
  info: "text-blue-500 dark:text-blue-400",
  accent: "text-[var(--accent)]",
  emerald: "text-emerald-400",
  amber: "text-amber-400",
  red: "text-red-400",
  blue: "text-blue-400",
  violet: "text-violet-400",
};

export function StatTile({
  label,
  value,
  detail,
  tone = "neutral",
  icon,
  delta,
  deltaLabel,
  className,
}: {
  label: string;
  value: ReactNode;
  detail?: string;
  tone?: Tone;
  icon?: ReactNode;
  /** Optional delta indicator; if provided, renders an inline pill. */
  delta?: number;
  deltaLabel?: string;
  className?: string;
}) {
  const positive = delta !== undefined && delta > 0;
  const negative = delta !== undefined && delta < 0;
  const flat = delta === 0;

  return (
    <div
      className={cn("rounded-md border p-3", className)}
      style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
    >
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-medium uppercase tracking-widest" style={{ color: "var(--muted)" }}>
          {label}
        </div>
        {icon && <div style={{ color: "var(--muted)" }}>{icon}</div>}
      </div>
      <div className={cn("mt-2 text-xl font-semibold tabular-nums", toneClass[tone])}>
        {value}
      </div>
      <div className="mt-1 flex items-center gap-2 text-[11px]" style={{ color: "var(--muted)" }}>
        {delta !== undefined && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-[10px] font-medium",
              positive && "border-emerald-400/30 bg-emerald-400/5 text-emerald-400",
              negative && "border-red-400/30 bg-red-400/5 text-red-400",
              flat && "border-[var(--border)] text-[var(--muted)]",
            )}
          >
            {positive && <ArrowUp className="h-3 w-3" />}
            {negative && <ArrowDown className="h-3 w-3" />}
            {flat && <Minus className="h-3 w-3" />}
            {delta > 0 ? `+${delta}` : delta}
            {deltaLabel ? `%` : ""}
          </span>
        )}
        {detail && <span className="truncate">{detail}</span>}
      </div>
    </div>
  );
}
