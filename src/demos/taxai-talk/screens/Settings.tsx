// src/demos/taxai-talk/screens/Settings.tsx
//
// Settings — voice selection cards (4 ElevenLabs voices) + response language
// picker. Visual only.

import { Check } from "lucide-react";
import { VOICES, SELECTED_VOICE } from "../mocks";

export function Settings() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-10 space-y-8">
      <section>
        <h3 className="text-sm font-semibold">Voice</h3>
        <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>ElevenLabs voices available for the assistant. Currently selected voice is highlighted.</p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {VOICES.map((v) => {
            const active = v.id === SELECTED_VOICE;
            return (
              <button
                key={v.id}
                type="button"
                className="relative rounded-lg border p-4 text-left transition-colors hover:opacity-80"
                style={{
                  borderColor: active ? "var(--accent)" : "var(--border)",
                  backgroundColor: active ? "var(--surface)" : undefined,
                }}
              >
                {active && <Check className="absolute right-3 top-3 h-4 w-4" style={{ color: "var(--accent)" }} />}
                <p className="text-sm font-semibold">{v.name}</p>
                <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>{v.description}</p>
                <p className="mt-2 text-[10px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>{v.language}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold">Response language</h3>
        <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>Voice output follows this preference. Input is auto-detected.</p>
        <div className="mt-4 flex gap-2 text-xs">
          <span className="rounded-full px-3 py-1 font-medium" style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}>Multilingual</span>
          <span className="rounded-full border px-3 py-1" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>English</span>
          <span className="rounded-full border px-3 py-1" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>العربية</span>
        </div>
      </section>
    </div>
  );
}
