// src/demos/taxai-talk/screens/VoiceSession.tsx
//
// Live voice session view — mirrors talk.taxai.ae production
// ConversationControls.tsx layout.
// E.7 — mic cycles through listen → speak → transcript updates in real time,
// with mm:ss duration counter. Conclusion modal reads live values for
// Duration / Turns. Restart resets the live transcript.

import { useEffect, useRef, useState } from "react";
import { Volume2, Radio, PhoneOff, Sparkles } from "lucide-react";
import { Button } from "@/demos/_shared/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/demos/_shared/Card";
import { Dialog } from "@/demos/_shared/Dialog";
import { MicButton, type MicState } from "./MicButton";
import { StatusIndicator, type SessionStatus } from "./StatusIndicator";
import { QuickStartPills } from "./QuickStartPills";
import {
  VOICES,
  CONCLUSION_HEADLINE,
  CONCLUSION_BODY,
  CONCLUSION_CTAS,
  SIMULATED_TURNS,
} from "../mocks";
import { useVoiceSelection } from "../useVoiceSelection";
import { useTranscript, resetTranscript } from "../useTranscript";

const AVATAR_INITIALS = "AI";
const BARS = 32;

function fmtMMSS(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function VoiceSession() {
  const [selectedVoiceId] = useVoiceSelection();
  const voice = VOICES.find((v) => v.id === selectedVoiceId)!;
  const [micState, setMicState] = useState<MicState>("idle");
  const [status, setStatus] = useState<SessionStatus>("idle");
  const [showConclusion, setShowConclusion] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  // E.7 — live session state
  const [elapsed, setElapsed] = useState(0);
  const [phase, setPhase] = useState<"idle" | "listening" | "speaking">("idle");
  const [transcript, appendTurn] = useTranscript();
  const lastDispatchedRef = useRef(0);

  // Tick elapsed every 1s while not idle.
  useEffect(() => {
    if (phase === "idle") return;
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [phase]);

  // Dispatch SIMULATED_TURNS based on elapsed seconds.
  useEffect(() => {
    for (let i = lastDispatchedRef.current; i < SIMULATED_TURNS.length; i++) {
      if (SIMULATED_TURNS[i].afterSec <= elapsed) {
        appendTurn(SIMULATED_TURNS[i].turn);
        setPhase(SIMULATED_TURNS[i].turn.role === "user" ? "listening" : "speaking");
        lastDispatchedRef.current = i + 1;
      } else {
        break;
      }
    }
  }, [elapsed, appendTurn]);

  // E.7 — random heights for waveform while speaking.
  const [barHeights, setBarHeights] = useState<number[]>(
    () => Array.from({ length: BARS }, () => 0.4 + Math.random() * 0.4),
  );
  useEffect(() => {
    if (phase !== "speaking") return;
    const t = setInterval(() => {
      setBarHeights(Array.from({ length: BARS }, () => 0.2 + Math.random() * 0.8));
    }, 100);
    return () => clearInterval(t);
  }, [phase]);

  const handleStart = () => {
    setMicState("connecting");
    setElapsed(0);
    lastDispatchedRef.current = 0;
    setTimeout(() => {
      setMicState("active");
      setStatus("listening");
      setPhase("listening");
    }, 300);
  };

  const endSession = () => {
    if (micState === "idle") return;
    setMicState("ending");
    setTimeout(() => {
      setMicState("idle");
      setStatus("idle");
      setPhase("idle");
      setShowConclusion(true);
    }, 300);
  };

  const handleRestart = () => {
    setShowConclusion(false);
    setSavedFlash(false);
    setElapsed(0);
    setPhase("idle");
    resetTranscript();
  };

  const handleSave = () => {
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
  };

  const lastAssistant = [...transcript].reverse().find((t) => t.role === "assistant");

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

      {/* Three avatars */}
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
          <Sparkles className="h-8 w-8" />
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

      {/* Waveform — 32 bars; heights vary by phase */}
      <div className="mt-10 flex items-center justify-center gap-1 h-24">
        {Array.from({ length: BARS }).map((_, i) => (
          <span
            key={i}
            className={phase === "idle" ? "w-1 rounded-full animate-pulse" : "w-1 rounded-full"}
            style={{
              height: `${20 + barHeights[i] * 60}%`,
              animationDelay: phase === "idle" ? `${i * 50}ms` : undefined,
              animationDuration: phase === "listening" ? `${400 + (i % 4) * 60}ms` : phase === "idle" ? `${900 + (i % 4) * 150}ms` : undefined,
              animation: phase === "listening" ? "pulse 0.6s ease-in-out infinite" : phase === "idle" ? undefined : undefined,
              backgroundColor: "var(--accent)",
              transition: phase === "speaking" ? "height 100ms ease-out" : undefined,
            }}
          />
        ))}
      </div>

      {/* E.7 — last assistant turn preview (clamped 2 lines) */}
      {lastAssistant && (
        <div className="mt-4 max-w-md px-4">
          <p className="line-clamp-2 text-center text-xs italic" style={{ color: "var(--muted)" }}>
            <span className="font-medium not-italic" style={{ color: "var(--accent)" }}>
              Atto:
            </span>{" "}
            {lastAssistant.content}
          </p>
        </div>
      )}

      {/* Controls */}
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

      {/* E.7 — duration counter (mm:ss) */}
      <p className="mt-2 text-xs font-mono" style={{ color: "var(--muted)" }}>
        {fmtMMSS(elapsed)}
      </p>

      <p className="mt-4 text-xs" style={{ color: "var(--muted)" }}>
        Powered by <span className="font-semibold" style={{ color: "var(--accent)" }}>ElevenLabs</span>
        {" "}· GPT-4o reasoning
      </p>

      <QuickStartPills />

      {/* E.5/E.7 — Conclusion modal with live values */}
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
                  {fmtMMSS(elapsed)}
                </dd>
              </div>
              <div>
                <dt className="uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                  Turns
                </dt>
                <dd className="mt-0.5 font-medium" style={{ color: "var(--fg)" }}>
                  {transcript.length}
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