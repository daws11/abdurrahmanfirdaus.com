import type { DemoTheme } from "../theme";

export const peopleCultureTheme: DemoTheme = {
  id: "people-culture",
  brand: {
    name: "PeopleOS",
    monogram: "PC",
    surface: "light",
  },
  tokens: {
    "--bg": "#f8fafc",
    "--surface": "#ffffff",
    "--fg": "#0f172a",
    "--muted": "#64748b",
    "--border": "#e2e8f0",
    "--accent": "#4F46E5",
    "--accent-fg": "#ffffff",
    "--warn": "#f59e0b",
    "--ok": "#10b981",
    "--bad": "#f43f5e",
  },
  shell: {
    sidebarWidth: 256,
    sidebarCollapsedWidth: 64,
    topBarHeight: 56,
    density: "comfortable",
  },
  font: {
    sans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, system-ui, sans-serif",
    mono: "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
  },
};
