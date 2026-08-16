// src/demos/taxai-wizard/screens/EmailInputStep.tsx
//
// Step 1 of the Wizard onboarding — work email input. Mirrors production
// EmailInputStep from tax-ai-wizard-web-70. Submit advances to /verification.

import { useState, type FormEvent } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/demos/_shared/Button";
import { Field } from "@/demos/_shared/Field";
import { StepCard, StepCardHeader, StepCardContent, StepCardTitle, StepCardDescription } from "./StepCard";
import { setDemoHash } from "@/demos/router";

export function EmailInputStep() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    // ponytail: synthetic delay to match production's "Checking..." state
    setTimeout(() => {
      sessionStorage.setItem("taxai-wizard-email", email.trim());
      setDemoHash("taxai-wizard", "verification");
    }, 300);
  };

  return (
    <StepCard>
      <StepCardHeader>
        <div className="flex justify-center mb-4">
          <Mail className="w-12 h-12" style={{ color: "var(--accent)" }} />
        </div>
        <StepCardTitle>Enter Your Work Email</StepCardTitle>
        <StepCardDescription>
          We'll send a verification link to your work email address.
        </StepCardDescription>
      </StepCardHeader>
      <StepCardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <Field
            label="Work Email Address"
            type="email"
            placeholder="your.email@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Checking..." : "Continue"}
          </Button>
        </form>
      </StepCardContent>
    </StepCard>
  );
}
