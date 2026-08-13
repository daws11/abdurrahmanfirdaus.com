import type { DemoTheme } from "../theme";

export const taxaiWizardTheme: DemoTheme = {
  id: "taxai-wizard",
  brand: {
    name: "TaxAI Wizard",
    monogram: "TW",
    surface: "light",
  },
  tokens: {
    "--bg": "#ffffff",
    "--surface": "#f0fdfa",
    "--fg": "#0f172a",
    "--muted": "#64748b",
    "--border": "#ccfbf1",
    "--accent": "#0ea5a4",
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