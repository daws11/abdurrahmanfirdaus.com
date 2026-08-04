// src/demos/kitchen-fresh/screens/Settings.tsx
// @ts-nocheck
//
// Production equivalent: SettingsPage → SettingsPanel.tsx. Mirrors the
// production settings anatomy — counter defaults (duration, grid),
// freshness thresholds, demand forecast window, and integrations.

import { useState } from "react";
import { Save, RotateCcw, Settings as SettingsIcon, Users } from "lucide-react";
import { DEFAULT_SETTINGS, DEFAULT_THRESHOLDS, type KitchenFreshSettings } from "../mocks";

export function Settings() {
  const [form, setForm] = useState<KitchenFreshSettings>(DEFAULT_SETTINGS);
  const [hasChanges, setHasChanges] = useState(false);

  function update<K extends keyof KitchenFreshSettings>(key: K, value: KitchenFreshSettings[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setHasChanges(true);
  }

  function updateThreshold(key: "alertThreshold" | "checkThreshold" | "alert" | "check", value: number) {
    setForm((f) => ({ ...f, thresholds: { ...f.thresholds, [key]: value } }));
    setHasChanges(true);
  }

  function reset() {
    setForm(DEFAULT_SETTINGS);
    setHasChanges(false);
  }

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div
            className="text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: "var(--muted)" }}
          >
            System
          </div>
          <h1 className="text-xl font-semibold tracking-tight">Settings</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            Counter defaults, freshness thresholds, demand forecast window,
            and integration schedule. Mirrors SettingsPanel.tsx.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={reset}
            disabled={!hasChanges}
            className="inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium transition-opacity disabled:opacity-50"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--surface)",
              color: "var(--fg)",
            }}
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
          <button
            type="button"
            onClick={() => setHasChanges(false)}
            disabled={!hasChanges}
            className="inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium text-white transition-opacity disabled:opacity-50"
            style={{ backgroundColor: "var(--accent)" }}
          >
            <Save className="h-4 w-4" />
            Save changes
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Section icon={<SettingsIcon className="h-4 w-4" />} title="Counter defaults" description="Fresh Counter grid layout and shelf life.">
          <Field
            label="Expiration (minutes)"
            value={form.expirationMinutes}
            onChange={(v) => update("expirationMinutes", Number(v) || 0)}
          />
          <Field
            label="Grid columns"
            value={form.gridCols}
            onChange={(v) => update("gridCols", Number(v) || 1)}
          />
          <Field
            label="Grid rows"
            value={form.gridRows}
            onChange={(v) => update("gridRows", Number(v) || 1)}
          />
        </Section>

        <Section icon={<SettingsIcon className="h-4 w-4" />} title="Freshness thresholds" description="Default alert=70%, check=30%.">
          <Field
            label="Alert threshold (%)"
            value={form.thresholds.alert}
            onChange={(v) => updateThreshold("alert", Number(v) || 0)}
          />
          <Field
            label="Check threshold (%)"
            value={form.thresholds.check}
            onChange={(v) => updateThreshold("check", Number(v) || 0)}
          />
          <div className="rounded-md border p-3 text-xs" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}>
            <div className="text-[10px] font-medium uppercase tracking-widest" style={{ color: "var(--muted)" }}>
              Current
            </div>
            <div className="mt-1 font-mono tabular-nums">
              alert &gt; {form.thresholds.alert}% → good ·{" "}
              &gt; {form.thresholds.check}% → alert ·{" "}
              ≤ {form.thresholds.check}% → check · 0% → replace
            </div>
          </div>
        </Section>

        <Section icon={<SettingsIcon className="h-4 w-4" />} title="Demand forecast" description="Window and weekday filter for the demand badge.">
          <Field
            label="Window (days)"
            value={form.demandForecastWindowDays}
            onChange={(v) => update("demandForecastWindowDays", Number(v) || 1)}
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.demandForecastSameWeekdayOnly}
              onChange={(e) => update("demandForecastSameWeekdayOnly", e.target.checked)}
              className="h-4 w-4 rounded"
              style={{ accentColor: "var(--accent)" }}
            />
            <span>Same-weekday only</span>
          </label>
        </Section>

        <Section icon={<SettingsIcon className="h-4 w-4" />} title="Integrations" description="Scheduled jobs.">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={Boolean(form.integrations.salesExport)}
              onChange={(e) =>
                update("integrations", {
                  ...form.integrations,
                  salesExport: e.target.checked,
                })
              }
              className="h-4 w-4 rounded"
              style={{ accentColor: "var(--accent)" }}
            />
            <span>Sales export</span>
          </label>
        </Section>

        <Section icon={<Users className="h-4 w-4" />} title="Staff" description="User access & roles (production has admin / user).">
          <ul className="space-y-1 text-sm">
            {[
              { name: "Demo User", role: "Admin", initials: "DU" },
              { name: "Staff 02", role: "Admin", initials: "S2" },
              { name: "Staff 04", role: "User", initials: "S4" },
              { name: "Staff 06", role: "User", initials: "S6" },
            ].map((u) => (
              <li
                key={u.name}
                className="flex items-center justify-between rounded-md border px-3 py-2"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold"
                    style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
                  >
                    {u.initials}
                  </span>
                  <span className="font-medium">{u.name}</span>
                </div>
                <span
                  className="rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest"
                  style={{
                    borderColor: "var(--border)",
                    color: u.role === "Admin" ? "var(--accent)" : "var(--muted)",
                  }}
                >
                  {u.role}
                </span>
              </li>
            ))}
          </ul>
        </Section>

        <Section icon={<SettingsIcon className="h-4 w-4" />} title="About" description="Defaults reference.">
          <div className="rounded-md border p-3 text-xs" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}>
            <div className="text-[10px] font-medium uppercase tracking-widest" style={{ color: "var(--muted)" }}>
              Production defaults
            </div>
            <ul className="mt-1 space-y-0.5 font-mono">
              <li>expirationMinutes = 120</li>
              <li>gridCols × gridRows = 4 × 3</li>
              <li>demand window = 30 days</li>
              <li>
                thresholds = {DEFAULT_THRESHOLDS.alert}% / {DEFAULT_THRESHOLDS.check}%
              </li>
            </ul>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="rounded-xl border p-4"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
    >
      <header className="mb-3 flex items-start gap-2">
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
          style={{ backgroundColor: "var(--bg)", color: "var(--accent)" }}
        >
          {icon}
        </span>
        <div className="min-w-0">
          <h2 className="text-sm font-semibold">{title}</h2>
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            {description}
          </p>
        </div>
      </header>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block text-xs">
      <span
        className="mb-1 block text-[10px] font-medium uppercase tracking-widest"
        style={{ color: "var(--muted)" }}
      >
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-9 w-full rounded-md border px-2 text-sm focus:outline-none focus:ring-1"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--bg)",
          color: "var(--fg)",
        }}
      />
    </label>
  );
}
