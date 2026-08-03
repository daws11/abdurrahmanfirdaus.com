import type { DemoTheme } from "../theme";

export const channelflowTheme: DemoTheme = {
  id: "channelflow",
  brand: {
    name: "Channelflow",
    monogram: "CF",
    surface: "light",
  },
  tokens: {
    "--bg": "#f8fafc",
    "--surface": "#ffffff",
    "--fg": "#0f172a",
    "--muted": "#64748b",
    "--border": "#e2e8f0",
    "--accent": "#10b981",
    "--accent-fg": "#ffffff",
    "--warn": "#f59e0b",
    "--ok": "#10b981",
    "--bad": "#f43f5e",
  },
  shell: {
    sidebarWidth: 64,
    sidebarCollapsedWidth: 64,
    topBarHeight: 0,
    density: "compact",
  },
  font: {
    sans: "Inter, system-ui, sans-serif",
    mono: "JetBrains Mono, ui-monospace, SFMono-Regular, monospace",
  },
};
