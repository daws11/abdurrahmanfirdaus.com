// src/demos/taxai-wizard/screens/OtpStep.tsx
//
// Step 2 of the Wizard onboarding — 6-digit OTP input. Mirrors production
// EmailVerificationStep from tax-ai-wizard-web-70. Six single-character
// inputs that auto-advance on type. Submit jumps to /personal-info.

import { useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/demos/_shared/Button";
import { setDemoHash } from "@/demos/router";

const DIGITS = 6;

export function OtpStep() {
  const [digits, setDigits] = useState<string[]>(Array(DIGITS).fill(""));
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const setDigit = (i: number, value: string) => {
    const next = [...digits];
    next[i] = value.slice(-1).replace(/\D/g, "");
    setDigits(next);
    if (next[i] && i < DIGITS - 1) refs.current[i + 1]?.focus();
  };

  const onKey = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const onChange = (i: number, e: ChangeEvent<HTMLInputElement>) => setDigit(i, e.target.value);

  const submit = () => setDemoHash("taxai-wizard", "register");

  return (
    <div className="mx-auto max-w-md px-6 py-10">
      <div
        className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full"
        style={{ backgroundColor: "color-mix(in srgb, var(--accent) 10%, transparent)" }}
      >
        <ShieldCheck className="h-5 w-5" style={{ color: "var(--accent)" }} />
      </div>
      <h2 className="text-center text-2xl font-semibold tracking-tight">Enter the code</h2>
      <p className="mt-2 text-center text-sm" style={{ color: "var(--muted)" }}>
        We sent a 6-digit code to your work email. Enter it below.
      </p>

      <div className="mt-8 flex justify-center gap-2">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={(e) => onChange(i, e)}
            onKeyDown={(e) => onKey(i, e)}
            className="h-12 w-10 rounded-md border bg-transparent text-center text-lg font-semibold focus:outline-none focus:ring-1"
            style={{
              borderColor: "var(--border)",
              color: "var(--fg)",
              boxShadow: "inset 0 0 0 0 transparent",
            }}
          />
        ))}
      </div>

      <Button
        type="button"
        variant="primary"
        className="mt-6 w-full"
        onClick={submit}
        disabled={digits.some((d) => !d)}
      >
        Verify and continue →
      </Button>

      <p className="mt-4 text-center text-xs" style={{ color: "var(--muted)" }}>
        Didn't receive it? <span className="font-medium underline" style={{ color: "var(--accent)" }}>Resend code</span>
      </p>
    </div>
  );
}