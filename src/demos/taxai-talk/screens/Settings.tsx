// src/demos/taxai-talk/screens/Settings.tsx
//
// Settings — voice selection cards (4 ElevenLabs voices) with a "Preview"
// button per card, plus the response language picker. QuickStartPills footer
// mirrors production's bottom-of-page colored-dot pills.

import { Check, Play } from "lucide-react";
import { VOICES } from "../mocks";
import { useVoiceSelection } from "../useVoiceSelection";
import { QuickStartPills } from "./QuickStartPills";

export function Settings() {
  const [selectedVoiceId, setVoiceId] = useVoiceSelection();
  const voice = VOICES.find((v) => v.id === selectedVoiceId)!;
  return (
    <div className="mx-auto max-w-2xl px-6 py-10 space-y-8">
      <section>
        <h3 className="text-sm font-semibold">Voice</h3>
        <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
          ElevenLabs voices available for the assistant. Tap Preview to hear a
          5-second sample. Currently selected voice is highlighted.
        </p>
        <p
          className="mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
          style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
        >
          Currently: {voice.name}
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {VOICES.map((v) => {
            const active = v.id === selectedVoiceId;
            return (
              <div
                key={v.id}
                role="button"
                tabIndex={0}
                onClick={() => setVoiceId(v.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setVoiceId(v.id);
                  }
                }}
                className="relative rounded-lg border p-4 transition-colors cursor-pointer hover:opacity-90"
                style={{
                  borderColor: active ? "var(--accent)" : "var(--border)",
                  backgroundColor: active ? "var(--surface)" : undefined,
                }}
              >
                {active && (
                  <Check
                    className="absolute right-3 top-3 h-4 w-4"
                    style={{ color: "var(--accent)" }}
                  />
                )}
                <p className="text-sm font-semibold">{v.name}</p>
                <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                  {v.description}
                </p>
                <p
                  className="mt-2 text-[10px] uppercase tracking-wider"
                  style={{ color: "var(--muted)" }}
                >
                  {v.language}
                </p>
                <button
                  type="button"
                  className="mt-3 inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium hover:opacity-80"
                  style={{
                    borderColor: "var(--border)",
                    backgroundColor: "var(--surface)",
                    color: active ? "var(--accent)" : "var(--muted)",
                  }}
                >
                  <Play className="h-3 w-3" /> Preview
                </button>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold">Response language</h3>
        <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
          Voice output follows this preference. Input is auto-detected.
        </p>
        <div className="mt-4 flex gap-2 text-xs">
          <span
            className="rounded-full px-3 py-1 font-medium"
            style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
          >
            Multilingual
          </span>
          <span
            className="rounded-full border px-3 py-1"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
          >
            English
          </span>
          <span
            className="rounded-full border px-3 py-1"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
          >
            العربية
          </span>
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold">Capabilities</h3>
        <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
          What this voice session can do for you.
        </p>
        <QuickStartPills />
      </section>
    </div>
  );
}
