import type { DemoTheme } from "../theme";

export const invoiceSenseTheme: DemoTheme = {
  id: "invoice-sense",
  brand: {
    name: "Invoice Sense",
    monogram: "IS",
    surface: "light",
  },
  tokens: {
    "--bg": "#ffffff",
    "--surface": "#fafafa",
    "--fg": "#0f172a",
    "--muted": "#64748b",
    "--border": "#e2e8f0",
    "--accent": "#2563eb",
    "--accent-fg": "#ffffff",
    "--warn": "#f59e0b",
    "--ok": "#16a34a",
    "--bad": "#dc2626",
  },
  shell: {
    sidebarWidth: 0,
    sidebarCollapsedWidth: 0,
    topBarHeight: 56,
    density: "comfortable",
  },
  font: {
    sans: "Inter, system-ui, sans-serif",
    mono: "ui-monospace, SFMono-Regular, Menlo, monospace",
  },
};
