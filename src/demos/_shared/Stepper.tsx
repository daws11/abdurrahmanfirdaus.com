// src/demos/_shared/Stepper.tsx
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function Stepper({
  steps,
  current,
  onSelect,
}: {
  steps: { id: string; label: string; description?: string }[];
  current: string;
  onSelect?: (id: string) => void;
}) {
  const currentIdx = steps.findIndex((s) => s.id === current);
  return (
    <ol className="space-y-1">
      {steps.map((s, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        return (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => onSelect?.(s.id)}
              className={cn(
                "flex w-full items-start gap-3 rounded-md border px-3 py-2 text-left",
                active && "border-[var(--accent)]",
              )}
              style={{
                borderColor: active ? "var(--accent)" : "var(--border)",
                backgroundColor: active ? "var(--surface)" : "transparent",
              }}
            >
              <span
                className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold"
                style={{
                  backgroundColor: done
                    ? "var(--ok)"
                    : active
                      ? "var(--accent)"
                      : "transparent",
                  color: done || active ? "var(--accent-fg)" : "var(--muted)",
                  border: done || active ? "none" : "1px solid var(--border)",
                }}
              >
                {done ? <Check className="h-3 w-3" /> : i + 1}
              </span>
              <div className="min-w-0">
                <div className="text-sm font-medium" style={{ color: "var(--fg)" }}>
                  {s.label}
                </div>
                {s.description && (
                  <div className="text-xs" style={{ color: "var(--muted)" }}>
                    {s.description}
                  </div>
                )}
              </div>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
