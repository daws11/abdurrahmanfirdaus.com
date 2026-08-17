// src/demos/taxai-chat/screens/Settings.tsx
//
// Settings — language picker (Globe dropdown) + compact Subscription card +
// Model + Account. Mirrors production settings + SubscriptionInfo card.

import { Cpu, User, Crown, Calendar } from "lucide-react";
import { Field } from "@/demos/_shared/Field";
import { LanguageDropdown } from "./LanguageDropdown";
import { TOKEN_QUOTA, SAMPLE_SUBSCRIPTION, SAMPLE_USER, PLANS } from "../mocks";

const plan = PLANS.find((p) => p.id === SAMPLE_SUBSCRIPTION.planId)!;

export function Settings() {
  const pct = Math.round((TOKEN_QUOTA.used / TOKEN_QUOTA.limit) * 100);

  return (
    <div className="mx-auto max-w-2xl px-6 py-10 space-y-8">
      {/* Language */}
      <section>
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          Language
        </h3>
        <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
          Atto detects your input language and responds accordingly. Override for voice output.
        </p>
        <div className="mt-4">
          <LanguageDropdown />
        </div>
      </section>

      {/* Subscription */}
      <section>
        <h3 className="flex items-center justify-between text-sm font-semibold">
          <span className="flex items-center gap-2">
            <Crown className="h-4 w-4" style={{ color: "var(--accent)" }} />
            Subscription
          </span>
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
            style={{
              backgroundColor: "color-mix(in srgb, var(--ok) 15%, transparent)",
              color: "var(--ok)",
            }}
          >
            {SAMPLE_SUBSCRIPTION.planId === "trial" ? "Trial" : "Active"}
          </span>
        </h3>
        <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
          {plan.name} — {plan.messageQuota.toLocaleString()} messages / {plan.interval}
        </p>

        <div
          className="mt-4 rounded-md border p-4"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <div className="flex items-baseline justify-between text-xs">
            <span style={{ color: "var(--muted)" }}>Messages used this period</span>
            <span className="font-medium" style={{ color: "var(--fg)" }}>
              {TOKEN_QUOTA.used.toLocaleString()} / {plan.messageQuota.toLocaleString()}
            </span>
          </div>
          <div
            className="mt-2 h-2 w-full overflow-hidden rounded-full"
            style={{ backgroundColor: "var(--border)" }}
          >
            <div
              className="h-full rounded-full"
              style={{ width: `${pct}%`, backgroundColor: "var(--accent)" }}
            />
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs" style={{ color: "var(--muted)" }}>
            <Calendar className="h-4 w-4" />
            Renews on {SAMPLE_SUBSCRIPTION.expiresAt}
          </div>
          <div className="mt-4 flex gap-2 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
            <button
              type="button"
              className="flex-1 rounded-md border px-3 py-2 text-xs font-medium hover:opacity-90"
              style={{ borderColor: "var(--border)", color: "var(--fg)" }}
            >
              Change Plan
            </button>
            <button
              type="button"
              className="flex-1 rounded-md px-3 py-2 text-xs font-medium hover:opacity-90"
              style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
            >
              <Crown className="mr-2 inline h-3.5 w-3.5" />
              Upgrade
            </button>
          </div>
        </div>
      </section>

      {/* Model */}
      <section>
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <Cpu className="h-4 w-4" /> Model
        </h3>
        <div className="mt-4">
          <Field label="Reasoning model" defaultValue="GPT-4o (default)" />
        </div>
      </section>

      {/* Account */}
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