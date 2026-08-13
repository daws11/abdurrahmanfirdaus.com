// src/demos/taxai-wizard/routes.tsx
//
// TaxAI Wizard sub-routes: email → otp → register (personal info) → plans →
// checkout → success → dashboard. The 7-step onboarding funnel mirrors
// production tax-ai-wizard-web-70 (EmailInputStep → EmailVerificationStep →
// PersonalInfoStep → PlanSelectionStep → CheckoutStep → SuccessStep →
// Dashboard).

export type TaxaiWizardScreen =
  | "email"
  | "otp"
  | "register"
  | "plans"
  | "checkout"
  | "success"
  | "dashboard";

export const TAXAI_WIZARD_SCREENS: { id: TaxaiWizardScreen; label: string }[] = [
  { id: "email", label: "Email" },
  { id: "otp", label: "Verification" },
  { id: "register", label: "Personal info" },
  { id: "plans", label: "Plans" },
  { id: "checkout", label: "Checkout" },
  { id: "success", label: "Welcome" },
  { id: "dashboard", label: "Dashboard" },
];

export function getScreenLabel(
  sub: string | null,
  fallback: TaxaiWizardScreen,
): TaxaiWizardScreen {
  if (!sub) return fallback;
  const found = TAXAI_WIZARD_SCREENS.find((s) => s.id === sub);
  return (found?.id ?? fallback) as TaxaiWizardScreen;
}