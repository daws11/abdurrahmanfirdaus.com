// src/demos/taxai-chat/screens/Settings.tsx
//
// Settings page — profile photo placeholder above Name, language detection
// toggle (EN/AR/auto), model picker, and account info. Visual only, no save.

import { Globe, Cpu, User } from "lucide-react";
import { Field } from "@/demos/_shared/Field";
import { SAMPLE_USER, initials } from "../mocks";

export function Settings() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-10 space-y-8">
      {/* Profile photo placeholder */}
      <section className="flex items-center gap-4">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full text-lg font-semibold"
          style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
        >
          {initials}
        </div>
        <div>
          <p className="text-sm font-semibold">{SAMPLE_USER.name}</p>
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            Photo upload is disabled in the prototype.
          </p>
        </div>
      </section>

      <section>
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <Globe className="h-4 w-4" /> Language
        </h3>
        <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
          ChatGPT auto-detects your input language. You can force a specific response language.
        </p>
        <div className="mt-4">
          <Field label="Response language" defaultValue="Auto-detect" />
        </div>
        <div className="mt-3 flex gap-2 text-xs">
          <span className="rounded-full px-3 py-1 font-medium" style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}>
            Auto
          </span>
          <span className="rounded-full border px-3 py-1" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
            English
          </span>
          <span className="rounded-full border px-3 py-1" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
            العربية
          </span>
        </div>
      </section>

      <section>
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <Cpu className="h-4 w-4" /> Model
        </h3>
        <div className="mt-4">
          <Field label="Reasoning model" defaultValue="GPT-4o (default)" />
        </div>
      </section>

      <section>
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <User className="h-4 w-4" /> Account
        </h3>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Field label="Name" defaultValue={SAMPLE_USER.name} />
          <Field label="Email" defaultValue={SAMPLE_USER.email} />
        </div>
      </section>
    </div>
  );
}
