// src/demos/taxai-wizard/screens/PersonalInfo.tsx
//
// Step 3 of the Wizard onboarding — personal info form.
// Mock state only; submit jumps to /plans via setDemoHash.

import { useState, type FormEvent } from "react";
import { Button } from "@/demos/_shared/Button";
import { Field } from "@/demos/_shared/Field";
import { setDemoHash } from "@/demos/router";

export function PersonalInfo() {
  const [form, setForm] = useState({ name: "", email: "", password: "", jobTitle: "" });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setDemoHash("taxai-wizard", "plans");
  };

  return (
    <div className="mx-auto max-w-md px-6 py-10">
      <h2 className="text-2xl font-semibold tracking-tight">Tell us about you</h2>
      <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
        Start your 14-day Free Trial. No credit card required.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <Field
          label="Full name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Sara Al-Mansouri"
        />
        <Field
          label="Work email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="you@company.ae"
        />
        <Field
          label="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="At least 8 characters"
        />
        <Field
          label="Job title"
          value={form.jobTitle}
          onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
          placeholder="Tax consultant"
        />

        <Button type="submit" variant="primary" className="mt-2 w-full">
          Continue to plans →
        </Button>
      </form>

      <p className="mt-4 text-center text-xs" style={{ color: "var(--muted)" }}>
        By continuing you agree to the Terms of Service and Privacy Policy.
      </p>
    </div>
  );
}
