// src/demos/taxai-talk/screens/VoiceSession.tsx
//
// Live voice session view — centered waveform animation, mic/end-call
// controls, language indicator. SVG waveform is a static SVG with animated
// bars via Tailwind keyframes.

import { Mic, PhoneOff, Volume2 } from "lucide-react";
import { Button } from "@/demos/_shared/Button";
import { VOICES, SELECTED_VOICE } from "../mocks";

export function VoiceSession() {
  const voice = VOICES.find((v) => v.id === SELECTED_VOICE)!;

  return (
    <div className="flex h-full flex-col items-center justify-center px-6">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: "var(--accent)" }}>Live session</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">Ask the tax code</h2>
        <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>{voice.name} · {voice.language} · {voice.description}</p>
      </div>

      {/* Waveform (24 staggered pulsing bars) */}
      <div className="mt-10 flex items-center justify-center gap-1.5 h-24">
        {Array.from({ length: 24 }).map((_, i) => (
          <span
            key={i}
            className="w-1 rounded-full animate-pulse"
            style={{
              height: `${20 + Math.abs(Math.sin(i * 0.6)) * 60}%`,
              animationDelay: `${i * 60}ms`,
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
        Powered by <span className="font-semibold" style={{ color: "var(--accent)" }}>ElevenLabs</span> · GPT-4o reasoning
      </p>
    </div>
  );
}
