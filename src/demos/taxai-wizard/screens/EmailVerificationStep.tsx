// src/demos/taxai-wizard/screens/EmailVerificationStep.tsx
//
// Step 2 of the Wizard onboarding — email-link verification. Mirrors
// production EmailVerificationStep from tax-ai-wizard-web-70 (without the
// actual /auth/check-verification polling — we synthesize the "verified"
// state with a manual "I've verified — continue" CTA and a 60s resend
// cooldown timer).

import { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/demos/_shared/Button";
import { StepCard, StepCardHeader, StepCardContent, StepCardTitle, StepCardDescription } from "./StepCard";
import { setDemoHash } from "@/demos/router";

const COOLDOWN_SECONDS = 60;

export function EmailVerificationStep() {
  const [email, setEmail] = useState("");
  const [cooldown, setCooldown] = useState(COOLDOWN_SECONDS);

  useEffect(() => {
    setEmail(sessionStorage.getItem("taxai-wizard-email") || "your.email@company.com");
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResend = () => {
    if (cooldown > 0) return;
    setCooldown(COOLDOWN_SECONDS);
  };

  const handleContinue = () => setDemoHash("taxai-wizard", "personal-info");

  return (
    <StepCard>
      <StepCardHeader>
        <div className="flex justify-center mb-4">
          <Mail className="w-12 h-12" style={{ color: "var(--accent)" }} />
        </div>
        <StepCardTitle>Verify Your Email</StepCardTitle>
        <StepCardDescription>
          We've sent a verification link to <strong>{email}</strong>
        </StepCardDescription>
      </StepCardHeader>
      <StepCardContent>
        <div className="space-y-4">
          <div
            className="rounded-md p-4 text-sm"
            style={{
              backgroundColor: "color-mix(in srgb, var(--accent) 8%, transparent)",
              color: "color-mix(in srgb, var(--accent) 80%, var(--fg))",
            }}
          >
            Please check your email and click the verification link to continue.
          </div>

          <Button
            onClick={handleResend}
            variant="secondary"
            className="w-full"
            disabled={cooldown > 0}
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend Verification Email"}
          </Button>

          <div className="text-center text-xs" style={{ color: "var(--muted)" }}>
            Didn't get it? Check spam or wait for the timer.
          </div>

          <Button
            onClick={handleContinue}
            variant="primary"
            className="w-full"
          >
            I've verified — continue →
          </Button>
        </div>
      </StepCardContent>
    </StepCard>
  );
}
