// src/demos/taxai-wizard/routes.tsx
//
// TaxAI Wizard sub-routes: email-input → email-verification → personal-info
// → plan-selection → payment → success. The 6-step onboarding funnel mirrors
// production tax-ai-wizard-web-70 (EmailInputStep → EmailVerificationStep →
// PersonalInfoStep → PlanSelectionStep → PaymentForm → SuccessStep).

export type TaxaiWizardScreen =
  | "email"
  | "verification"
  | "personal-info"
  | "plans"
  | "checkout"
  | "success";

export const TAXAI_WIZARD_SCREENS: { id: TaxaiWizardScreen; label: string }[] = [
  { id: "email", label: "Email" },
  { id: "verification", label: "Verification" },
  { id: "personal-info", label: "Personal info" },
  { id: "plans", label: "Plans" },
  { id: "checkout", label: "Checkout" },
  { id: "success", label: "Welcome" },
];

export function getScreenLabel(
  sub: string | null,
  fallback: TaxaiWizardScreen,
): TaxaiWizardScreen {
  if (!sub) return fallback;
  const found = TAXAI_WIZARD_SCREENS.find((s) => s.id === sub);
  return (found?.id ?? fallback) as TaxaiWizardScreen;
}