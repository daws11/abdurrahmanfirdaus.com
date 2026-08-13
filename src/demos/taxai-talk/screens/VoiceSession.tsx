// src/demos/taxai-talk/screens/VoiceSession.tsx
//
// Live voice session view — centered avatar circle (initials), status badge
// ("Live"), 32-bar waveform (was 24), and mic/end-call controls. The
// waveform uses staggered animation delays so the bars feel "alive".

import { Mic, PhoneOff, Volume2, Radio } from "lucide-react";
import { Button } from "@/demos/_shared/Button";
import { VOICES, SELECTED_VOICE } from "../mocks";

const AVATAR_INITIALS = "AI"; // TaxAI Assistant
const BARS = 32;

export function VoiceSession() {
  const voice = VOICES.find((v) => v.id === SELECTED_VOICE)!;

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
            {/* ponytail: hardcoded avatar — taxai-talk mocks doesn't export SAMPLE_USER */}
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

      {/* Controls */}
      <div className="mt-10 flex items-center gap-4">
        <button
          className="flex h-12 w-12 items-center justify-center rounded-full border hover:opacity-80"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)", color: "var(--muted)" }}
          aria-label="Mute"
        >
          <Volume2 className="h-5 w-5" />
        </button>

        <button
          className="flex h-16 w-16 items-center justify-center rounded-full shadow-lg"
          style={{ backgroundColor: "var(--accent)", color: "white" }}
          aria-label="Speak"
        >
          <Mic className="h-7 w-7" />
        </button>

        <Button
          type="button"
          variant="secondary"
          className="h-12 w-12 !p-0 rounded-full"
          aria-label="End call"
        >
          <PhoneOff className="h-5 w-5" />
        </Button>
      </div>

      <p className="mt-6 text-xs" style={{ color: "var(--muted)" }}>
        Powered by <span className="font-semibold" style={{ color: "var(--accent)" }}>ElevenLabs</span>
        {" "}· GPT-4o reasoning
      </p>
    </div>
  );
}