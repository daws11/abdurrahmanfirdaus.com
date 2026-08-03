// src/demos/_shared/Badge.tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Back-compat: existing screens use Tone names "emerald", "amber", "red",
// "blue", "violet" plus the canonical "ok"/"warn"/"bad" aliases.
type Tone = "neutral" | "ok" | "warn" | "bad" | "info" | "accent" | "emerald" | "amber" | "red" | "blue" | "violet";

const toneClass: Record<Tone, string> = {
  neutral: "border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)]",
  ok: "border border-emerald-400/40 bg-emerald-400/10 text-emerald-700 dark:text-emerald-300",
  warn: "border border-amber-400/40 bg-amber-400/10 text-amber-700 dark:text-amber-300",
  bad: "border border-red-400/40 bg-red-400/10 text-red-700 dark:text-red-300",
  info: "border border-blue-400/40 bg-blue-400/10 text-blue-700 dark:text-blue-300",
  accent: "border border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]",
  emerald: "border border-emerald-400/30 bg-emerald-400/5 text-emerald-400",
  amber: "border border-amber-400/30 bg-amber-400/5 text-amber-400",
  red: "border border-red-400/30 bg-red-400/5 text-red-400",
  blue: "border border-blue-400/30 bg-blue-400/5 text-blue-400",
  violet: "border border-violet-400/30 bg-violet-400/5 text-violet-400",
};

export function Badge({
  tone = "neutral",
  children,
  className,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider",
        toneClass[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

// Back-compat alias for the previous primitive name.
export function Tag(props: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return <Badge {...props} />;
}
