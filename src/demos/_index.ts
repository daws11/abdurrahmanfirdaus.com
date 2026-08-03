/**
 * Demo registry metadata (no React component imports here to avoid cycles).
 * The actual demo components are loaded by `router.tsx` via lazy().
 */

import { THEMES, type DemoTheme } from "./_shared/theme";

export type DemoId =
  | "invenflow"
  | "invoice-sense"
  | "channelflow"
  | "kitchen-fresh"
  | "people-culture";

export type DemoStatus = "live" | "soon";

export interface DemoMeta {
  id: DemoId;
  title: string;
  division: string;
  blurb: string;
  route: `/demos/${DemoId}`;
  status: DemoStatus;
  theme: DemoTheme;
}

export const DEMOS: DemoMeta[] = [
  {
    id: "invenflow",
    title: "Invenflow",
    division: "Inventory · Warehouse · Outlets",
    blurb: "Five boards in one — purchasing, receiving, inventory, movement, stocktake.",
    route: "/demos/invenflow",
    status: "live",
    theme: THEMES.invenflow,
  },
  {
    id: "invoice-sense",
    title: "Invoice Sense",
    division: "Finance · Recon",
    blurb: "Every invoice in one inbox — auto-cross-checked against stock and the ledger.",
    route: "/demos/invoice-sense",
    status: "live",
    theme: THEMES["invoice-sense"],
  },
  {
    id: "channelflow",
    title: "Channelflow",
    division: "Booking · AI Agent",
    blurb: "Four channels, one queue — WhatsApp, Instagram, email, TikTok in a single inbox.",
    route: "/demos/channelflow",
    status: "live",
    theme: THEMES.channelflow,
  },
  {
    id: "kitchen-fresh",
    title: "Kitchen Fresh",
    division: "Kitchen · Outlet Ops",
    blurb: "Daily kitchen ops for outlets — prep, par levels, shift handoff.",
    route: "/demos/kitchen-fresh",
    status: "live",
    theme: THEMES["kitchen-fresh"],
  },
  {
    id: "people-culture",
    title: "People & Culture",
    division: "HR · Workforce",
    blurb: "Workforce records, onboarding, lifecycle — built for the People & Culture team.",
    route: "/demos/people-culture",
    status: "live",
    theme: THEMES["people-culture"],
  },
];

export function getDemoById(id: string | null | undefined): DemoMeta | undefined {
  if (!id) return undefined;
  return DEMOS.find((d) => d.id === id);
}
