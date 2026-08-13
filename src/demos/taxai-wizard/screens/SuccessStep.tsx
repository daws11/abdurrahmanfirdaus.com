// src/demos/taxai-wizard/screens/SuccessStep.tsx
//
// Step 6 of the Wizard onboarding — post-payment welcome screen. Mirrors
// production SuccessStep from tax-ai-wizard-web-70. "Go to dashboard"
// button jumps to /dashboard.

import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/demos/_shared/Button";
import { setDemoHash } from "@/demos/router";
import { PLANS, SAMPLE_SUBSCRIPTION } from "../mocks";

export function SuccessStep() {
  const plan = PLANS.find((p) => p.id === SAMPLE_SUBSCRIPTION.planId)!;

  return (
    <div className="mx-auto max-w-md px-6 py-12 text-center">
      <div
        className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full"
        style={{ backgroundColor: "color-mix(in srgb, var(--ok) 15%, transparent)" }}
      >
        <CheckCircle2 className="h-8 w-8" style={{ color: "var(--ok)" }} />
      </div>

      <h2 className="text-3xl font-semibold tracking-tight">You're in.</h2>
      <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
        Welcome to TaxAI. Your {plan.name} plan is active — let's get you to the dashboard.
      </p>

      <div
        className="mt-8 rounded-lg border p-5 text-left"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
          Subscription
        </p>
        <p className="mt-1 text-base font-semibold">{plan.name}</p>
        <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
          <div>
            <p style={{ color: "var(--muted)" }}>Messages / {plan.interval}</p>
            <p className="mt-0.5 font-medium">{plan.messageQuota.toLocaleString()}</p>
          </div>
          <div>
            <p style={{ color: "var(--muted)" }}>Renews on</p>
            <p className="mt-0.5 font-medium">{SAMPLE_SUBSCRIPTION.expiresAt}</p>
          </div>
        </div>
      </div>

      <Button
        type="button"
        variant="primary"
        className="mt-8 w-full"
        onClick={() => setDemoHash("taxai-wizard", "dashboard")}
      >
        Go to dashboard
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}