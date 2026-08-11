// src/demos/_shared/TopBar.tsx
//
// Demo-aware top bar. The PeopleOS (people-culture) theme renders a glass
// 56px header with `bg-white/90 backdrop-blur-md` over the slate-50 page
// background, which matches the production app. Other demos stay on a
// solid `var(--bg)` surface and may show the "UI prototype" badge.

import { ArrowLeft, Menu } from "lucide-react";
import type { ReactNode } from "react";
import type { DemoTheme } from "./theme";
import { Brand } from "./Brand";

export function TopBar({
  theme,
  rightSlot,
  onMenuClick,
}: {
  theme: DemoTheme;
  rightSlot?: ReactNode;
  /** When set, renders a hamburger button (hidden at md+) that opens the mobile sidebar drawer. */
  onMenuClick?: () => void;
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
      {onMenuClick && (
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className="-ml-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md md:hidden"
          style={{ color: "var(--muted)" }}
        >
          <Menu className="h-4 w-4" />
        </button>
      )}
      <a
        href="/"
        className="flex shrink-0 items-center gap-1.5 text-[12px] font-medium uppercase tracking-wider opacity-60 hover:opacity-100"
        style={{ color: "var(--muted)" }}
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Portfolio</span>
      </a>
      <div className="ml-1 hidden h-5 w-px bg-[var(--border)] sm:flex" />
      <Brand theme={theme} size="sm" />
      {!isPeopleCulture && (
        <span
          className="hidden rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider sm:inline-block"
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
