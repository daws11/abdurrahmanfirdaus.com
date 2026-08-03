// src/demos/_shared/TopBar.tsx
import { ArrowLeft, CircleAlert } from "lucide-react";
import type { ReactNode } from "react";
import type { DemoTheme } from "./theme";
import { Brand } from "./Brand";

export function TopBar({
  theme,
  rightSlot,
}: {
  theme: DemoTheme;
  rightSlot?: ReactNode;
}) {
  return (
    <header
      className="flex items-center gap-3 border-b px-4"
      style={{
        height: theme.shell.topBarHeight,
        borderColor: "var(--border)",
        backgroundColor: "var(--bg)",
      }}
    >
      <a
        href="/"
        className="flex items-center gap-2 text-xs uppercase tracking-widest opacity-60 hover:opacity-100"
        style={{ color: "var(--muted)" }}
      >
        <ArrowLeft className="h-4 w-4" />
        Portfolio
      </a>
      <div className="ml-3 flex h-6 w-px bg-[var(--border)]" />
      <Brand theme={theme} size="md" />
      <span
        className="rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--surface)",
          color: "var(--muted)",
        }}
      >
        UI prototype
      </span>
      <div className="ml-auto flex items-center gap-3 text-xs" style={{ color: "var(--muted)" }}>
        {rightSlot ?? (
          <span className="flex items-center gap-1.5">
            <CircleAlert className="h-3.5 w-3.5" />
            Synthetic data · no backend
          </span>
        )}
      </div>
    </header>
  );
}
