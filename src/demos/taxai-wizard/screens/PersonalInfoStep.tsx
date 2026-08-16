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
                aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
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
