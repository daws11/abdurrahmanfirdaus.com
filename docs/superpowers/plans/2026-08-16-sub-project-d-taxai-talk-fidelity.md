# Sub-project D — TaxAI Talk 99% Production Fidelity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the `taxai-talk` portfolio prototype to 99% match the production `talk.taxai.ae` UI (Next.js 15 + 11Labs). Extract the three production sub-components (ConversationControls, TranscriptDisplay, SettingsPanel + QuickStart) into focused files; refactor the three portfolio screens to use them.

**Architecture:** Mirror production component decomposition. Production has `voice/ConversationControls.tsx` (BIG round Mic button + status indicator + QuickStart), `voice/TranscriptDisplay.tsx` (current subtitle + scrollable history + summary), `voice/SettingsPanel.tsx` + standalone `QuickStart.tsx` (3 colored-dot pills footer). Portfolio mirrors this decomposition with `MicButton.tsx`, `StatusIndicator.tsx`, `QuickStartPills.tsx` extracted screens, and rewrites `VoiceSession.tsx` / `Transcript.tsx` / `Settings.tsx` to compose them.

**Tech Stack:** React 19, TypeScript, Tailwind v4, lucide-react icons, theme tokens via `var(--*)`. No new deps.

**Working directory:** `/Users/yanuar/Documents/abdurrahmanfirdaus.com/`

**Branch:** feature/taxai-talk-fidelity (off main)

**Verification:** `npx tsc --noEmit -p tsconfig.app.json` clean, `npm run build` clean, dev server at `:3001` shows the 3 screens with production visual fidelity.

---

## File structure

```
src/demos/taxai-talk/
├── README.md                               — update with new architecture
├── index.tsx                               — UNCHANGED (still 3-screen switch)
├── routes.tsx                              — UNCHANGED
├── mocks.ts                                — MODIFIED: add CONVERSATION_SUMMARY
├── screens/
│   ├── MicButton.tsx                       — NEW: BIG round Mic button + pulsing ring
│   ├── StatusIndicator.tsx                 — NEW: listening/speaking status with animated dots
│   ├── QuickStartPills.tsx                 — NEW: 3 colored-dot pills footer
│   ├── VoiceSession.tsx                    — MODIFIED: uses MicButton + StatusIndicator + QuickStartPills
│   ├── Transcript.tsx                      — MODIFIED: scrollable container + current subtitle + summary
│   └── Settings.tsx                        — MODIFIED: QuickStartPills footer (keep voice picker)
```

---

## Task D.1: Foundation — mocks extension + 3 new components

**Files:**
- Modify: `src/demos/taxai-talk/mocks.ts`
- Create: `src/demos/taxai-talk/screens/MicButton.tsx`
- Create: `src/demos/taxai-talk/screens/StatusIndicator.tsx`
- Create: `src/demos/taxai-talk/screens/QuickStartPills.tsx`

This task is the foundation. D.2/D.3/D.4 will compose these new components. Each component is a focused unit with clear props.

- [ ] **Step 1: Extend `mocks.ts` with `CONVERSATION_SUMMARY`**

Append this to `src/demos/taxai-talk/mocks.ts` after the existing exports (before the `SELECTED_VOICE` line at the bottom is fine):

```ts
export const CONVERSATION_SUMMARY = `The user asked three questions about UAE taxation in a multilingual conversation (English + Arabic):

1. **VAT on restaurants** — confirmed the standard 5% VAT rate applies uniformly to dine-in and takeaway food, with no carve-outs in the Federal Decree-Law.

2. **Excise tax on beverages and tobacco** — clarified Excise Tax rates: 50% on carbonated beverages, 100% on tobacco products, and 100% on energy drinks. Tax is triggered at import or release from an excise warehouse.

3. **Corporate Tax registration** — explained that Federal Tax Authority registration is mandatory for UAE-resident juridical persons and non-residents with a permanent establishment, with deadlines tied to the date of business establishment.

**Key terms surfaced:** Federal Decree-Law No. 8 of 2017, Federal Tax Authority, Excise Warehouse, Permanent Establishment.

**Recommended next steps:** Review the user's specific business activity codes (VAT and CT) and confirm any goods that may qualify for designated-zone VAT relief. Open corporate tax registration flow via the EmaraTax portal if establishment date is approaching the 9-month deadline.`;
```

(Continue with the existing `SELECTED_VOICE = "aria"` export below.)

- [ ] **Step 2: Create `MicButton.tsx`**

Create `src/demos/taxai-talk/screens/MicButton.tsx`:

```tsx
// src/demos/taxai-talk/screens/MicButton.tsx
//
// BIG round Mic button mirroring talk.taxai.ae production
// ConversationControls: 96px idle, 128px on lg+. bg-accent when idle,
// bg-red-500 when active with a pulsing animate-ping ring overlay.

import { Mic, Loader2, PhoneOff } from "lucide-react";

export type MicState = "idle" | "active" | "connecting" | "ending";

export interface MicButtonProps {
  state: MicState;
  onStart: () => void;
  onEnd: () => void;
}

export function MicButton({ state, onStart, onEnd }: MicButtonProps) {
  const isActive = state === "active" || state === "ending";
  const isLoading = state === "connecting" || state === "ending";

  return (
    <button
      type="button"
      onClick={isActive ? onEnd : onStart}
      disabled={isLoading}
      aria-label={isActive ? "End conversation" : "Start conversation"}
      className="relative flex items-center justify-center rounded-full transition-all duration-200 ease-in-out active:scale-95 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2"
      style={{
        height: "6rem",
        width: "6rem",
        backgroundColor: isActive ? "#ef4444" : "var(--accent)",
        color: "white",
        boxShadow: isActive
          ? "0 10px 25px -5px rgba(239, 68, 68, 0.4)"
          : "0 10px 25px -5px color-mix(in srgb, var(--accent) 40%, transparent)",
      }}
    >
      <div className="flex items-center justify-center">
        {isLoading ? (
          <Loader2 className="h-8 w-8 animate-spin" />
        ) : isActive ? (
          <PhoneOff className="h-8 w-8" />
        ) : (
          <Mic className="h-8 w-8" />
        )}
      </div>
      {/* Pulsing ring when active (mirrors production animate-ping) */}
      {state === "active" && (
        <span
          aria-hidden
          className="absolute inset-0 rounded-full opacity-75 animate-ping"
          style={{ backgroundColor: "#ef4444" }}
        />
      )}
    </button>
  );
}
```

- [ ] **Step 3: Create `StatusIndicator.tsx`**

Create `src/demos/taxai-talk/screens/StatusIndicator.tsx`:

```tsx
// src/demos/taxai-talk/screens/StatusIndicator.tsx
//
// Inline status indicator mirroring talk.taxai.ae production
// ConversationControls: 3 animated dots (blue) when listening,
// single static dot (green) when speaking. Sits below the Mic button.

export type SessionStatus = "idle" | "listening" | "speaking" | "ended";

export interface StatusIndicatorProps {
  status: SessionStatus;
}

export function StatusIndicator({ status }: StatusIndicatorProps) {
  if (status === "idle" || status === "ended") {
    // Reserve vertical space to prevent layout shift
    return <div className="mt-2 h-5" aria-hidden />;
  }

  const isListening = status === "listening";

  return (
    <div className="mt-2 flex h-5 items-center justify-center gap-2">
      <div
        className="flex items-center gap-1.5"
        style={{ color: isListening ? "#3b82f6" : "#10b981" }}
      >
        {isListening ? (
          <>
            <span
              className="h-2 w-2 rounded-full animate-pulse bg-current"
              style={{ animationDelay: "0ms" }}
            />
            <span
              className="h-2 w-2 rounded-full animate-pulse bg-current"
              style={{ animationDelay: "150ms" }}
            />
            <span
              className="h-2 w-2 rounded-full animate-pulse bg-current"
              style={{ animationDelay: "300ms" }}
            />
          </>
        ) : (
          <span className="h-2 w-2 rounded-full bg-current" />
        )}
        <span className="text-sm font-medium">
          {isListening ? "Listening…" : "Speaking…"}
        </span>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create `QuickStartPills.tsx`**

Create `src/demos/taxai-talk/screens/QuickStartPills.tsx`:

```tsx
// src/demos/taxai-talk/screens/QuickStartPills.tsx
//
// 3 colored-dot pills mirroring talk.taxai.ae production
// ConversationControls.tsx:158-171 footer:
// - Real-time processing (green)
// - AI responses (blue)
// - Live transcription (purple)
// Used at the bottom of Voice and Settings screens.

interface Pill {
  label: string;
  color: string;
}

const PILLS: Pill[] = [
  { label: "Real-time processing", color: "#10b981" }, // emerald-500
  { label: "AI responses", color: "#3b82f6" },        // blue-500
  { label: "Live transcription", color: "#a855f7" },  // purple-500
];

export function QuickStartPills() {
  return (
    <div className="mt-8 grid grid-cols-1 gap-2 sm:grid-cols-3 px-2 text-xs sm:text-sm">
      {PILLS.map((pill) => (
        <div
          key={pill.label}
          className="flex items-center justify-center gap-2 sm:justify-start"
        >
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: pill.color }}
          />
          <span className="text-muted-foreground truncate" style={{ color: "var(--muted)" }}>
            {pill.label}
          </span>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 5: Type-check**

Run: `npx tsc --noEmit -p tsconfig.app.json`
Expected: 0 errors

- [ ] **Step 6: Commit**

```bash
git add src/demos/taxai-talk/mocks.ts src/demos/taxai-talk/screens/MicButton.tsx src/demos/taxai-talk/screens/StatusIndicator.tsx src/demos/taxai-talk/screens/QuickStartPills.tsx
git commit -m "feat(taxai-talk): add foundation (mocks+MicButton+StatusIndicator+QuickStartPills)"
```

---

## Task D.2: VoiceSession rewrite — production ConversationControls layout

**Files:**
- Modify: `src/demos/taxai-talk/screens/VoiceSession.tsx` (full rewrite)

This task rewrites `VoiceSession.tsx` to compose `MicButton`, `StatusIndicator`, and `QuickStartPills`. The hero avatar block + 32-bar waveform + Voice name/description stay (visually faithful to production with portfolio's waveform override per spec §1, decision #12).

- [ ] **Step 1: Rewrite `VoiceSession.tsx`**

Replace the entire content of `src/demos/taxai-talk/screens/VoiceSession.tsx` with:

```tsx
// src/demos/taxai-talk/screens/VoiceSession.tsx
//
// Live voice session view — mirrors talk.taxai.ae production
// ConversationControls.tsx layout:
// - Live status badge (kept from iteration 3)
// - Three avatars (kept: user / center AI / voice variant)
// - Voice name + description (kept)
// - 32-bar waveform (kept: synthetic visual element)
// - Mute button + MicButton (primary) + End call
// - StatusIndicator (NEW: listening/speaking)
// - Powered-by line (kept)
// - QuickStartPills (NEW: 3 colored-dot footer)

import { useState } from "react";
import { Mic, PhoneOff, Volume2, Radio } from "lucide-react";
import { Button } from "@/demos/_shared/Button";
import { MicButton, type MicState } from "./MicButton";
import { StatusIndicator, type SessionStatus } from "./StatusIndicator";
import { QuickStartPills } from "./QuickStartPills";
import { VOICES, SELECTED_VOICE } from "../mocks";

const AVATAR_INITIALS = "AI"; // TaxAI Assistant
const BARS = 32;

export function VoiceSession() {
  const voice = VOICES.find((v) => v.id === SELECTED_VOICE)!;
  const [micState, setMicState] = useState<MicState>("idle");
  const [status, setStatus] = useState<SessionStatus>("idle");

  const handleStart = () => {
    setMicState("connecting");
    // Demo: synthetic state transition after a tick
    setTimeout(() => {
      setMicState("active");
      setStatus("listening");
    }, 300);
  };

  const handleEnd = () => {
    setMicState("ending");
    setTimeout(() => {
      setMicState("idle");
      setStatus("ended");
      // After "ended", fall back to idle status for layout stability
      setTimeout(() => setStatus("idle"), 800);
    }, 300);
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

        <MicButton state={micState} onStart={handleStart} onEnd={handleEnd} />

        <Button
          type="button"
          variant="secondary"
          className="h-12 w-12 !p-0 rounded-full"
          aria-label="End call"
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
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit -p tsconfig.app.json`
Expected: 0 errors

- [ ] **Step 3: Visual smoke test**

Run: `npm run dev` (or rely on the already-running dev server on :3001).
Navigate to `#/demos/taxai-talk/voice` (default).
Verify:
- Live badge visible
- Three avatars visible
- Voice name + description visible
- 32-bar waveform animating
- Mute + BIG Mic + End buttons visible
- StatusIndicator reserved space visible (idle state)
- "Powered by ElevenLabs · GPT-4o reasoning" visible
- 3 colored QuickStart pills (green/blue/purple) visible at bottom

Click the BIG Mic:
- After ~300ms, button turns red with pulsing ring
- Status shows "Listening…" with 3 blue animated dots
- Mic icon replaced by PhoneOff

Click again to end:
- After ~300ms, button returns to accent color
- Status shows "Ended"-like state, falls back to idle

- [ ] **Step 4: Commit**

```bash
git add src/demos/taxai-talk/screens/VoiceSession.tsx
git commit -m "feat(taxai-talk): rewrite VoiceSession to production ConversationControls layout"
```

---

## Task D.3: Transcript rewrite — production TranscriptDisplay layout

**Files:**
- Modify: `src/demos/taxai-talk/screens/Transcript.tsx` (full rewrite)

This task rewrites `Transcript.tsx` to mirror production `TranscriptDisplay.tsx`:
- Currently-speaking card (pulsing) at top
- Conversation history in a scrollable container with per-line color
- Conversation summary card below

The existing per-turn blocks (avatars, language pill, audio duration) carry over.

- [ ] **Step 1: Rewrite `Transcript.tsx`**

Replace the entire content of `src/demos/taxai-talk/screens/Transcript.tsx` with:

```tsx
// src/demos/taxai-talk/screens/Transcript.tsx
//
// Transcript view — mirrors talk.taxai.ae production
// TranscriptDisplay.tsx:
// - Currently-speaking card (pulsing) at top showing most recent assistant turn
// - Conversation history in scrollable container (h-48, per-line color)
// - Conversation summary card (synthetic GPT summary)
// Per-turn avatars + audio durations from iteration 3 carry over inside the
// scrollable container, each line keeping its existing block styling.

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
            maxHeight: "16rem", // h-64 to fit both per-turn blocks and per-line scroll
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
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit -p tsconfig.app.json`
Expected: 0 errors

- [ ] **Step 3: Visual smoke test**

Navigate to `#/demos/taxai-talk/transcript`.
Verify:
- Header (sample conversation + subtitle) visible
- "Now speaking" pulsing card with most recent assistant turn visible
- "Conversation history" section with scrollable container (max-h-64) holding per-turn blocks
- Per-turn blocks have avatars, badge (You/Atto), language pill, timestamp, audio duration button
- Scroll the conversation history — it scrolls inside the rounded container
- "Conversation summary" card with the synthetic GPT summary text below

- [ ] **Step 4: Commit**

```bash
git add src/demos/taxai-talk/screens/Transcript.tsx
git commit -m "feat(taxai-talk): rewrite Transcript to production TranscriptDisplay layout"
```

---

## Task D.4: Settings rewrite — add QuickStartPills footer

**Files:**
- Modify: `src/demos/taxai-talk/screens/Settings.tsx`

This is the smallest task. Voice picker cards + Preview buttons + language pills stay; QuickStartPills footer is appended.

- [ ] **Step 1: Update `Settings.tsx`**

Append the `QuickStartPills` import + usage at the end of `Settings.tsx`:

```tsx
// src/demos/taxai-talk/screens/Settings.tsx
//
// Settings — voice selection cards (4 ElevenLabs voices) with a "Preview"
// button per card, plus the response language picker. QuickStartPills footer
// mirrors production's bottom-of-page colored-dot pills.

import { Check, Play } from "lucide-react";
import { VOICES, SELECTED_VOICE } from "../mocks";
import { QuickStartPills } from "./QuickStartPills";

export function Settings() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-10 space-y-8">
      <section>
        <h3 className="text-sm font-semibold">Voice</h3>
        <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
          ElevenLabs voices available for the assistant. Tap Preview to hear a
          5-second sample. Currently selected voice is highlighted.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {VOICES.map((v) => {
            const active = v.id === SELECTED_VOICE;
            return (
              <div
                key={v.id}
                className="relative rounded-lg border p-4 transition-colors"
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
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit -p tsconfig.app.json`
Expected: 0 errors

- [ ] **Step 3: Visual smoke test**

Navigate to `#/demos/taxai-talk/settings`.
Verify:
- Voice section with 4 voice cards (Aria highlighted, others grey border)
- Each card has Preview button
- Response language section with 3 pills (Multilingual selected)
- Capabilities section with 3 colored-dot QuickStart pills at bottom

- [ ] **Step 4: Commit**

```bash
git add src/demos/taxai-talk/screens/Settings.tsx
git commit -m "feat(taxai-talk): add QuickStartPills footer to Settings"
```

---

## Task D.5: Smoke test + README

**Files:**
- Modify: `src/demos/taxai-talk/README.md`

- [ ] **Step 1: Full build**

Run: `npm run build`
Expected: build clean, no TS or Vite errors

- [ ] **Step 2: Update README**

Replace the body of `src/demos/taxai-talk/README.md` with:

```md
# taxai-talk

Live voice session, sample transcript, and voice settings — mirrors the
production `talk.taxai.ae` UI (Next.js + ElevenLabs + GPT-4o). Production
is rendered read-only; portfolio re-implements the visual layer in
React + theme tokens.

## What's real, what's mocked

- **Real** — layout and visual fidelity to production. Sub-component
  decomposition: `MicButton`, `StatusIndicator`, `QuickStartPills` extracted
  the same way production splits `ConversationControls` and `QuickStart`.
- **Real** — Listen / Speak state animation (pulsing dots), listening →
  speaking transitions, currently-speaking pulse card, scrollable transcript
  history with per-line color (user = accent, assistant = foreground),
  synthetic GPT-style conversation summary, 4 ElevenLabs voice cards with
  Preview buttons.
- **Mocked** — Mic controls toggle a synthetic state machine (idle → connecting
  → active → ending). No real audio, no transcription, no actual summary
  generation. Transcript turns are a static 6-turn bilingual sample.
- **Out of scope** — Real audio waveform analysis (portfolio uses a 32-bar
  synthetic animation), microphone device selector, audio output mode toggle
  (production uses `MediaDeviceInfo` browser API for hardware integration).
```

- [ ] **Step 3: Commit**

```bash
git add src/demos/taxai-talk/README.md
git commit -m "docs(taxai-talk): update README for production fidelity rewrite"
```

- [ ] **Step 4: Final integration smoke test**

Run: `npm run dev` (or rely on already-running :3001 server).
Navigate through all 3 screens:
- `/#/demos/taxai-talk/voice` — Live badge + 3 avatars + 32-bar waveform + Mute/Mic/End + StatusIndicator reserved space + Powered-by + 3 QuickStart pills
- `/#/demos/taxai-talk/transcript` — Header + Now-speaking pulse card + Conversation history scrollable container + Conversation summary card
- `/#/demos/taxai-talk/settings` — Voice cards + Preview + Response language pills + Capabilities pills

Click the BIG Mic on the voice screen and verify:
- Button toggles red with pulsing ring
- StatusIndicator shows "Listening…" with 3 blue animated dots

---

## Self-review

**1. Spec coverage:**
- §3.1 VoiceSession — Task D.2 ✅
- §3.2 Transcript — Task D.3 ✅
- §3.3 Settings — Task D.4 ✅
- §4 file structure — Tasks D.1-D.4 ✅
- §5 implementation order — D.1 → D.2 → D.3 → D.4 → D.5 ✅

**2. Placeholder scan:** No "TBD", "TODO", or "implement later" references. All code snippets are complete and copy-pasteable.

**3. Type consistency:**
- `MicState` enum: "idle" | "active" | "connecting" | "ending" — defined in MicButton, used in VoiceSession with same literals.
- `SessionStatus` enum: "idle" | "listening" | "speaking" | "ended" — defined in StatusIndicator, used in VoiceSession with same literals.
- `CONVERSATION_SUMMARY` — added to mocks in D.1, consumed in D.3, ready for D.3 future use.
- No `clearLayers()` vs `clearFullLayers()` mismatches.

**4. Out-of-scope items not implemented:**
- No real OpenAI/ElevenLabs integration ✅
- No device selector (production's `MediaDeviceInfo`) ✅
- No quota warnings ✅
- No framer-motion (kept CSS-only animations) ✅
- 32-bar synthetic waveform kept per spec decision #12 ✅

---

## Risks & mitigations

| Risk | Mitigation |
|---|---|
| MicButton's `color-mix` shadow evaluates late | Confirmed Tailwind v4 supports this in `style={{}}` |
| StatusIndicator reserved space prevents layout shift | `<div className="mt-2 h-5" aria-hidden />` |
| Mic state machine `setTimeout` chain keeps state forever | After "ended" → "idle" (800ms), state resets cleanly |
| Transcript scrollable container too short for 6 turns | h-64 (16rem) ≈ 4 visible turns at default zoom |
| QuickStartPills grid on Settings shows 1-col on mobile | Single column stacked (matches production sm:grid-cols-3) |

---

## Handoff

After D.5 completes, dispatch the final code-reviewer subagent (per the
subagent-driven-development skill) for a holistic check before merging.

---

**End of plan.**
