// src/demos/_shared/TopBar.tsx
//
// Demo-aware top bar. The PeopleOS (people-culture) theme renders a glass
// 56px header with `bg-white/90 backdrop-blur-md` over the slate-50 page
// background, which matches the production app. Other demos stay on a
// solid `var(--bg)` surface and may show the "UI prototype" badge.

import { ArrowLeft } from "lucide-react";
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
  const isPeopleCulture = theme.id === "people-culture";
  return (
    <header
      className="flex items-center gap-3 border-b px-4"
      style={{
        height: theme.shell.topBarHeight,
        borderColor: "var(--border)",
        backgroundColor: isPeopleCulture ? "rgba(255,255,255,0.9)" : "var(--bg)",
        backdropFilter: isPeopleCulture ? "blur(8px)" : undefined,
        WebkitBackdropFilter: isPeopleCulture ? "blur(8px)" : undefined,
        position: isPeopleCulture ? "sticky" : undefined,
        top: 0,
        zIndex: isPeopleCulture ? 10 : undefined,
      }}
    >
      <a
        href="/"
        className="flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-wider opacity-60 hover:opacity-100"
        style={{ color: "var(--muted)" }}
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Portfolio
      </a>
      <div className="ml-1 flex h-5 w-px bg-[var(--border)]" />
      <Brand theme={theme} size="sm" />
      {!isPeopleCulture && (
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
      )}
      <div className="ml-auto flex items-center gap-3 text-xs" style={{ color: "var(--muted)" }}>
        {rightSlot}
      </div>
    </header>
  );
}
