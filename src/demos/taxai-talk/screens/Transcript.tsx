// src/demos/taxai-talk/screens/Transcript.tsx
//
// Transcript view — mirrors talk.taxai.ae production
// TranscriptDisplay.tsx:
// - Currently-speaking card (pulsing) at top showing most recent assistant turn
// - Conversation history in scrollable container (h-64, per-turn blocks carried over)
// - Conversation summary card (static, synthetic GPT summary)
// Per-turn avatars + audio durations + bilingual EN/AR from iteration 3
// carry over inside the scrollable container.

import { Play } from "lucide-react";
import { Badge } from "@/demos/_shared/Badge";
import { SAMPLE_TRANSCRIPT, VOICES, SELECTED_VOICE, CONVERSATION_SUMMARY } from "../mocks";

const AVATAR_INITIALS = "AI";

// ponytail: synthetic audio durations picked from production talk.taxai.ae
// transcript durations; demo uses them verbatim to look real.
const AUDIO_DURATIONS: Record<string, string> = {
  "t-2": "0:04",
  "t-4": "0:11",
  "t-6": "0:06",
};

export function Transcript() {
  const voice = VOICES.find((v) => v.id === SELECTED_VOICE)!;
  // The most recent assistant turn is the "currently speaking" subtitle
  const lastAssistantTurn = [...SAMPLE_TRANSCRIPT]
    .reverse()
    .find((t) => t.role === "assistant");

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 space-y-8">
      <header>
        <h2 className="text-xl font-semibold tracking-tight">Sample conversation</h2>
        <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
          UAE tax Q&A · multilingual voice · GPT-4o + ElevenLabs {voice.name}
        </p>
      </header>

      {/* Currently speaking card (mirrors production bg-muted/50 p-4 rounded-lg animate-pulse) */}
      {lastAssistantTurn && (
        <section
          className="rounded-lg p-4 animate-pulse"
          style={{ backgroundColor: "color-mix(in srgb, var(--muted) 50%, transparent)" }}
          dir={lastAssistantTurn.language === "AR" ? "rtl" : "ltr"}
        >
          <p className="text-[10px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>
            Now speaking
          </p>
          <p className="mt-1 text-lg font-medium" style={{ color: "var(--fg)" }}>
            {lastAssistantTurn.content}
          </p>
          {AUDIO_DURATIONS[lastAssistantTurn.id] && (
            <span className="mt-2 inline-flex items-center gap-1.5 text-[10px]" style={{ color: "var(--muted)" }}>
              <Play className="h-3 w-3" /> {AUDIO_DURATIONS[lastAssistantTurn.id]}
            </span>
          )}
        </section>
      )}

      {/* Conversation history (mirrors production bg-muted/30 rounded-lg p-4 h-48 overflow-y-auto) */}
      <section>
        <h3 className="text-sm font-semibold mb-3">Conversation history</h3>
        <div
          className="rounded-lg p-4 space-y-3 overflow-y-auto"
          style={{
            backgroundColor: "color-mix(in srgb, var(--muted) 30%, transparent)",
            maxHeight: "16rem",
          }}
        >
          {SAMPLE_TRANSCRIPT.map((t) => {
            const isUser = t.role === "user";
            const initials = isUser ? "SM" : AVATAR_INITIALS;
            const audioSeconds = AUDIO_DURATIONS[t.id];
            return (
              <article
                key={t.id}
                className="flex items-start gap-3"
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
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Badge tone={isUser ? "neutral" : "accent"}>{isUser ? "You" : "Atto"}</Badge>
                      <Badge tone="neutral">{t.language}</Badge>
                    </div>
                    <span className="text-[10px] shrink-0" style={{ color: "var(--muted)" }}>
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
                      className="mt-2 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs hover:opacity-80"
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
              </article>
            );
          })}
        </div>
      </section>

      {/* Conversation summary (mirrors production bg-muted/30 rounded-lg p-4 card) */}
      <section>
        <h3 className="text-sm font-semibold mb-3">Conversation summary</h3>
        <div
          className="rounded-lg p-4 text-sm leading-relaxed whitespace-pre-line"
          style={{
            backgroundColor: "color-mix(in srgb, var(--muted) 30%, transparent)",
            color: "var(--fg)",
          }}
        >
          {CONVERSATION_SUMMARY}
        </div>
      </section>
    </div>
  );
}
