// src/demos/_shared/Shell.tsx
//
// Brand-aware shell. Composes Sidebar + TopBar + content area.
// Sidebar is omitted when theme.shell.sidebarWidth === 0.
// TopBar is omitted when theme.shell.topBarHeight === 0.
//
// Legacy exports (DemoShell, DemoScreenHeader, SidebarNavItem, SearchInput,
// DemoNotice) are kept so the existing per-app screens keep compiling until
// the per-app plans replace them. They will be removed in a later step.

import { useState, type ReactNode } from "react";
import {
  ArrowLeft,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  CircleAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { DemoTheme } from "./theme";
import { TopBar } from "./TopBar";
import { Sidebar } from "./Sidebar";
import { DEMOS, type DemoMeta } from "../_index";

// ---------- New brand-aware Shell ----------

export function Shell({
  theme,
  children,
  nav,
  rightSlot,
}: {
  theme: DemoTheme;
  children: ReactNode;
  nav: ReactNode;
  rightSlot?: ReactNode;
}) {
  const showSidebar = theme.shell.sidebarWidth > 0;
  const showTopBar = theme.shell.topBarHeight > 0;
  const others = DEMOS.filter((d) => d.id !== theme.id);

  return (
    <div
      className="flex h-screen w-full overflow-hidden"
      style={{ backgroundColor: "var(--bg)", color: "var(--fg)" }}
    >
      {showSidebar && (
        <Sidebar
          theme={theme}
          others={others.map((d) => ({ id: d.id, name: d.title, status: d.status }))}
        >
          {nav}
        </Sidebar>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        {showTopBar && <TopBar theme={theme} rightSlot={rightSlot} />}
        <main
          className="flex-1 overflow-y-auto px-4 py-4 md:px-6 md:py-6"
          style={{ backgroundColor: "var(--bg)" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

// ---------- Legacy DemoShell (kept for back-compat until T10) ----------

export function DemoShell({
  meta,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  sub: _sub,
  children,
  sidebarExtras,
}: {
  meta: DemoMeta;
  sub?: string | null;
  children: ReactNode;
  sidebarExtras?: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const otherDemos = DEMOS.filter((d) => d.id !== meta.id);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <aside
        className={cn(
          "flex shrink-0 flex-col border-r border-border bg-sidebar text-sidebar-foreground transition-[width] duration-200",
          collapsed ? "w-[72px]" : "w-64",
        )}
      >
        <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-3">
          <a
            href="/"
            className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {!collapsed && <span>Portfolio</span>}
          </a>
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className={cn(
              "ml-auto flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
              collapsed && "ml-0",
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>

        <div className={cn("border-b border-sidebar-border px-3 py-4", collapsed && "px-2")}>
          {!collapsed ? (
            <>
              <div className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                {meta.division}
              </div>
              <div className="mt-1 truncate font-semibold">{meta.title}</div>
            </>
          ) : (
            <div className="text-center font-semibold">{meta.title.charAt(0)}</div>
          )}
        </div>

        {sidebarExtras && <nav className="flex-1 overflow-y-auto py-2">{sidebarExtras}</nav>}

        {!collapsed && (
          <div className="border-t border-sidebar-border px-3 py-3">
            <div className="mb-2 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              Other demos
            </div>
            <ul className="space-y-1">
              {otherDemos.map((d) => (
                <li key={d.id}>
                  <a
                    href={d.route}
                    className="flex items-center justify-between rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                  >
                    <span className="truncate">{d.title}</span>
                    {d.status === "soon" && (
                      <span className="rounded-full border border-border px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-muted-foreground">
                        soon
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center gap-3 border-b border-border bg-background px-4">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-semibold">{meta.title}</h1>
            <span className="rounded-full border border-border bg-secondary px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
              UI prototype
            </span>
          </div>
          <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
            <span>Synthetic data · no backend</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-muted/30 px-4 py-4 md:px-6 md:py-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export function SidebarNavItem({
  active,
  collapsed,
  onClick,
  icon,
  children,
}: {
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left text-sm transition-colors",
        active
          ? "bg-sidebar-accent text-foreground"
          : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
        collapsed && "justify-center px-2",
      )}
    >
      {icon && <span className="flex h-4 w-4 items-center">{icon}</span>}
      {!collapsed && <span className="truncate">{children}</span>}
    </button>
  );
}

export function DemoScreenHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search…",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-9 w-56 rounded-md border border-input bg-background pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
      />
    </div>
  );
}

export function DemoNotice({ children }: { children: ReactNode }) {
  return (
    <div className="mb-4 flex items-start gap-2 rounded-md border border-dashed border-border bg-secondary/40 px-3 py-2 text-xs text-muted-foreground">
      <CircleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      <div>{children}</div>
    </div>
  );
}
