import type { DemoTheme } from "../theme";

export const kitchenFreshTheme: DemoTheme = {
  id: "kitchen-fresh",
  brand: {
    name: "Kitchen Fresh",
    monogram: "KF",
    surface: "light",
  },
  tokens: {
    "--bg": "#fafafa",
    "--surface": "#ffffff",
    "--fg": "#1a1a1a",
    "--muted": "#666666",
    "--border": "#e0e0e0",
    "--accent": "#1d4ed8",
    "--accent-fg": "#ffffff",
    "--warn": "#f59e0b",
    "--ok": "#22c55e",
    "--bad": "#ef4444",
  },
  shell: {
    sidebarWidth: 256,
    sidebarCollapsedWidth: 48,
    topBarHeight: 0,
    density: "comfortable",
  },
  font: {
    sans: "Inter, system-ui, sans-serif",
    mono: "Menlo, ui-monospace, SFMono-Regular, monospace",
  },
};
