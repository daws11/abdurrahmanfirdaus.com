// src/demos/taxai-wizard/screens/PlanSelectionStep.tsx
//
// Step 4 of the Wizard onboarding — 4-plan grid (Trial/Monthly/Quarterly/
// Yearly). Mirrors production PlanSelectionStep from tax-ai-wizard-web-70:
// 3-col responsive grid, hover scale-102, "Most Popular" badge on Quarterly.
// Trial plan skips Checkout → goes directly to Success.

import { CreditCard, Check } from "lucide-react";
import { Badge } from "@/demos/_shared/Badge";
import { StepCardTitle, StepCardDescription } from "./StepCard";
import { PLANS } from "../mocks";
import { setDemoHash } from "@/demos/router";

export function PlanSelectionStep() {
  return (
    <div className="w-full max-w-5xl">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-3">
          <CreditCard className="w-12 h-12" style={{ color: "var(--accent)" }} />
        </div>
        <StepCardTitle>Choose Your Plan</StepCardTitle>
        <StepCardDescription>
          Choose your plan and start chatting with our AI tax assistant immediately.
        </StepCardDescription>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {PLANS.map((plan) => {
          return (
            <div
              key={plan.id}
              // ponytail: 1.02 scale (not production's 1.05) — less aggressive for a static portfolio demo card
              className="relative flex flex-col rounded-md border shadow-sm backdrop-blur-md transition-all hover:shadow-md hover:scale-[1.02]"
              style={{
                backgroundColor: "color-mix(in srgb, var(--surface) 80%, transparent)",
                borderColor: plan.highlighted ? "var(--accent)" : "var(--border)",
              }}
            >
              {plan.highlighted && (
                <Badge tone="accent" className="absolute -top-2 left-3 text-[10px] uppercase tracking-wider font-semibold">
                  Most Popular
                </Badge>
              )}
              <div className="px-6 pt-6 pb-0 text-left">
                <h3 className="text-xl font-semibold" style={{ color: "var(--fg)" }}>{plan.name}</h3>
                <div className="flex items-baseline gap-1.5 mt-2">
                  <span className="text-3xl font-bold" style={{ color: "var(--fg)" }}>
                    ${plan.priceUsd}
                  </span>
                  <span className="text-sm" style={{ color: "var(--muted)" }}>
                    /{plan.interval}
                  </span>
                </div>
                <p className="text-xs mt-2 min-h-[40px]" style={{ color: "var(--muted)" }}>
                  {plan.description}
                </p>
              </div>
              <div className="px-6 pt-2 pb-6 flex-1">
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-xs" style={{ color: "var(--muted)" }}>
                      <Check className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "var(--ok)" }} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="px-6 pb-6 pt-2 mt-auto">
                <button
                  type="button"
                  onClick={() => {
                    sessionStorage.setItem("taxai-wizard-plan", plan.name);
                    if (plan.isTrial) {
                      setDemoHash("taxai-wizard", "success");
                    } else {
                      setDemoHash("taxai-wizard", "checkout");
                    }
                  }}
                  className="w-full rounded-md h-10 text-sm font-semibold transition-opacity hover:opacity-90"
                  style={{
                    backgroundColor: plan.highlighted ? "var(--accent)" : "var(--surface)",
                    color: plan.highlighted ? "var(--accent-fg)" : "var(--fg)",
                    border: plan.highlighted ? "none" : "1px solid var(--border)",
                  }}
                >
                  {plan.priceUsd === 0 ? "Start Free Trial" : "Subscribe"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-center text-xs mt-8" style={{ color: "var(--muted)" }}>
        All plans include our comprehensive AI tax assistant and guidance. No credit card required for free trial.
      </p>
    </div>
  );
}