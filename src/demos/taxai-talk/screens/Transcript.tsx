// src/demos/taxai-talk/screens/Transcript.tsx
//
// Transcript view — bilingual (EN/AR) sample conversation with avatars per
// turn, timestamps, language pill, and an expanded "Play audio" button that
// shows a synthetic duration label.

import { Play } from "lucide-react";
import { Badge } from "@/demos/_shared/Badge";
import { SAMPLE_TRANSCRIPT, VOICES, SELECTED_VOICE } from "../mocks";

const AVATAR_INITIALS = "AI"; // TaxAI Assistant (2 chars to fit avatar)

// ponytail: synthetic audio durations picked from production talk.taxai.ae
// transcript durations; demo uses them verbatim to look real.
const AUDIO_DURATIONS: Record<string, string> = {
  "t-2": "0:04",
  "t-4": "0:11",
  "t-6": "0:06",
};

export function Transcript() {
  const voice = VOICES.find((v) => v.id === SELECTED_VOICE)!;
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h2 className="text-xl font-semibold tracking-tight">Sample conversation</h2>
      <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
        UAE tax Q&A · multilingual voice · GPT-4o + ElevenLabs {voice.name}
      </p>

      <ol className="mt-8 space-y-4">
        {SAMPLE_TRANSCRIPT.map((t) => {
          const isUser = t.role === "user";
          const initials = isUser ? "SM" : AVATAR_INITIALS;
          const audioSeconds = AUDIO_DURATIONS[t.id];
          return (
            <li
              key={t.id}
              className="flex items-start gap-3 rounded-lg border p-4"
              style={{
                borderColor: isUser ? "var(--border)" : "color-mix(in srgb, var(--accent) 30%, transparent)",
                backgroundColor: isUser
                  ? "var(--surface)"
                  : "color-mix(in srgb, var(--accent) 5%, transparent)",
              }}
              dir={t.language === "AR" ? "rtl" : "ltr"}
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: isUser
                    ? "var(--surface)"
                    : "color-mix(in srgb, var(--accent) 20%, transparent)",
                  border: isUser ? "1px solid var(--border)" : "none",
                  color: isUser ? "var(--fg)" : "var(--accent)",
                }}
              >
                {initials}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Badge tone={isUser ? "neutral" : "accent"}>{isUser ? "You" : "TaxAI"}</Badge>
                    <Badge tone="neutral">{t.language}</Badge>
                  </div>
                  <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                    {t.timestamp}
                  </span>
                </div>
                <p
                  className="mt-2 text-sm leading-relaxed"
                  style={t.language === "AR" ? { fontFamily: '"Noto Sans Arabic", "Tajawal", system-ui, sans-serif' } : undefined}
                >
                  {t.content}
                </p>
                {audioSeconds && (
                  <button
                    type="button"
                    className="mt-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs hover:opacity-80"
                    style={{
                      borderColor: "var(--border)",
                      backgroundColor: "var(--surface)",
                      color: "var(--accent)",
                    }}
                  >
                    <Play className="h-3 w-3" /> Play audio · {audioSeconds}
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}