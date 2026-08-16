// src/demos/taxai-wizard/screens/CheckoutStep.tsx
//
// Step 5 of the Wizard onboarding — Stripe Elements-style payment UI.
// Re-implements production PaymentForm from tax-ai-wizard-web-70: card form
// (4242 defaultValue + Lock icon) + order summary (plan + VAT 5% + total).
// No real Stripe integration.

import { CreditCard, Lock } from "lucide-react";
import { Button } from "@/demos/_shared/Button";
import { Field } from "@/demos/_shared/Field";
import { setDemoHash } from "@/demos/router";
import { PLANS, SAMPLE_USER } from "../mocks";

export function CheckoutStep() {
  // ponytail: hardcode Quarterly for visual demo (matches production default)
  const planName = sessionStorage.getItem("taxai-wizard-plan") || "Quarterly Plan";
  const plan = PLANS.find((p) => p.name === planName) ?? PLANS.find((p) => p.id === "quarterly") ?? PLANS[0];
  const vatAmount = (plan.priceUsd * 0.05).toFixed(2);
  const total = (plan.priceUsd * 1.05).toFixed(2);

  const onPay = () => {
    sessionStorage.setItem("taxai-wizard-plan", plan.name);
    setDemoHash("taxai-wizard", "success");
  };

  return (
    <div className="w-full max-w-4xl">
      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div
          className="rounded-md border p-6 shadow-sm backdrop-blur-md"
          style={{
            backgroundColor: "color-mix(in srgb, var(--surface) 80%, transparent)",
            borderColor: "var(--border)",
          }}
        >
          <h3 className="flex items-center gap-2 text-base font-semibold" style={{ color: "var(--fg)" }}>
            <CreditCard className="h-4 w-4" /> Payment details
          </h3>
          <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
            Powered by Stripe. Your card is encrypted on submit.
          </p>

          <div className="mt-6 space-y-4">
            <Field label="Card number" defaultValue="4242 4242 4242 4242" placeholder="1234 1234 1234 1234" />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Expiry" defaultValue="12 / 28" placeholder="MM / YY" />
              <Field label="CVC" defaultValue="123" placeholder="123" />
            </div>
            <Field label="Name on card" defaultValue={SAMPLE_USER.name} placeholder="Full name" />
          </div>

          <Button type="button" variant="primary" className="mt-6 w-full" onClick={onPay}>
            <Lock className="h-4 w-4" /> Pay ${total}
          </Button>
        </div>

        <div
          className="rounded-md border p-6 shadow-sm backdrop-blur-md"
          style={{
            backgroundColor: "color-mix(in srgb, var(--surface) 80%, transparent)",
            borderColor: "var(--border)",
          }}
        >
          <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
            Order summary
          </h3>
          <div className="mt-4 space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-sm" style={{ color: "var(--fg)" }}>{plan.name}</span>
              <span className="text-sm font-medium" style={{ color: "var(--fg)" }}>${plan.priceUsd.toFixed(2)}</span>
            </div>
            <div className="flex items-baseline justify-between text-xs" style={{ color: "var(--muted)" }}>
              <span>VAT (5%, UAE)</span>
              <span>${vatAmount}</span>
            </div>
            <div
              className="flex items-baseline justify-between border-t pt-2"
              style={{ borderColor: "var(--border)" }}
            >
              <span className="text-sm font-semibold" style={{ color: "var(--fg)" }}>Total</span>
              <span className="text-base font-semibold" style={{ color: "var(--fg)" }}>${total}</span>
            </div>
          </div>
          <p className="mt-4 text-xs" style={{ color: "var(--muted)" }}>
            Renews automatically each {plan.interval}. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
}