// src/demos/_shared/KanbanColumn.tsx
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function KanbanColumn({
  title,
  count,
  tone = "neutral",
  children,
}: {
  title: string;
  count?: number;
  tone?: "neutral" | "ok" | "warn" | "accent";
  children: ReactNode;
}) {
  const toneStyle: Record<string, CSSProperties> = {
    neutral: { borderColor: "var(--border)" },
    ok: { borderColor: "var(--ok)" },
    warn: { borderColor: "var(--warn)" },
    accent: { borderColor: "var(--accent)" },
  };
  return (
    <div
      className="flex flex-col rounded-md border"
      style={{ ...toneStyle[tone], backgroundColor: "var(--surface)" }}
    >
      <header className="flex items-center justify-between px-3 py-2">
        <span
          className="text-[11px] font-semibold uppercase tracking-widest"
          style={{ color: "var(--fg)" }}
        >
          {title}
        </span>
        {typeof count === "number" && (
          <span className="text-xs tabular-nums" style={{ color: "var(--muted)" }}>
            {count}
          </span>
        )}
      </header>
      <div className={cn("flex flex-col gap-2 px-2 pb-2")}>{children}</div>
    </div>
  );
}
