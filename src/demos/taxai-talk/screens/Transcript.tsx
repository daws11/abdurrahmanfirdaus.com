// src/demos/taxai-talk/screens/Transcript.tsx
//
// Transcript view — mirrors talk.taxai.ae production TranscriptDisplay.tsx.
// E.7 — reads live transcript via useTranscript hook. Now Speaking card
// shows the most recent assistant turn from live state.

import { Play } from "lucide-react";
import { Badge } from "@/demos/_shared/Badge";
import { VOICES, SELECTED_VOICE, CONVERSATION_SUMMARY } from "../mocks";
import { useTranscript } from "../useTranscript";

const AVATAR_INITIALS = "AI";

const AUDIO_DURATIONS: Record<string, string> = {
  "live-2": "0:04",
  "live-4": "0:11",
  "live-6": "0:06",
};

export function Transcript() {
  const voice = VOICES.find((v) => v.id === SELECTED_VOICE)!;
  const [transcript] = useTranscript();
  const lastAssistantTurn = [...transcript].reverse().find((t) => t.role === "assistant");

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 space-y-8">
      <header>
        <h2 className="text-xl font-semibold tracking-tight">Sample conversation</h2>
        <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
          UAE tax Q&A · multilingual voice · GPT-4o + ElevenLabs {voice.name}
        </p>
      </header>

      {/* Currently speaking card */}
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

      {/* Conversation history */}
      <section>
        <h3 className="text-sm font-semibold mb-3">Conversation history</h3>
        <div
          className="rounded-lg p-4 space-y-3 overflow-y-auto"
          style={{
            backgroundColor: "color-mix(in srgb, var(--muted) 30%, transparent)",
            maxHeight: "16rem",
          }}
        >
          {transcript.length === 0 ? (
            <p className="text-center text-xs italic" style={{ color: "var(--muted)" }}>
              Start a voice session to generate a transcript.
            </p>
          ) : (
            transcript.map((t) => {
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
            })
          )}
        </div>
      </section>

      {/* Conversation summary */}
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