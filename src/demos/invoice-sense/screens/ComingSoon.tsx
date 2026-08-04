// src/demos/invoice-sense/screens/ComingSoon.tsx
// @ts-nocheck
//
// Production-style "Coming soon" panel for stubbed routes. Mirrors the visual
// language of the rest of the app (shadcn rounded-md + accent border + ghost
// CTA) and is driven by the active route so each tab gets the right copy.

import {
  ArrowRight,
  Calendar,
  Construction,
  DollarSign,
  LogIn,
  Settings as SettingsIcon,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/demos/_shared/Button";

interface ComingSoonProps {
  screen: string;
}

const COPY: Record<string, { title: string; subtitle: string; Icon: LucideIcon; cta: string }> = {
  "payment-tracking": {
    title: "Payment Tracking",
    subtitle: "Track sent and pending bank transfers by outlet. Cross-references the WhatsApp bot log and Xero payouts.",
    Icon: DollarSign,
    cta: "Talk to the team",
  },
  "sales-tracking": {
    title: "Sales Tracking",
    subtitle: "POS-style sales by outlet and product, hourly granularity. Connects to iSeller and Tokopedia endpoints.",
    Icon: TrendingUp,
    cta: "Request access",
  },
  "weekly-finance-review": {
    title: "Weekly Finance Review",
    subtitle: "Roll-up of weekly inflow, outflow, and variance across all outlets with annotated commentary.",
    Icon: Calendar,
    cta: "Get notified",
  },
  settings: {
    title: "Settings",
    subtitle: "Manage notification rules, accounting integration, and per-user access. Requires admin role.",
    Icon: SettingsIcon,
    cta: "Open settings",
  },
  login: {
    title: "Sign in",
    subtitle: "Authenticate with your work email to access Invoice Sense. Single sign-on via Google Workspace.",
    Icon: LogIn,
    cta: "Continue with Google",
  },
};

export function ComingSoon({ screen }: ComingSoonProps) {
  const cfg = COPY[screen] ?? {
    title: "Coming soon",
    subtitle: "This surface is being rebuilt against the production roadmap.",
    Icon: Construction,
    cta: "Get notified",
  };
  const { Icon } = cfg;

  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <div
        className="w-full max-w-lg rounded-lg border p-8 text-center"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}
      >
        <div
          className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg"
          style={{
            backgroundColor: "color-mix(in oklab, var(--accent) 12%, transparent)",
            color: "var(--accent)",
          }}
        >
          <Icon className="h-5 w-5" />
        </div>
        <h2 className="mt-5 text-lg font-semibold">{cfg.title}</h2>
        <p className="mx-auto mt-2 max-w-sm text-[12px] leading-relaxed" style={{ color: "var(--muted)" }}>
          {cfg.subtitle}
        </p>
        <div
          className="mt-5 inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider"
          style={{
            borderColor: "color-mix(in oklab, var(--accent) 30%, transparent)",
            backgroundColor: "color-mix(in oklab, var(--accent) 10%, transparent)",
            color: "var(--accent)",
          }}
        >
          <Construction className="h-3 w-3" />
          In active development
        </div>
        <div className="mt-6 flex items-center justify-center gap-2">
          <Button size="sm" variant="primary">
            {cfg.cta}
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
          <Button size="sm" variant="secondary">
            View roadmap
          </Button>
        </div>
      </div>
    </div>
  );
}
