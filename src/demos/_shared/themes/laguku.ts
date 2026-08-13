import type { DemoTheme } from "../theme";

export const lagukuTheme: DemoTheme = {
  id: "laguku",
  brand: {
    name: "Laguku",
    monogram: "LK",
    surface: "light",
  },
  tokens: {
    "--bg": "#ffffff",
    "--surface": "#fff1f2",
    "--fg": "#1f2937",
    "--muted": "#6b7280",
    "--border": "#fecdd3",
    "--accent": "#e11d48",
    "--accent-fg": "#ffffff",
    "--warn": "#f59e0b",
    "--ok": "#10b981",
    "--bad": "#ef4444",
  },
  shell: {
    sidebarWidth: 240,
    sidebarCollapsedWidth: 64,
    topBarHeight: 56,
    density: "comfortable",
  },
  font: {
    sans: "Inter, system-ui, sans-serif",
  },
};