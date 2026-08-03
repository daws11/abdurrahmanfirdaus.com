import type { DemoTheme } from "../theme";

export const invenflowTheme: DemoTheme = {
  id: "invenflow",
  brand: {
    name: "Invenflow",
    monogram: "IF",
    surface: "light",
  },
  tokens: {
    "--bg": "#f9fafb",
    "--surface": "#ffffff",
    "--fg": "#111827",
    "--muted": "#6b7280",
    "--border": "#e5e7eb",
    "--accent": "#112239",
    "--accent-fg": "#ffffff",
    "--warn": "#f59e0b",
    "--ok": "#22c55e",
    "--bad": "#ef4444",
  },
  shell: {
    sidebarWidth: 256,
    sidebarCollapsedWidth: 72,
    topBarHeight: 0,
    density: "compact",
  },
  font: {
    sans: "system-ui, -apple-system, 'Segoe UI', sans-serif",
    mono: "ui-monospace, SFMono-Regular, Menlo, monospace",
  },
};
