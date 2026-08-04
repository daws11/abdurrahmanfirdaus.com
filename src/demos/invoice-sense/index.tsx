// src/demos/invoice-sense/index.tsx
//
// Top-level shell for the Invoice Sense demo. The production app uses a
// 56px top bar with horizontal tab navigation and a 3-column main content
// area (InvoiceList 25% / DocumentViewer 45% / DataPanel 30%). No sidebar.
//
// The top bar is rendered inline (not via the shared TopBar) so the layout
// matches production: logo block, brand title, tab strip, and right-side
// actions in the same order as production.

import { useMemo } from "react";
import { ArrowLeft, FileText, Settings, Plus, User } from "lucide-react";
import { setDemoHash } from "@/demos/router";
import { useTheme } from "@/demos/_shared/useTheme";
import { Button } from "@/demos/_shared/Button";
import type { DemoTheme } from "@/demos/_shared/theme";
import { Inbox } from "./screens/Inbox";
import { Reconciliation } from "./screens/Reconciliation";
import { Suppliers } from "./screens/Suppliers";
import { Analytics } from "./screens/Analytics";
import {
  INVOICE_SENSE_SCREENS,
  getInvoiceSenseScreen,
  type InvoiceSenseScreen,
} from "./routes";

export function InvoiceSense({
  theme,
  sub,
}: {
  theme: DemoTheme;
  sub: string | null;
}) {
  useTheme(theme.id);
  const screen: InvoiceSenseScreen = getInvoiceSenseScreen(sub, "inbox");

  // Tab strip content — replicates the production AppNavbar with ghost
  // buttons (active = `secondary` variant) and the InvoiceSense tab list.
  const tabs = useMemo(
    () => (
      <nav className="flex items-center gap-1">
        {INVOICE_SENSE_SCREENS.map((s) => {
          const active = screen === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setDemoHash(theme.id, s.id)}
              className="rounded-md px-3 text-[12px] font-medium transition-colors"
              style={{
                height: 32,
                backgroundColor: active ? "var(--surface)" : "transparent",
                color: active ? "var(--fg)" : "var(--muted)",
                border: active ? "1px solid var(--border)" : "1px solid transparent",
              }}
            >
              {s.label}
            </button>
          );
        })}
      </nav>
    ),
    [screen, theme.id],
  );

  // Right-side actions (theme toggle, settings, avatar, upload — matching
  // production AppNavbar layout).
  const rightActions = useMemo(
    () => (
      <div className="flex items-center gap-2">
        <Button size="sm" variant="primary">
          <Plus className="h-3.5 w-3.5" />
          Upload Invoices
        </Button>
        <div className="ml-2 h-6 w-px" style={{ backgroundColor: "var(--border)" }} />
        <button
          type="button"
          aria-label="Settings"
          className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-[var(--surface)]"
          style={{ color: "var(--muted)" }}
        >
          <Settings className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Account"
          className="flex h-8 w-8 items-center justify-center rounded-full"
          style={{
            backgroundColor: "var(--accent)",
            color: "var(--accent-fg)",
          }}
        >
          <User className="h-4 w-4" />
        </button>
      </div>
    ),
    [],
  );

  const content = (() => {
    switch (screen) {
      case "reconciliation":
        return <Reconciliation />;
      case "suppliers":
        return <Suppliers />;
      case "analytics":
        return <Analytics />;
      case "inbox":
      default:
        return <Inbox />;
    }
  })();

  return (
    <div
      className="flex h-screen w-full flex-col overflow-hidden"
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--fg)",
        fontFamily: theme.font.sans,
      }}
    >
      {/* Top bar — AppNavbar exact visual */}
      <header
        className="flex items-center gap-4 border-b px-4"
        style={{
          height: theme.shell.topBarHeight,
          borderColor: "var(--border)",
          backgroundColor: "var(--bg)",
          flexShrink: 0,
          zIndex: 10,
        }}
      >
        {/* Back link → portfolio */}
        <a
          href="/"
          className="flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-wider opacity-60 hover:opacity-100"
          style={{ color: "var(--muted)" }}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Portfolio
        </a>

        {/* Divider */}
        <div className="ml-1 flex h-5 w-px" style={{ backgroundColor: "var(--border)" }} />

        {/* Logo tile + brand title — mirrors production "bg-primary FileText" */}
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center rounded-md"
            style={{
              backgroundColor: "var(--accent)",
              color: "var(--accent-fg)",
              padding: 6,
            }}
          >
            <FileText className="h-4 w-4" />
          </div>
          <span className="text-base font-bold">Invoice Sense</span>
          <span
            className="rounded-md border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--surface)",
              color: "var(--muted)",
            }}
          >
            v1.0
          </span>
        </div>

        {/* Tab nav */}
        <div className="ml-4 flex items-center gap-1">{tabs}</div>

        {/* Right-side actions */}
        <div className="ml-auto flex items-center gap-3">{rightActions}</div>
      </header>

      {/* Main content area — full width, no padding (screens own their layout) */}
      <main className="flex-1 overflow-hidden">{content}</main>
    </div>
  );
}
