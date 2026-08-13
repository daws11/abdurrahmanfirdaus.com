// src/demos/taxai-wizard/routes.tsx
//
// TaxAI Wizard sub-routes: register (default) → plans → checkout → dashboard.

export type TaxaiWizardScreen = "register" | "plans" | "checkout" | "dashboard";

export const TAXAI_WIZARD_SCREENS: { id: TaxaiWizardScreen; label: string }[] = [
  { id: "register", label: "Register" },
  { id: "plans", label: "Plans" },
  { id: "checkout", label: "Checkout" },
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
