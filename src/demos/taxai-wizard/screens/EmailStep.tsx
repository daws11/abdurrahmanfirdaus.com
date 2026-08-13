// src/demos/taxai-wizard/screens/EmailStep.tsx
//
// Step 1 of the Wizard onboarding — email input only. Mirrors production
// EmailInputStep from tax-ai-wizard-web-70. Submit jumps to /otp.

import { useState, type FormEvent } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/demos/_shared/Button";
import { Field } from "@/demos/_shared/Field";
import { setDemoHash } from "@/demos/router";

export function EmailStep() {
  const [email, setEmail] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setDemoHash("taxai-wizard", "otp");
  };

  return (
    <div className="mx-auto max-w-md px-6 py-10">
      <div
        className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full"
        style={{ backgroundColor: "color-mix(in srgb, var(--accent) 10%, transparent)" }}
      >
        <Mail className="h-5 w-5" style={{ color: "var(--accent)" }} />
      </div>
      <h2 className="text-center text-2xl font-semibold tracking-tight">
        What's your work email?
      </h2>
      <p className="mt-2 text-center text-sm" style={{ color: "var(--muted)" }}>
        We'll send a 6-digit code to verify it's you.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <Field
          label="Work email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.ae"
        />

        <Button type="submit" variant="primary" className="mt-2 w-full">
          Send verification code →
        </Button>
      </form>

      <p className="mt-4 text-center text-xs" style={{ color: "var(--muted)" }}>
        No credit card required to start the 14-day Free Trial.
      </p>
    </div>
  );
}