// src/demos/_shared/Sidebar.tsx
import { useState, type ReactNode } from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DemoTheme } from "./theme";
import { Brand } from "./Brand";

export function Sidebar({
  theme,
  children,
  others,
}: {
  theme: DemoTheme;
  children: ReactNode;
  others: { id: string; name: string; status: "live" | "soon" }[];
}) {
  const isIconOnly = theme.shell.sidebarWidth === theme.shell.sidebarCollapsedWidth;
  const [collapsed, setCollapsed] = useState(false);
  const hideLabels = isIconOnly || collapsed;
  const width = hideLabels ? theme.shell.sidebarCollapsedWidth : theme.shell.sidebarWidth;

  const useGradient = theme.id === "invenflow";
  const peopleCultureActive = theme.id === "people-culture";

  return (
    <aside
      className={cn(
        "shrink-0 border-r transition-[width] duration-200",
      )}
      style={{
        width,
        borderColor: "var(--border)",
        backgroundColor: useGradient ? "var(--accent)" : "var(--surface)",
        backgroundImage: useGradient
          ? "linear-gradient(180deg, var(--accent) 0%, var(--accent-deep) 100%)"
          : undefined,
        color: useGradient ? "#d8e3f1" : "var(--fg)",
      }}
    >
      <div
        className="flex h-14 items-center gap-2 border-b px-3"
        style={{
          borderColor: useGradient ? "rgba(148,163,184,0.16)" : "var(--border)",
        }}
      >
        <Brand theme={theme} size="sm" showName={!hideLabels} />
        {!isIconOnly && (
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="ml-auto flex h-7 w-7 items-center justify-center rounded-md hover:bg-black/5"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            style={
              useGradient
                ? { color: "#d8e3f1" }
                : { color: "var(--muted)" }
            }
          >
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
      <nav className="flex-1 overflow-y-auto py-2">{children}</nav>
      {!hideLabels && (
        <div
          className="border-t px-3 py-3"
          style={{
            borderColor: useGradient ? "rgba(148,163,184,0.16)" : "var(--border)",
          }}
        >
          <div
            className="mb-2 text-[10px] font-medium uppercase tracking-widest"
            style={{ color: useGradient ? "#8ea1b8" : "var(--muted)" }}
          >
            Other demos
          </div>
          <ul className="space-y-1">
            {others.map((d) => (
              <li key={d.id}>
                <a
                  href={`#/demos/${d.id}`}
                  className="flex items-center justify-between rounded-md px-2 py-1.5 text-xs hover:bg-black/5"
                  style={{
                    color: useGradient ? "#d8e3f1" : "var(--muted)",
                    // people-culture active row would normally get a 3px left bar
                    // override — left as a hook for the per-app sidebar items.
                  }}
                >
                  <span className="truncate">{d.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      {peopleCultureActive && (
        <style>{`
          .demo-people-culture aside nav a[data-active="true"] {
            position: relative;
            color: var(--accent);
            background: rgba(238,242,255,1);
          }
          .demo-people-culture aside nav a[data-active="true"]::before {
            content: "";
            position: absolute;
            left: 0; top: 50%;
            transform: translateY(-50%);
            width: 3px; height: 20px;
            background: var(--accent);
            border-radius: 0 2px 2px 0;
          }
        `}</style>
      )}
    </aside>
  );
}
