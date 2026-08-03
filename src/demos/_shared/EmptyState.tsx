// src/demos/_shared/EmptyState.tsx
import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-md border border-dashed py-12 text-center"
      style={{ borderColor: "var(--border)", color: "var(--muted)" }}
    >
      {icon && <div className="mb-3 opacity-60">{icon}</div>}
      <h3 className="text-sm font-medium" style={{ color: "var(--fg)" }}>
        {title}
      </h3>
      {description && <p className="mt-1 max-w-sm text-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
