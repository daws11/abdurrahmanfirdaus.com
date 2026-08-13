// src/demos/taxai-talk/screens/Transcript.tsx
//
// Transcript view — bilingual (EN/AR) sample conversation with timestamps
// and language pill per turn. Refit to UAE tax context per spec.

import { Play } from "lucide-react";
import { Badge } from "@/demos/_shared/Badge";
import { SAMPLE_TRANSCRIPT } from "../mocks";

export function Transcript() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h2 className="text-xl font-semibold tracking-tight">Sample conversation</h2>
      <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>UAE tax Q&A · multilingual voice · GPT-4o + ElevenLabs Aria</p>

      <ol className="mt-8 space-y-4">
        {SAMPLE_TRANSCRIPT.map((t) => (
          <li
            key={t.id}
            className="rounded-lg border p-4"
            style={{
              borderColor: t.role === "user" ? "var(--border)" : "color-mix(in srgb, var(--accent) 30%, transparent)",
              backgroundColor: t.role === "user" ? "var(--surface)" : "color-mix(in srgb, var(--accent) 5%, transparent)",
            }}
            dir={t.language === "AR" ? "rtl" : "ltr"}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Badge tone={t.role === "user" ? "neutral" : "accent"}>
                  {t.role === "user" ? "You" : "TaxAI"}
                </Badge>
                <Badge tone="neutral">{t.language}</Badge>
              </div>
              <span className="text-[10px]" style={{ color: "var(--muted)" }}>{t.timestamp}</span>
            </div>
            <p
              className="mt-2 text-sm leading-relaxed"
              style={t.language === "AR" ? { fontFamily: '"Noto Sans Arabic", "Tajawal", system-ui, sans-serif' } : undefined}
            >
              {t.content}
            </p>
            {t.role === "assistant" && (
              <button className="mt-3 inline-flex items-center gap-1.5 text-xs hover:underline" style={{ color: "var(--accent)" }}>
                <Play className="h-3 w-3" /> Play audio
              </button>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
