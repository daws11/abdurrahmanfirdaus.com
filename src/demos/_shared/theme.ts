// src/demos/_shared/theme.ts
//
// Concrete theme records for each demo. Values come from
// docs/demos-design-contracts.md (extracted from production source CSS/Tailwind
// config — see .claude/recon-*.md).

export type Surface = "light" | "dark";

export interface DemoTheme {
  id: "invenflow" | "invoice-sense" | "channelflow" | "kitchen-fresh" | "people-culture" | "laguku" | "taxai-wizard" | "taxai-chat" | "taxai-talk";
  brand: {
    name: string;
    monogram: string;
    surface: Surface;
  };
  tokens: {
    "--bg": string;
    "--surface": string;
    "--fg": string;
    "--muted": string;
    "--border": string;
    "--accent": string;
    "--accent-fg": string;
    "--warn": string;
    "--ok": string;
    "--bad": string;
  };
  shell: {
    sidebarWidth: number;
    sidebarCollapsedWidth: number;
    topBarHeight: number;
    density: "compact" | "comfortable";
  };
  font: {
    sans: string;
    mono?: string;
  };
}

export type DemoId = DemoTheme["id"];

import { invenflowTheme } from "./themes/invenflow";
import { invoiceSenseTheme } from "./themes/invoice-sense";
import { channelflowTheme } from "./themes/channelflow";
import { kitchenFreshTheme } from "./themes/kitchen-fresh";
import { peopleCultureTheme } from "./themes/people-culture";
import { lagukuTheme } from "./themes/laguku";
import { taxaiWizardTheme } from "./themes/taxai-wizard";
import { taxaiChatTheme } from "./themes/taxai-chat";
import { taxaiTalkTheme } from "./themes/taxai-talk";

export const THEMES: Record<DemoTheme["id"], DemoTheme> = {
  invenflow: invenflowTheme,
  "invoice-sense": invoiceSenseTheme,
  channelflow: channelflowTheme,
  "kitchen-fresh": kitchenFreshTheme,
  "people-culture": peopleCultureTheme,
  laguku: lagukuTheme,
  "taxai-wizard": taxaiWizardTheme,
  "taxai-chat": taxaiChatTheme,
  "taxai-talk": taxaiTalkTheme,
};

export function getTheme(id: DemoTheme["id"]): DemoTheme {
  return THEMES[id];
}

/** Applies the theme's CSS variables to document root (one-shot). */
export function applyTheme(theme: DemoTheme) {
  const root = document.documentElement;
  root.classList.add(`demo-${theme.id}`);
  for (const [k, v] of Object.entries(theme.tokens)) {
    root.style.setProperty(k, v);
  }
}
