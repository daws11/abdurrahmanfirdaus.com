// src/demos/taxai-wizard/index.tsx
//
// Top-level shell for TaxAI Wizard. Wraps `Shell`, mounts a stepper-style
// sidebar nav (numbered, with completed-state checkmarks + active accent)
// and switches on `sub` across 6 production-aligned onboarding screens.

import { Shell } from "@/demos/_shared/Shell";
import { useTheme } from "@/demos/_shared/useTheme";
import { setDemoHash } from "@/demos/router";
import type { DemoTheme } from "@/demos/_shared/theme";
import { Stepper } from "@/demos/_shared/Stepper";
import { TAXAI_WIZARD_SCREENS, getScreenLabel } from "./routes";
import { EmailInputStep } from "./screens/EmailInputStep";
import { EmailVerificationStep } from "./screens/EmailVerificationStep";
import { PersonalInfoStep } from "./screens/PersonalInfoStep";
import { PlanSelectionStep } from "./screens/PlanSelectionStep";
import { CheckoutStep } from "./screens/CheckoutStep";
import { SuccessStep } from "./screens/SuccessStep";

export function TaxaiWizard({ theme, sub }: { theme: DemoTheme; sub: string | null }) {
  useTheme(theme.id);
  const screen = getScreenLabel(sub, "email");

  const nav = (
    <Stepper
      steps={TAXAI_WIZARD_SCREENS}
      current={screen}
      onSelect={(id) => setDemoHash(theme.id, id)}
    />
  );

  const content = (() => {
    switch (screen) {
      case "email":
        return <EmailInputStep />;
      case "verification":
        return <EmailVerificationStep />;
      case "personal-info":
        return <PersonalInfoStep />;
      case "plans":
        return <PlanSelectionStep />;
      case "checkout":
        return <CheckoutStep />;
      case "success":
        return <SuccessStep />;
      default:
        return <EmailInputStep />;
    }
  })();

  return (
    <Shell theme={theme} nav={nav}>
      {content}
    </Shell>
  );
}
