// src/demos/taxai-wizard/screens/SuccessStep.tsx
//
// Step 6 of the Wizard onboarding — post-onboarding welcome card. Mirrors
// production SuccessStep from tax-ai-wizard-web-70: CheckCircle icon +
// green Account Details box (Email/Name/Plan/Valid Until) + spinner +
// "Continue to Chat" button. In portfolio, the button navigates back to
// DemoHub instead of chat.taxai.

import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/demos/_shared/Button";
import { StepCard, StepCardHeader, StepCardContent, StepCardTitle, StepCardDescription } from "./StepCard";
import { PLANS, SAMPLE_USER } from "../mocks";
import { setDemoHash } from "@/demos/router";

function getEndDate(planName: string): string {
  const start = new Date();
  const end = new Date(start);
  const lower = planName.toLowerCase();
  if (lower.includes("monthly")) end.setMonth(end.getMonth() + 1);
  else if (lower.includes("quarterly")) end.setMonth(end.getMonth() + 3);
  else if (lower.includes("yearly")) end.setFullYear(end.getFullYear() + 1);
  else end.setDate(end.getDate() + 14); // trial
  return end.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export function SuccessStep() {
  const [isProcessing, setIsProcessing] = useState(true);
  const planName = sessionStorage.getItem("taxai-wizard-plan") || "Free Trial";
  const email = sessionStorage.getItem("taxai-wizard-email") || SAMPLE_USER.email;
  const plan = PLANS.find((p) => p.name === planName) ?? PLANS.find((p) => p.isTrial)!;

  useEffect(() => {
    const timer = setTimeout(() => setIsProcessing(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <StepCard>
      <StepCardHeader>
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-12 h-12" style={{ color: "var(--ok)" }} />
        </div>
        <StepCardTitle>Account Created Successfully!</StepCardTitle>
        <StepCardDescription>
          Your account has been created and activated. You can now start using our AI chat service.
        </StepCardDescription>
      </StepCardHeader>
      <StepCardContent>
        <div className="space-y-4">
          <div
            className="rounded-md p-4 text-sm"
            style={{
              backgroundColor: "color-mix(in srgb, var(--ok) 8%, transparent)",
            }}
          >
            <h4 className="font-semibold mb-2" style={{ color: "var(--fg)" }}>Account Details</h4>
            <div className="space-y-1.5">
              <div style={{ color: "var(--fg)" }}><strong style={{ color: "var(--muted)" }}>Email:</strong> {email}</div>
              <div style={{ color: "var(--fg)" }}><strong style={{ color: "var(--muted)" }}>Name:</strong> {SAMPLE_USER.name}</div>
              <div style={{ color: "var(--fg)" }}><strong style={{ color: "var(--muted)" }}>Plan:</strong> {plan.name}</div>
              <div style={{ color: "var(--fg)" }}><strong style={{ color: "var(--muted)" }}>Valid Until:</strong> {getEndDate(plan.name)}</div>
            </div>
          </div>

          {isProcessing && (
            <div className="text-center text-sm flex items-center justify-center gap-2" style={{ color: "var(--muted)" }}>
              <span
                className="inline-block w-4 h-4 border-2 rounded-full animate-spin"
                style={{ borderColor: "var(--border)", borderTopColor: "var(--accent)" }}
              />
              Finalizing your account...
            </div>
          )}

          <Button
            onClick={() => setDemoHash(null)}
            variant="primary"
            className="w-full"
            disabled={isProcessing}
          >
            {isProcessing ? "Setting up your account..." : "Continue to Demo Hub"}
          </Button>
        </div>
      </StepCardContent>
    </StepCard>
  );
}