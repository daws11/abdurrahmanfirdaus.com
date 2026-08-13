// src/demos/taxai-wizard/index.tsx
//
// Top-level shell for TaxAI Wizard. Wraps `Shell`, mounts a stepper-style
// sidebar nav (numbered, with completed-state checkmarks + active accent)
// and switches on `sub` across 7 onboarding screens.

import { Shell } from "@/demos/_shared/Shell";
import { Stepper } from "@/demos/_shared/Stepper";
import { useTheme } from "@/demos/_shared/useTheme";
import { setDemoHash } from "@/demos/router";
import type { DemoTheme } from "@/demos/_shared/theme";
import { TAXAI_WIZARD_SCREENS, getScreenLabel } from "./routes";
import { EmailStep } from "./screens/EmailStep";
import { OtpStep } from "./screens/OtpStep";
import { PersonalInfo } from "./screens/PersonalInfo";
import { Plans } from "./screens/Plans";
import { Checkout } from "./screens/Checkout";
import { SuccessStep } from "./screens/SuccessStep";
import { Dashboard } from "./screens/Dashboard";

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
        return <EmailStep />;
      case "otp":
        return <OtpStep />;
      case "register":
        return <PersonalInfo />;
      case "plans":
        return <Plans />;
      case "checkout":
        return <Checkout />;
      case "success":
        return <SuccessStep />;
      case "dashboard":
        return <Dashboard />;
    }
  })();

  return (
    <Shell theme={theme} nav={nav}>
      {content}
    </Shell>
  );
}