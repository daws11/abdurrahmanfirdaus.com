// src/demos/taxai-wizard/screens/Checkout.tsx
//
// Stripe Elements mock — shows a card form preview and an order summary.
// "Pay" button → /dashboard. No real Stripe integration.

import { CreditCard, Lock } from "lucide-react";
import { Button } from "@/demos/_shared/Button";
import { Field } from "@/demos/_shared/Field";
import { setDemoHash } from "@/demos/router";
import { PLANS } from "../mocks";

export function Checkout() {
  const plan = PLANS.find((p) => p.id === "quarterly")!;

  const onPay = () => setDemoHash("taxai-wizard", "dashboard");

  return (
    <div className="mx-auto grid max-w-4xl gap-6 px-6 py-10 lg:grid-cols-[1fr_360px]">
      {/* Payment form (mock Stripe Elements) */}
      <div
        className="rounded-lg border p-6"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <h3 className="flex items-center gap-2 text-base font-semibold">
          <CreditCard className="h-4 w-4" /> Payment details
        </h3>
        <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
          Powered by Stripe. Your card is encrypted on submit.
        </p>

        {/* ponytail: defaultValue instead of controlled state — nothing reads these back. */}
        <div className="mt-6 space-y-4">
          <Field label="Card number" defaultValue="4242 4242 4242 4242" placeholder="1234 1234 1234 1234" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Expiry" defaultValue="12 / 28" placeholder="MM / YY" />
            <Field label="CVC" defaultValue="123" placeholder="123" />
          </div>
          <Field label="Name on card" defaultValue="Sara Al-Mansouri" placeholder="Full name" />
        </div>

        <Button type="button" variant="primary" className="mt-6 w-full" onClick={onPay}>
          <Lock className="h-4 w-4" /> Pay ${plan.priceUsd}.00
        </Button>
      </div>

      {/* Order summary */}
      <div
        className="rounded-lg border p-6"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
          Order summary
        </h3>
        <div className="mt-4 space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-sm">{plan.name}</span>
            <span className="text-sm font-medium">${plan.priceUsd}.00</span>
          </div>
          <div className="flex items-baseline justify-between text-xs" style={{ color: "var(--muted)" }}>
            <span>VAT (5%, UAE)</span>
            <span>${(plan.priceUsd * 0.05).toFixed(2)}</span>
          </div>
          <div
            className="flex items-baseline justify-between border-t pt-2"
            style={{ borderColor: "var(--border)" }}
          >
            <span className="text-sm font-semibold">Total</span>
            <span className="text-base font-semibold">${(plan.priceUsd * 1.05).toFixed(2)}</span>
          </div>
        </div>
        <p className="mt-4 text-xs" style={{ color: "var(--muted)" }}>
          Renews automatically each {plan.interval}. Cancel anytime from your dashboard.
        </p>
      </div>
    </div>
  );
}
