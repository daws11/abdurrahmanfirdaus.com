# Sub-project B — TaxAI Wizard 99% Fidelity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the TaxAI Wizard portfolio demo to 99% match the production `tax-ai-wizard-web-70` UI: 6-step funnel (email-input → email-verification → personal-info → plan-selection → payment → success), production-style Personal Info form (5 fields + 2 checkboxes + validation summary), 3-col plan grid with Trial/Monthly/Quarterly/Yearly, Stripe Elements look on Checkout, CheckCircle Success card.

**Architecture:** Drop synthetic "dashboard" + "OTP" steps. Replace with production's email-link verification (resend cooldown timer, "I've verified — continue" CTA) and PersonalInfoStep structure (2-col First/Last grid, Role Select with 5 options, Password × 2 with Eye toggle, 2 Checkboxes, Validation Summary). Local `StepCard` shim wraps content in Card/Header/Content layout matching shadcn. Shared `<Stepper>` from `_shared/Stepper.tsx` (already wired in iteration 2) handles the sidebar; 6 entries instead of 7.

**Tech Stack:** Vite + React 19 + TypeScript, Tailwind v4, lucide-react, framer-motion (not used in demo), shadcn new-york primitives (`Shell`, `Field`, `Button`, `Badge`, `StatTile`), existing `<Stepper>` from `src/demos/_shared/Stepper.tsx`.

---

## File Structure

### Files to create

- `src/demos/taxai-wizard/screens/StepCard.tsx` — local Card/Header/Content/Title/Description shim.
- `src/demos/taxai-wizard/screens/EmailInputStep.tsx` — Step 1.
- `src/demos/taxai-wizard/screens/EmailVerificationStep.tsx` — Step 2.
- `src/demos/taxai-wizard/screens/PersonalInfoStep.tsx` — Step 3.
- `src/demos/taxai-wizard/screens/PlanSelectionStep.tsx` — Step 4.
- `src/demos/taxai-wizard/screens/CheckoutStep.tsx` — Step 5.
- `src/demos/taxai-wizard/screens/SuccessStep.tsx` — Step 6.

### Files to modify

- `src/demos/taxai-wizard/routes.tsx` — 6-screen union (replace 7-screen one).
- `src/demos/taxai-wizard/index.tsx` — switch covers 6 cases.
- `src/demos/taxai-wizard/mocks.ts` — 4 plans (Trial/Monthly/Quarterly/Yearly) + feature lists.

### Files to delete

- `src/demos/taxai-wizard/screens/EmailStep.tsx` (iteration 2's EmailStep)
- `src/demos/taxai-wizard/screens/OtpStep.tsx`
- `src/demos/taxai-wizard/screens/PersonalInfo.tsx` (iteration 2's renamed Register.tsx)
- `src/demos/taxai-wizard/screens/Plans.tsx`
- `src/demos/taxai-wizard/screens/Checkout.tsx`
- `src/demos/taxai-wizard/screens/SuccessStep.tsx` (iteration 2's; replaced by new file with same name)
- `src/demos/taxai-wizard/screens/Dashboard.tsx`

---

## Task 1: StepCard shim + routes + mocks (foundation)

**Files:**
- Create: `src/demos/taxai-wizard/screens/StepCard.tsx`
- Modify: `src/demos/taxai-wizard/routes.tsx`
- Modify: `src/demos/taxai-wizard/mocks.ts`

- [ ] **Step 1: Create `StepCard.tsx`**

Local shim mirroring shadcn Card layout (since portfolio doesn't use shadcn Card primitives — uses `Shell` + content). Provides `StepCard`, `StepCardHeader`, `StepCardContent`, `StepCardTitle`, `StepCardDescription` for consistent layout across the 6 screens.

Create `src/demos/taxai-wizard/screens/StepCard.tsx`:

```tsx
// src/demos/taxai-wizard/screens/StepCard.tsx
//
// Local Card shim mirroring shadcn Card layout. Provides consistent
// backdrop-blur, border, padding, and text alignment across the 6 wizard
// screens. Maps production's `backdrop-blur-md bg-white/20 border shadow-sm`
// to theme tokens.

import type { ReactNode } from "react";

export function StepCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`w-full max-w-md rounded-lg border shadow-sm backdrop-blur-md ${className}`}
      style={{
        backgroundColor: "color-mix(in srgb, var(--surface) 80%, transparent)",
        borderColor: "var(--border)",
      }}
    >
      {children}
    </div>
  );
}

export function StepCardHeader({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`px-6 pt-6 pb-2 text-center ${className}`}>{children}</div>;
}

export function StepCardContent({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`px-6 pb-6 ${className}`}>{children}</div>;
}

export function StepCardTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-2xl font-bold tracking-tight" style={{ color: "var(--fg)" }}>
      {children}
    </h2>
  );
}

export function StepCardDescription({ children }: { children: ReactNode }) {
  return (
    <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
      {children}
    </p>
  );
}
```

- [ ] **Step 2: Update `routes.tsx` to 6-screen union**

Replace the entire content of `src/demos/taxai-wizard/routes.tsx` with:

```ts
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
```

- [ ] **Step 3: Update `mocks.ts` PLANS to production's 4 plans**

Replace the `PLANS` const in `src/demos/taxai-wizard/mocks.ts` with production's 4 plans. Read the current `mocks.ts` first to find the exact block.

New `PLANS`:

```ts
export interface Plan {
  id: "trial" | "monthly" | "quarterly" | "yearly";
  name: string;
  priceUsd: number;
  interval: "14 days" | "month" | "quarter" | "year";
  messageQuota: number;
  features: string[];
  description: string;
  highlighted?: boolean;
  /** Trial plans skip Checkout → jump directly to Success. */
  isTrial?: boolean;
}

export const PLANS: Plan[] = [
  {
    id: "trial",
    name: "Free Trial",
    priceUsd: 0,
    interval: "14 days",
    messageQuota: 10,
    description: "Try all features for 14 days",
    features: [
      "Up to 10 messages",
      "No credit card required",
      "1 user",
      "1 device",
      "Bilingual support (EN/AR)",
    ],
    isTrial: true,
  },
  {
    id: "monthly",
    name: "Monthly Plan",
    priceUsd: 99,
    interval: "month",
    messageQuota: 100,
    description: "Ideal for business owners, freelancers, tax advisors, accountants, and finance professionals.",
    features: [
      "100 AI-powered messages per month",
      "UAE Tax Coverage (VAT/Corporate/Excise)",
      "Priority email support",
      "1 user",
      "1 device",
    ],
  },
  {
    id: "quarterly",
    name: "Quarterly Plan",
    priceUsd: 250,
    interval: "quarter",
    messageQuota: 300,
    description: "Best for professionals who want consistent tax advisory access with savings.",
    features: [
      "300 messages total over 3 months",
      "Standard support",
      "1-2 users",
      "2 devices",
      "Monthly tax digest",
    ],
    highlighted: true,
  },
  {
    id: "yearly",
    name: "Yearly Plan",
    priceUsd: 899,
    interval: "year",
    messageQuota: 1200,
    description: "For users committed to long-term support and deeper features, with the best value.",
    features: [
      "1,200 messages per year (averaging 100/month)",
      "Priority email support",
      "Early access to new features",
      "Onboarding session included",
      "3+ users",
      "3 devices",
    ],
  },
];
```

Keep the existing `SAMPLE_USER` and `SAMPLE_SUBSCRIPTION` exports — `SAMPLE_SUBSCRIPTION` will be used in the Success screen's "Valid Until" calculation.

- [ ] **Step 4: Typecheck foundation**

```bash
npx tsc --noEmit -p tsconfig.app.json
```

Expected: errors only for files that import the old screens (EmailStep/OtpStep/PersonalInfo/Plans/Checkout/SuccessStep/Dashboard). Those will be deleted in Task 7.

If the only errors are "module not found" for the about-to-be-deleted files, that's expected. Continue.

- [ ] **Step 5: Commit foundation**

```bash
git add src/demos/taxai-wizard/screens/StepCard.tsx src/demos/taxai-wizard/routes.tsx src/demos/taxai-wizard/mocks.ts
git commit -m "feat(taxai-wizard): foundation for production-fidelity rewrite — StepCard shim, 6-screen routes, 4 plans"
```

---

## Task 2: EmailInputStep + EmailVerificationStep (steps 1-2)

**Files:**
- Create: `src/demos/taxai-wizard/screens/EmailInputStep.tsx`
- Create: `src/demos/taxai-wizard/screens/EmailVerificationStep.tsx`

- [ ] **Step 1: Create `EmailInputStep.tsx`**

Create `src/demos/taxai-wizard/screens/EmailInputStep.tsx`:

```tsx
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
      sessionStorage.setItem("taxai-wizard-email", email);
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
```

- [ ] **Step 2: Create `EmailVerificationStep.tsx`**

Create `src/demos/taxai-wizard/screens/EmailVerificationStep.tsx`:

```tsx
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
  const [emailSent, setEmailSent] = useState(true);

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
    setEmailSent(true);
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
          We've sent a verification link to <strong style={{ color: "var(--fg)" }}>{email}</strong>
        </StepCardDescription>
      </StepCardHeader>
      <StepCardContent>
        <div className="space-y-4">
          <div
            className="rounded-lg p-4 text-sm"
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
```

- [ ] **Step 3: Typecheck**

```bash
npx tsc --noEmit -p tsconfig.app.json
```

Expected: errors still only for the obsolete screens (still imported by `index.tsx`). Will resolve in Task 6 (router) and Task 7 (delete).

- [ ] **Step 4: Commit**

```bash
git add src/demos/taxai-wizard/screens/EmailInputStep.tsx src/demos/taxai-wizard/screens/EmailVerificationStep.tsx
git commit -m "feat(taxai-wizard): EmailInput + EmailVerification steps matching production"
```

---

## Task 3: PersonalInfoStep (step 3)

**Files:**
- Create: `src/demos/taxai-wizard/screens/PersonalInfoStep.tsx`

- [ ] **Step 1: Create `PersonalInfoStep.tsx`**

Create `src/demos/taxai-wizard/screens/PersonalInfoStep.tsx`:

```tsx
// src/demos/taxai-wizard/screens/PersonalInfoStep.tsx
//
// Step 3 of the Wizard onboarding — personal info form. Mirrors production
// PersonalInfoStep from tax-ai-wizard-web-70: 2-col First/Last grid + Role
// Select (5 options) + Password × 2 with Eye/EyeOff toggle + 2 Checkboxes
// (Disclaimer + Privacy) + Validation Summary with red ✗ / green ✓
// indicators per required field.

import { useState, type FormEvent } from "react";
import { User, Eye, EyeOff, Check, X } from "lucide-react";
import { Button } from "@/demos/_shared/Button";
import { Field } from "@/demos/_shared/Field";
import { StepCard, StepCardHeader, StepCardContent, StepCardTitle, StepCardDescription } from "./StepCard";
import { setDemoHash } from "@/demos/router";

const ROLES = [
  { value: "tax-consultant", label: "Tax Consultant" },
  { value: "business-owner", label: "Business Owner" },
  { value: "lawyer", label: "Lawyer" },
  { value: "auditor", label: "Auditor" },
  { value: "accountant", label: "Accountant" },
];

export function PersonalInfoStep() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [disclaimerAgreed, setDisclaimerAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);

  const isFormValid =
    !!firstName && !!lastName && !!role && !!password && !!confirmPassword &&
    disclaimerAgreed && privacyAgreed;

  const fieldValidations = {
    "First Name": !!firstName,
    "Last Name": !!lastName,
    Role: !!role,
    Password: !!password,
    "Confirm Password": !!confirmPassword,
    "Terms & Conditions": disclaimerAgreed,
    "Privacy Policy": privacyAgreed,
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setDemoHash("taxai-wizard", "plans");
  };

  const indicator = (ok: boolean) =>
    ok ? (
      <Check className="inline h-3 w-3 mr-1" style={{ color: "var(--ok)" }} />
    ) : (
      <X className="inline h-3 w-3 mr-1" style={{ color: "var(--bad)" }} />
    );

  return (
    <StepCard className="max-w-lg">
      <StepCardHeader>
        <div className="flex justify-center mb-4">
          <User className="w-12 h-12" style={{ color: "var(--accent)" }} />
        </div>
        <StepCardTitle>Complete Your Profile</StepCardTitle>
        <StepCardDescription>
          Please provide your personal information to complete registration.
        </StepCardDescription>
      </StepCardHeader>
      <StepCardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          {/* First + Last Name grid */}
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="First Name"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <Field
              label="Last Name"
              placeholder="Enter your last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          {/* Role Select */}
          <div>
            <label
              className="block mb-1 text-[11px] font-medium uppercase tracking-wider"
              style={{ color: "var(--muted)" }}
            >
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="w-full rounded-sm border bg-transparent px-3 py-1.5 text-sm focus:outline-none focus:ring-1"
              style={{
                height: 36,
                borderColor: "var(--border)",
                color: "var(--fg)",
              }}
            >
              <option value="">Select your role</option>
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Password + Confirm Password */}
          <div>
            <label
              className="block mb-1 text-[11px] font-medium uppercase tracking-wider"
              style={{ color: "var(--muted)" }}
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
                className="w-full rounded-sm border bg-transparent px-3 py-1.5 pr-10 text-sm focus:outline-none focus:ring-1"
                style={{ height: 36, borderColor: "var(--border)", color: "var(--fg)" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" style={{ color: "var(--muted)" }} />
                ) : (
                  <Eye className="h-4 w-4" style={{ color: "var(--muted)" }} />
                )}
              </button>
            </div>
          </div>

          <div>
            <label
              className="block mb-1 text-[11px] font-medium uppercase tracking-wider"
              style={{ color: "var(--muted)" }}
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                className="w-full rounded-sm border bg-transparent px-3 py-1.5 pr-10 text-sm focus:outline-none focus:ring-1"
                style={{ height: 36, borderColor: "var(--border)", color: "var(--fg)" }}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((s) => !s)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? (
                  <EyeOff className="h-4 w-4" style={{ color: "var(--muted)" }} />
                ) : (
                  <Eye className="h-4 w-4" style={{ color: "var(--muted)" }} />
                )}
              </button>
            </div>
          </div>

          {/* Disclaimer Checkbox */}
          <div className="flex items-start space-x-3 pt-2">
            <input
              type="checkbox"
              id="disclaimer"
              checked={disclaimerAgreed}
              onChange={(e) => setDisclaimerAgreed(e.target.checked)}
              className="mt-1 h-4 w-4 rounded-sm border"
              style={{ borderColor: "var(--border)", accentColor: "var(--accent)" }}
            />
            <div className="flex-1">
              <label htmlFor="disclaimer" className="text-sm font-medium cursor-pointer" style={{ color: "var(--fg)" }}>
                Terms & Conditions
              </label>
              <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                By registering, you acknowledge and agree to our{" "}
                <a href="#/disclaimer" target="_blank" rel="noopener noreferrer" className="font-medium underline" style={{ color: "var(--accent)" }}>
                  Disclaimer
                </a>{" "}
                and{" "}
                <a href="#/privacy" target="_blank" rel="noopener noreferrer" className="font-medium underline" style={{ color: "var(--accent)" }}>
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </div>

          {/* Privacy Checkbox */}
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="privacy"
              checked={privacyAgreed}
              onChange={(e) => setPrivacyAgreed(e.target.checked)}
              className="mt-1 h-4 w-4 rounded-sm border"
              style={{ borderColor: "var(--border)", accentColor: "var(--accent)" }}
            />
            <div className="flex-1">
              <label htmlFor="privacy" className="text-sm font-medium cursor-pointer" style={{ color: "var(--fg)" }}>
                Privacy Policy
              </label>
              <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                I agree to the processing of my personal data in accordance with the Privacy Policy.
              </p>
            </div>
          </div>

          {/* Validation Summary */}
          <div
            className="rounded-md p-3 text-xs space-y-1"
            style={{
              backgroundColor: "color-mix(in srgb, var(--surface) 50%, transparent)",
              color: "var(--muted)",
            }}
          >
            <p className="font-medium mb-1" style={{ color: "var(--fg)" }}>Required fields:</p>
            <div className="grid grid-cols-2 gap-1.5">
              {Object.entries(fieldValidations).map(([label, ok]) => (
                <span
                  key={label}
                  style={{ color: ok ? "var(--ok)" : "var(--bad)" }}
                >
                  {indicator(ok)} {label}
                </span>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={!isFormValid}
          >
            Continue to Plans →
          </Button>
        </form>
      </StepCardContent>
    </StepCard>
  );
}
```

- [ ] **Step 2: Typecheck**

```bash
npx tsc --noEmit -p tsconfig.app.json
```

Expected: errors still only for obsolete screens.

- [ ] **Step 3: Commit**

```bash
git add src/demos/taxai-wizard/screens/PersonalInfoStep.tsx
git commit -m "feat(taxai-wizard): PersonalInfoStep with 5 fields + 2 checkboxes + validation summary"
```

---

## Task 4: PlanSelectionStep (step 4)

**Files:**
- Create: `src/demos/taxai-wizard/screens/PlanSelectionStep.tsx`

- [ ] **Step 1: Create `PlanSelectionStep.tsx`**

Create `src/demos/taxai-wizard/screens/PlanSelectionStep.tsx`:

```tsx
// src/demos/taxai-wizard/screens/PlanSelectionStep.tsx
//
// Step 4 of the Wizard onboarding — 4-plan grid (Trial/Monthly/Quarterly/
// Yearly). Mirrors production PlanSelectionStep from tax-ai-wizard-web-70:
// 3-col responsive grid, hover scale-105, "Most Popular" badge on Quarterly.
// Trial plan skips Checkout → goes directly to Success.

import { CreditCard, Check } from "lucide-react";
import { Badge } from "@/demos/_shared/Badge";
import { StepCard, StepCardContent, StepCardHeader, StepCardTitle, StepCardDescription } from "./StepCard";
import { PLANS } from "../mocks";
import { setDemoHash } from "@/demos/router";

export function PlanSelectionStep() {
  return (
    <div className="w-full max-w-5xl">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-3">
          <CreditCard className="w-12 h-12" style={{ color: "var(--accent)" }} />
        </div>
        <StepCardTitle>Choose Your Plan</StepCardTitle>
        <StepCardDescription>
          Choose your plan and start chatting with our AI tax assistant immediately.
        </StepCardDescription>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {PLANS.map((plan, index) => {
          const isSelected = index === 0; // ponytail: highlight first by default for visual demo
          return (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-lg border shadow-sm backdrop-blur-md transition-all hover:shadow-md hover:scale-[1.02] ${
                isSelected ? "ring-2" : ""
              }`}
              style={{
                backgroundColor: "color-mix(in srgb, var(--surface) 80%, transparent)",
                borderColor: plan.highlighted ? "var(--accent)" : "var(--border)",
                boxShadow: isSelected ? "0 0 0 2px var(--accent)" : undefined,
              }}
            >
              {plan.highlighted && (
                <Badge tone="accent" className="absolute -top-2 left-3 text-[10px] uppercase tracking-wider font-semibold">
                  Most Popular
                </Badge>
              )}
              <StepCardHeader className="text-left pb-0">
                <h3 className="text-xl font-semibold" style={{ color: "var(--fg)" }}>{plan.name}</h3>
                <div className="flex items-baseline gap-1.5 mt-2">
                  <span className="text-3xl font-bold" style={{ color: "var(--fg)" }}>
                    ${plan.priceUsd}
                  </span>
                  <span className="text-sm" style={{ color: "var(--muted)" }}>
                    /{plan.interval}
                  </span>
                </div>
                <p className="text-xs mt-2 min-h-[40px]" style={{ color: "var(--muted)" }}>
                  {plan.description}
                </p>
              </StepCardHeader>
              <StepCardContent className="flex-1 pt-2">
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-xs" style={{ color: "var(--muted)" }}>
                      <Check className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "var(--ok)" }} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </StepCardContent>
              <div className="px-6 pb-6 pt-2 mt-auto">
                <button
                  type="button"
                  onClick={() => {
                    sessionStorage.setItem("taxai-wizard-plan", plan.name);
                    if (plan.isTrial) {
                      setDemoHash("taxai-wizard", "success");
                    } else {
                      setDemoHash("taxai-wizard", "checkout");
                    }
                  }}
                  className="w-full rounded-md h-10 text-sm font-semibold transition-opacity hover:opacity-90"
                  style={{
                    backgroundColor: plan.highlighted ? "var(--accent)" : "var(--surface)",
                    color: plan.highlighted ? "var(--accent-fg)" : "var(--fg)",
                    border: plan.highlighted ? "none" : "1px solid var(--border)",
                  }}
                >
                  {plan.priceUsd === 0 ? "Start Free Trial" : "Subscribe"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-center text-xs mt-8" style={{ color: "var(--muted)" }}>
        All plans include our comprehensive AI tax assistant and guidance. No credit card required for free trial.
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

```bash
npx tsc --noEmit -p tsconfig.app.json
```

Expected: errors only for obsolete screens.

- [ ] **Step 3: Commit**

```bash
git add src/demos/taxai-wizard/screens/PlanSelectionStep.tsx
git commit -m "feat(taxai-wizard): PlanSelectionStep with 3-col grid + 4 production plans"
```

---

## Task 5: CheckoutStep + SuccessStep (steps 5-6)

**Files:**
- Create: `src/demos/taxai-wizard/screens/CheckoutStep.tsx`
- Create: `src/demos/taxai-wizard/screens/SuccessStep.tsx`

- [ ] **Step 1: Create `CheckoutStep.tsx`**

Create `src/demos/taxai-wizard/screens/CheckoutStep.tsx`:

```tsx
// src/demos/taxai-wizard/screens/CheckoutStep.tsx
//
// Step 5 of the Wizard onboarding — Stripe Elements-style payment UI.
// Re-implements production PaymentForm from tax-ai-wizard-web-70: card form
// (4242 defaultValue + Lock icon) + order summary (plan + VAT 5% + total).
// No real Stripe integration.

import { CreditCard, Lock } from "lucide-react";
import { Button } from "@/demos/_shared/Button";
import { Field } from "@/demos/_shared/Field";
import { setDemoHash } from "@/demos/router";
import { PLANS, SAMPLE_USER } from "../mocks";

export function CheckoutStep() {
  // ponytail: hardcode Quarterly for visual demo (matches production default)
  const planName = sessionStorage.getItem("taxai-wizard-plan") || "Quarterly Plan";
  const plan = PLANS.find((p) => p.name === planName) ?? PLANS.find((p) => p.id === "quarterly")!;
  const vatAmount = (plan.priceUsd * 0.05).toFixed(2);
  const total = (plan.priceUsd * 1.05).toFixed(2);

  const onPay = () => {
    sessionStorage.setItem("taxai-wizard-plan", plan.name);
    setDemoHash("taxai-wizard", "success");
  };

  return (
    <div className="w-full max-w-4xl">
      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div
          className="rounded-lg border p-6 shadow-sm backdrop-blur-md"
          style={{
            backgroundColor: "color-mix(in srgb, var(--surface) 80%, transparent)",
            borderColor: "var(--border)",
          }}
        >
          <h3 className="flex items-center gap-2 text-base font-semibold" style={{ color: "var(--fg)" }}>
            <CreditCard className="h-4 w-4" /> Payment details
          </h3>
          <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
            Powered by Stripe. Your card is encrypted on submit.
          </p>

          <div className="mt-6 space-y-4">
            <Field label="Card number" defaultValue="4242 4242 4242 4242" placeholder="1234 1234 1234 1234" />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Expiry" defaultValue="12 / 28" placeholder="MM / YY" />
              <Field label="CVC" defaultValue="123" placeholder="123" />
            </div>
            <Field label="Name on card" defaultValue={SAMPLE_USER.name} placeholder="Full name" />
          </div>

          <Button type="button" variant="primary" className="mt-6 w-full" onClick={onPay}>
            <Lock className="h-4 w-4" /> Pay ${total}
          </Button>
        </div>

        <div
          className="rounded-lg border p-6 shadow-sm backdrop-blur-md"
          style={{
            backgroundColor: "color-mix(in srgb, var(--surface) 80%, transparent)",
            borderColor: "var(--border)",
          }}
        >
          <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
            Order summary
          </h3>
          <div className="mt-4 space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-sm" style={{ color: "var(--fg)" }}>{plan.name}</span>
              <span className="text-sm font-medium" style={{ color: "var(--fg)" }}>${plan.priceUsd}.00</span>
            </div>
            <div className="flex items-baseline justify-between text-xs" style={{ color: "var(--muted)" }}>
              <span>VAT (5%, UAE)</span>
              <span>${vatAmount}</span>
            </div>
            <div
              className="flex items-baseline justify-between border-t pt-2"
              style={{ borderColor: "var(--border)" }}
            >
              <span className="text-sm font-semibold" style={{ color: "var(--fg)" }}>Total</span>
              <span className="text-base font-semibold" style={{ color: "var(--fg)" }}>${total}</span>
            </div>
          </div>
          <p className="mt-4 text-xs" style={{ color: "var(--muted)" }}>
            Renews automatically each {plan.interval}. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `SuccessStep.tsx`**

Create `src/demos/taxai-wizard/screens/SuccessStep.tsx`:

```tsx
// src/demos/taxai-wizard/screens/SuccessStep.tsx
//
// Step 6 of the Wizard onboarding — post-payment welcome card. Mirrors
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
  const plan = PLANS.find((p) => p.name === planName) ?? PLANS[0];

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
            className="rounded-lg p-4 text-sm"
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
```

Note: `setDemoHash(null)` from `src/demos/router.tsx` already routes to `#/demos` (hub). This avoids the cross-app redirect to chat.taxai.

- [ ] **Step 3: Typecheck**

```bash
npx tsc --noEmit -p tsconfig.app.json
```

Expected: errors only for obsolete screens.

- [ ] **Step 4: Commit**

```bash
git add src/demos/taxai-wizard/screens/CheckoutStep.tsx src/demos/taxai-wizard/screens/SuccessStep.tsx
git commit -m "feat(taxai-wizard): CheckoutStep (Stripe look) + SuccessStep (Account Details box)"
```

---

## Task 6: Update index.tsx + routes.tsx + delete obsolete screens

**Files:**
- Modify: `src/demos/taxai-wizard/index.tsx`
- Modify: `src/demos/taxai-wizard/routes.tsx`
- Delete: 7 obsolete screen files

- [ ] **Step 1: Verify routes.tsx already updated (Task 1 Step 2)**

Read `src/demos/taxai-wizard/routes.tsx` and confirm it has the 6-screen union. If not, apply the Task 1 Step 2 content.

- [ ] **Step 2: Replace `index.tsx` to wire all 6 screens**

Replace the entire content of `src/demos/taxai-wizard/index.tsx` with:

```tsx
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
  const activeIndex = TAXAI_WIZARD_SCREENS.findIndex((s) => s.id === screen);

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
    }
  })();

  return (
    <Shell theme={theme} nav={nav}>
      {content}
    </Shell>
  );
}
```

Verify the `Stepper` component exists at `src/demos/_shared/Stepper.tsx`. If not, fall back to the inline stepper that was used in iteration 2 (Task 2 Step 6 fallback).

- [ ] **Step 3: Delete obsolete screens**

```bash
cd /Users/yanuar/Documents/abdurrahmanfirdaus.com
git rm src/demos/taxai-wizard/screens/EmailStep.tsx \
        src/demos/taxai-wizard/screens/OtpStep.tsx \
        src/demos/taxai-wizard/screens/PersonalInfo.tsx \
        src/demos/taxai-wizard/screens/Plans.tsx \
        src/demos/taxai-wizard/screens/Checkout.tsx \
        src/demos/taxai-wizard/screens/SuccessStep.tsx \
        src/demos/taxai-wizard/screens/Dashboard.tsx
```

Verify the `screens/` directory now contains only:

```
StepCard.tsx
EmailInputStep.tsx
EmailVerificationStep.tsx
PersonalInfoStep.tsx
PlanSelectionStep.tsx
CheckoutStep.tsx
SuccessStep.tsx
```

Expected output: 7 files listed.

- [ ] **Step 4: Typecheck full project**

```bash
npx tsc --noEmit -p tsconfig.app.json
```

Expected: clean (no errors).

- [ ] **Step 5: Production build**

```bash
npm run build 2>&1 | tail -25
```

Expected: clean build, no chunk-graph regressions. Verify that `demo-taxai-wizard` chunk is emitted.

- [ ] **Step 6: Commit wiring + cleanup**

```bash
git add src/demos/taxai-wizard/index.tsx src/demos/taxai-wizard/routes.tsx
git add -u src/demos/taxai-wizard/screens/
git commit -m "feat(taxai-wizard): wire 6 screens + delete obsolete 7"
```

---

## Task 7: Smoke test + README update

**Files:**
- Modify: `src/demos/taxai-wizard/README.md`

- [ ] **Step 1: Start dev server on port 3001**

```bash
cd /Users/yanuar/Documents/abdurrahmanfirdaus.com
npm run dev -- --port 3001 > /tmp/vite-3001.log 2>&1 &
```

If port 3001 is in use, try 3002.

Wait for ready:

```bash
for i in 1 2 3 4 5 6 7 8 9 10; do
  if curl -sf http://localhost:3001/ > /dev/null 2>&1; then
    echo "ready"; break
  fi
  sleep 0.5
done
```

- [ ] **Step 2: Manual smoke check**

In a browser at `http://localhost:3001/`:

- [ ] **2a.** Click "See more projects" → `#/demos`. Click TaxAI Wizard → `#/demos/taxai-wizard/email`.
- [ ] **2b.** Step 1: Mail icon + "Enter Your Work Email" + email input. Enter `test@example.com` → Continue → advances to Step 2.
- [ ] **2c.** Step 2: "Verify Your Email" + email shown + blue instruction box + "Resend in 60s" countdown (decrements every second) + "I've verified — continue" primary button. Click continue → advances to Step 3.
- [ ] **2d.** Step 3: 2-col First/Last grid + Role Select with 5 options + Password × 2 with Eye toggle + 2 Checkboxes + Validation Summary with red ✗ on empty fields, green ✓ on filled.
- [ ] **2e.** Fill all fields, tick both checkboxes → button enables. Click → advances to Step 4.
- [ ] **2f.** Step 4: 3-col grid with 4 cards (Free Trial $0, Monthly $99, Quarterly $250 with "Most Popular" badge, Yearly $899). Hover scales up.
- [ ] **2g.** Click Free Trial → advances to Step 6 (skips Step 5). Click Monthly → advances to Step 5.
- [ ] **2h.** Step 5: Stripe Elements look with card 4242 / 12/28 / 123 / Sara Al-Mansouri. Order summary shows plan + VAT 5% + total.
- [ ] **2i.** Click Pay → advances to Step 6.
- [ ] **2j.** Step 6: CheckCircle + Account Details box (Email/Name/Plan/Valid Until) + spinner for 2s + "Continue to Demo Hub" button. Click → returns to `#/demos`.
- [ ] **2k.** Sidebar stepper shows correct active/completed states for the 6 steps throughout the flow.

- [ ] **Step 3: Stop dev server**

```bash
pkill -f "vite.*--port 3001" || true
```

- [ ] **Step 4: Update README**

Update `src/demos/taxai-wizard/README.md` to reflect the 6-step production-aligned flow. Read current README first to match its style. Replace with:

```markdown
# TaxAI Wizard

Six-screen onboarding funnel mirroring production `tax-ai-wizard-web-70`:

**Email → Verification → Personal info → Plans → Checkout → Welcome.**

- **Email**: work email input; advances to verification with a synthetic 300ms "Checking..." delay.
- **Verification**: production-style email-link verification UI — 60s resend cooldown timer, blue instruction box, "I've verified — continue" CTA. No real backend polling.
- **Personal info**: First/Last name grid, Role Select (5 options: Tax Consultant, Business Owner, Lawyer, Auditor, Accountant), Password × 2 with Eye toggle, Disclaimer + Privacy checkboxes, Validation Summary with red ✗ / green ✓ per required field.
- **Plans**: 3-col grid of 4 plans (Trial $0, Monthly $99, Quarterly $250 Most Popular, Yearly $899). Selecting Trial skips Checkout.
- **Checkout**: Stripe Elements-style payment form with card 4242 default, VAT 5% UAE breakdown, order summary.
- **Welcome**: CheckCircle + Account Details box (Email/Name/Plan/Valid Until) + 2s spinner + "Continue to Demo Hub" button.

All data is synthetic; no backend, no real Stripe, no real email verification.
```

- [ ] **Step 5: Commit README**

```bash
git add src/demos/taxai-wizard/README.md
git commit -m "docs(taxai-wizard): update README for 6-step production-aligned flow"
```

- [ ] **Step 6: Final typecheck + build**

```bash
npx tsc --noEmit -p tsconfig.app.json
npm run build 2>&1 | tail -15
```

Expected: both clean.

- [ ] **Step 7: Final commit (if any smoke-test fixes were needed)**

```bash
git status
```

If there are uncommitted edits from the smoke test, commit them:

```bash
git add <files>
git commit -m "fix: smoke test corrections"
```

Otherwise skip.

---

## Self-review

**Spec coverage:**

- §3.1 6-step flow → Task 1 + Task 6 ✓
- §3.2 EmailInputStep → Task 2 Step 1 ✓
- §3.3 EmailVerificationStep → Task 2 Step 2 ✓
- §3.4 PersonalInfoStep (5 fields + 2 checkboxes + validation summary) → Task 3 ✓
- §3.5 PlanSelectionStep (3-col + 4 plans + Trial shortcut) → Task 4 ✓
- §3.6 CheckoutStep (Stripe Elements look) → Task 5 Step 1 ✓
- §3.7 SuccessStep (CheckCircle + Account Details) → Task 5 Step 2 ✓
- §3.8 Visual styling (theme tokens, backdrop-blur) → StepCard shim (Task 1) + per-screen ✓
- §3.9 Stepper wiring → Task 1 Step 2 (routes) + Task 6 Step 2 (Stepper) ✓

**Placeholder scan:** None. Every screen file has actual JSX; every step has concrete code.

**Type consistency:**
- `Plan` interface (Task 1 Step 3) adds `description: string` + `isTrial?: boolean` while keeping `id`/`name`/`priceUsd`/`interval`/`messageQuota`/`features`/`highlighted?` from iteration 2.
- `TaxaiWizardScreen` union (Task 1 Step 2) drops `"otp"` and `"dashboard"` and `"register"` (renamed to `"personal-info"`).
- `Stepper` is imported from `_shared/Stepper.tsx` — verified exists (iteration 2 Task 2 used it).
- `sessionStorage` used for cross-screen state (email + plan name); cleared implicitly when navigating away (browser cleans on tab close).

**Ambiguity check:**
- PersonalInfoStep's Role Select uses native `<select>` (no shadcn Select primitive available in portfolio). Acceptable; production uses shadcn Select which we don't have.
- EmailVerificationStep "I've verified — continue" button is a portfolio-only escape hatch (production polls backend). Documented as such.
- PlanSelectionStep `isSelected = index === 0` (highlight first plan by default) — purely visual. Documented as ponytail.
- SuccessStep "Continue to Demo Hub" navigates to `#/demos` via `setDemoHash(null)` — matches `router.tsx` hub routing.