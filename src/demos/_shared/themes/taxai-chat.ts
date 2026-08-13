import type { DemoTheme } from "../theme";

export const taxaiChatTheme: DemoTheme = {
  id: "taxai-chat",
  brand: {
    name: "TaxAI Chat",
    monogram: "TC",
    surface: "light",
  },
  tokens: {
    "--bg": "#ffffff",
    "--surface": "#eef2ff",
    "--fg": "#0f172a",
    "--muted": "#64748b",
    "--border": "#c7d2fe",
    "--accent": "#4f46e5",
    "--accent-fg": "#ffffff",
    "--warn": "#f59e0b",
    "--ok": "#10b981",
    "--bad": "#ef4444",
  },
  shell: {
    sidebarWidth: 280,
    sidebarCollapsedWidth: 240,
    topBarHeight: 56,
    density: "comfortable",
  },
  font: {
    sans: "Inter, system-ui, sans-serif",
  },
};