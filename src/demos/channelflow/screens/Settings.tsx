// src/demos/channelflow/screens/Settings.tsx
// @ts-nocheck
//
// Settings hub — production-style stub mirroring
// /app/(app)/settings/page.tsx. A 2-column tile grid of sub-settings
// (General, Channel settings, AI Agent, Templates, Team, Connections,
// Waitlist, Users) with descriptions and a small icon per section.

import { ChevronRight, Settings as SettingsIcon } from "lucide-react";
import { SETTINGS_SECTIONS } from "../mocks";

export function SettingsHub() {
  return (
    <div className="flex h-full flex-col">
      <header
        className="flex items-end justify-between gap-3 border-b px-5 pb-3 pt-4"
        style={{ borderColor: "var(--border)" }}
      >
        <div>
          <div
            className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em]"
            style={{ color: "var(--accent)" }}
          >
            Settings
          </div>
          <h1 className="text-xl font-semibold tracking-tight">Workspace settings</h1>
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            Business, channels, AI agent, and team configuration.
          </p>
        </div>
      </header>

      <div className="grid flex-1 grid-cols-1 gap-3 overflow-y-auto p-5 md:grid-cols-2">
        {SETTINGS_SECTIONS.map((s) => (
          <button
            type="button"
            key={s.id}
            className="group flex items-start gap-3 rounded-md border p-4 text-left transition-colors"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--surface)",
            }}
          >
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md"
              style={{
                backgroundColor: "rgba(16,185,129,0.10)",
                color: "var(--accent)",
              }}
            >
              <SettingsIcon className="h-4 w-4" strokeWidth={2.25} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold" style={{ color: "var(--fg)" }}>
                {s.label}
              </div>
              <p className="mt-0.5 text-[11px]" style={{ color: "var(--muted)" }}>
                {s.description}
              </p>
            </div>
            <ChevronRight
              className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5"
              style={{ color: "var(--muted)" }}
              strokeWidth={2}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
