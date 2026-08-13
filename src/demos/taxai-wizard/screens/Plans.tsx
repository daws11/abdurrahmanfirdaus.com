// src/demos/taxai-wizard/screens/Plans.tsx
//
// 4 tier cards (Trial / Monthly / Quarterly / Yearly). Highlighted tier
// ("Quarterly") renders a "Most popular" ribbon. Click → /checkout.

import { Check } from "lucide-react";
import { Button } from "@/demos/_shared/Button";
import { setDemoHash } from "@/demos/router";
import { PLANS } from "../mocks";

export function Plans() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="text-center">
        <h2 className="text-2xl font-semibold tracking-tight">Choose your plan</h2>
        <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
          All plans include GPT-4o tax Q&amp;A and document upload.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className="relative flex flex-col rounded-lg border p-5 transition-colors"
            style={{
              borderColor: plan.highlighted ? "var(--accent)" : "var(--border)",
              backgroundColor: "var(--surface)",
              boxShadow: plan.highlighted ? "0 0 0 1px var(--accent)" : undefined,
            }}
          >
            {plan.highlighted && (
              <span
                className="absolute -top-2 right-3 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
              >
                Most popular
              </span>
            )}
            <h3 className="text-lg font-semibold">{plan.name}</h3>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-semibold tracking-tight">${plan.priceUsd}</span>
              <span className="text-xs" style={{ color: "var(--muted)" }}>/ {plan.interval}</span>
            </div>
            <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
              {plan.messageQuota.toLocaleString()} messages
            </p>

            <ul className="mt-4 flex-1 space-y-1.5">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-xs">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: "var(--ok)" }} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <Button
              type="button"
              variant={plan.highlighted ? "primary" : "secondary"}
              className="mt-5 w-full"
              onClick={() => setDemoHash("taxai-wizard", "checkout")}
            >
              {plan.priceUsd === 0 ? "Start free trial" : "Subscribe"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
