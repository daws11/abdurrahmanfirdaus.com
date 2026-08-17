// src/demos/taxai-chat/screens/SidebarHeader.tsx
//
// Sidebar header — Atto branding + collapse chevron. Matches production
// AppSidebar header (app-sidebar.tsx:125-130).

import { Sparkles, ChevronLeft } from "lucide-react";

export function SidebarHeader({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: "var(--border)" }}>
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5" style={{ color: "var(--accent)" }} />
        {!collapsed && (
          <span className="font-semibold text-sm" style={{ color: "var(--fg)" }}>
            Talk with Atto
          </span>
        )}
      </div>
      {!collapsed && (
        <button
          className="hover:opacity-80"
          style={{ color: "var(--muted)" }}
          aria-label="Collapse sidebar"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
