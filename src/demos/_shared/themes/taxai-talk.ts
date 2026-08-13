import type { DemoTheme } from "../theme";

export const taxaiTalkTheme: DemoTheme = {
  id: "taxai-talk",
  brand: {
    name: "TaxAI Talk",
    monogram: "TT",
    surface: "dark",
  },
  tokens: {
    "--bg": "#0b0b14",
    "--surface": "#15152b",
    "--fg": "#f5f3ff",
    "--muted": "#a78bfa",
    "--border": "#312e81",
    "--accent": "#7c3aed",
    "--accent-fg": "#ffffff",
    "--warn": "#fbbf24",
    "--ok": "#34d399",
    "--bad": "#f87171",
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