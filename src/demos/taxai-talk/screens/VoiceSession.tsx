// src/demos/taxai-talk/screens/VoiceSession.tsx
//
// Live voice session view — mirrors talk.taxai.ae production
// ConversationControls.tsx layout:
// - Live status badge
// - Three avatars (You / Atto center / voice variant right)
// - Voice name + description
// - 32-bar synthetic waveform
// - Mute button + MicButton (primary) + End call
// - StatusIndicator
// - Powered-by line
// - QuickStartPills
//
// E.5 — adds a Conclusion modal that appears when the session ends, replacing
// the previous silent reset. The modal summarises the session and offers
// Save & email / Restart actions.

import { useState } from "react";
import { Volume2, Radio, PhoneOff } from "lucide-react";
import { Button } from "@/demos/_shared/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/demos/_shared/Card";
import { Dialog } from "@/demos/_shared/Dialog";
import { MicButton, type MicState } from "./MicButton";
import { StatusIndicator, type SessionStatus } from "./StatusIndicator";
import { QuickStartPills } from "./QuickStartPills";
import {
  VOICES,
  SELECTED_VOICE,
  CONCLUSION_HEADLINE,
  CONCLUSION_BODY,
  CONCLUSION_CTAS,
} from "../mocks";

const AVATAR_INITIALS = "AI"; // VoiceSession name; E.13 will swap center to a Sparkles icon.
const BARS = 32;

export function VoiceSession() {
  const voice = VOICES.find((v) => v.id === SELECTED_VOICE)!;
  const [micState, setMicState] = useState<MicState>("idle");
  const [status, setStatus] = useState<SessionStatus>("idle");
  const [showConclusion, setShowConclusion] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  const handleStart = () => {
    setMicState("connecting");
    setTimeout(() => {
      setMicState("active");
      setStatus("listening");
    }, 300);
  };

  // E.5 — both end paths converge here. Single source of truth.
  const endSession = () => {
    if (micState === "idle") return;
    setMicState("ending");
    setTimeout(() => {
      setMicState("idle");
      setStatus("idle");
      setShowConclusion(true);
    }, 300);
  };

  // E.5 — Restart from the Conclusion modal: close + reset visual state.
  const handleRestart = () => {
    setShowConclusion(false);
    setSavedFlash(false);
  };

  // E.5 — Save & email: flash inline success for 2s (no toast library).
  const handleSave = () => {
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
  };

  return (
    <div className="flex h-full flex-col items-center justify-center px-6">
      <div className="flex items-center gap-2">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
          style={{
            backgroundColor: "color-mix(in srgb, var(--ok) 15%, transparent)",
            color: "var(--ok)",
          }}
        >
          <Radio className="h-3 w-3" /> Live
        </span>
      </div>

      {/* Three avatars — user on left, center AI in accent, side AI with border */}
      <div className="mt-4 flex items-center gap-6">
        <div className="flex flex-col items-center gap-1.5">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full text-sm font-semibold"
            style={{
              border: "2px solid var(--border)",
              backgroundColor: "var(--surface)",
              color: "var(--fg)",
            }}
          >
            SM
          </div>
          <p className="text-[10px] uppercase tracking-widest" style={{ color: "var(--muted)" }}>
            You
          </p>
        </div>

        <div
          className="flex h-20 w-20 items-center justify-center rounded-full text-lg font-semibold shadow-lg"
          style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
        >
          {AVATAR_INITIALS}
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full text-sm font-semibold"
            style={{
              border: "2px solid var(--accent)",
              backgroundColor: "color-mix(in srgb, var(--accent) 15%, transparent)",
              color: "var(--accent)",
            }}
          >
            {AVATAR_INITIALS}
          </div>
          <p className="text-[10px] uppercase tracking-widest" style={{ color: "var(--muted)" }}>
            {voice.name}
          </p>
        </div>
      </div>

      <div className="text-center">
        <h2 className="mt-4 text-2xl font-semibold tracking-tight">Ask the tax code</h2>
        <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
          {voice.name} · {voice.language} · {voice.description}
        </p>
      </div>

      {/* Waveform — 32 staggered pulsing bars */}
      <div className="mt-10 flex items-center justify-center gap-1 h-24">
        {Array.from({ length: BARS }).map((_, i) => (
          <span
            key={i}
            className="w-1 rounded-full animate-pulse"
            style={{
              height: `${20 + Math.abs(Math.sin(i * 0.4)) * 60}%`,
              animationDelay: `${i * 50}ms`,
              animationDuration: `${900 + (i % 4) * 150}ms`,
              backgroundColor: "var(--accent)",
            }}
          />
        ))}
      </div>

      {/* Controls — Mute (left), MicButton (center primary), End (right) */}
      <div className="mt-10 flex items-center gap-4">
        <button
          type="button"
          className="flex h-12 w-12 items-center justify-center rounded-full border hover:opacity-80"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)", color: "var(--muted)" }}
          aria-label="Mute"
        >
          <Volume2 className="h-5 w-5" />
        </button>

        <MicButton state={micState} onStart={handleStart} onEnd={endSession} />

        <Button
          type="button"
          variant="secondary"
          className="h-12 w-12 !p-0 rounded-full"
          aria-label="End call"
          onClick={endSession}
          disabled={micState === "idle"}
        >
          <PhoneOff className="h-5 w-5" />
        </Button>
      </div>

      <StatusIndicator status={status} />

      <p className="mt-6 text-xs" style={{ color: "var(--muted)" }}>
        Powered by <span className="font-semibold" style={{ color: "var(--accent)" }}>ElevenLabs</span>
        {" "}· GPT-4o reasoning
      </p>

      <QuickStartPills />

      {/* E.5 — Conclusion modal */}
      <Dialog
        open={showConclusion}
        onClose={() => setShowConclusion(false)}
        title="Session complete"
        maxWidth={520}
        footer={
          <>
            <Button variant="secondary" onClick={handleRestart}>
              {CONCLUSION_CTAS.restart}
            </Button>
            <Button variant="primary" onClick={handleSave}>
              {CONCLUSION_CTAS.save}
            </Button>
          </>
        }
      >
        <Card>
          <CardHeader>
            <CardTitle>{CONCLUSION_HEADLINE}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
              {CONCLUSION_BODY}
            </p>

            <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div>
                <dt className="uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                  Voice
                </dt>
                <dd className="mt-0.5 font-medium" style={{ color: "var(--fg)" }}>
                  {voice.name}
                </dd>
              </div>
              <div>
                <dt className="uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                  Language
                </dt>
                <dd className="mt-0.5 font-medium" style={{ color: "var(--fg)" }}>
                  {voice.language}
                </dd>
              </div>
              <div>
                <dt className="uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                  Duration
                </dt>
                <dd className="mt-0.5 font-medium" style={{ color: "var(--fg)" }}>
                  0:32
                </dd>
              </div>
              <div>
                <dt className="uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                  Turns
                </dt>
                <dd className="mt-0.5 font-medium" style={{ color: "var(--fg)" }}>
                  6
                </dd>
              </div>
            </dl>

            {savedFlash && (
              <p
                className="mt-4 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--ok) 15%, transparent)",
                  color: "var(--ok)",
                }}
              >
                ✓ Saved to your Atto inbox
              </p>
            )}
          </CardContent>
        </Card>
      </Dialog>
    </div>
  );
}
