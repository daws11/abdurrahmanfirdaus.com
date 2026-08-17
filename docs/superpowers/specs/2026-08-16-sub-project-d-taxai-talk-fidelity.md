---
title: Sub-project D — TaxAI Talk 99% production fidelity
date: 2026-08-16
status: draft
owner: Abdurrahman Firdaus
source-task: Iteration 3 / Sub-project D — re-implement talk.taxai.ae production UI in the portfolio's TaxAI Talk prototype
parent-iteration: iteration 3 visual fidelity push
---

# Sub-project D — TaxAI Talk 99% production fidelity

## 1. Konteks & masalah

Iteration 1 + 2 added `taxai-talk` demo at `src/demos/taxai-talk/` with 3 screens (Voice, Transcript, Settings). Iteration 3 added avatars, 32-bar waveform, audio durations, voice preview button. User-flagged: prototype "masih sangat tidak mirip dan terlalu generic". Want 99% production fidelity.

Production source: `talk.taxai.ae` cloned to `/tmp/taxai-prod/talk/` for reference. Read-only.

**Production structure (verified by reading production source):**

```
src/components/
├── VoiceComponent.tsx                (62 lines)  — quota warnings + wraps VoiceChat
├── voice/
│   ├── VoiceChat.tsx                 (201 lines) — main orchestrator (Card + Settings button + ConversationControls)
│   ├── ConversationControls.tsx       (178 lines) — BIG round Mic button (80-128px) + status indicator
│   ├── TranscriptDisplay.tsx          (81 lines)  — current subtitle + scrollable history + summary
│   └── SettingsPanel.tsx             (205 lines) — modal with mic/speaker device selectors
├── QuickStart.tsx                    (78 lines)  — 3 colored-dot pills at bottom
├── SubtitleDisplay.tsx               (24 lines)  — used inside TranscriptDisplay
├── LanguageSwitcher.tsx              (112 lines) — Globe icon dropdown
├── ProfileDropdown.tsx               (?? lines)  — user profile menu
├── Conclusion.tsx                    (?? lines)  — post-conversation summary modal
└── ui/                               — shadcn primitives
```

**Production visual identity (verified):**
- **ConversationControls**: HUGE round Mic button (80-128px diameter, `bg-primary` idle, `bg-red-500` active with `animate-ping` ring overlay), pulsing loader when connecting/ending, inline status indicator with 3 dots (blue, listening) or static dot (green, speaking), 3 colored-dot QuickStart pills at bottom (green/blue/purple).
- **TranscriptDisplay**: current subtitle in `bg-muted/50 p-4 rounded-lg animate-pulse` card, conversation history in scrollable `bg-muted/30 rounded-lg p-4 h-48 overflow-y-auto` container with per-line color (`text-primary` for user, `text-foreground` for assistant), optional conversation summary section.
- **SettingsPanel**: modal overlay (`fixed inset-0 bg-black/50`) with mic + speaker device dropdowns + audio output mode toggle (auto/speaker/earpiece).

## 2. Decisions made during exploration (locked)

1. **Keep 3 screens** (Voice, Transcript, Settings) but re-implement each with production fidelity.
2. **Big Mic button** — replace small Mic icon control in VoiceSession with production's large round button (96-128px). Primary action surface.
3. **Pulsing ring overlay** — production uses `animate-ping` on a span absolute-positioned inside the button. Portfolio re-implements with same technique.
4. **Inline status indicator** — below the Mic button, with 3 animated dots when listening (blue, `text-blue-500`) or static dot when speaking (green, `text-green-500`). Mirrors production's `ConversationControls.tsx:127-153`.
5. **QuickStart footer** — 3 colored-dot pills at bottom of VoiceSession: Real-time processing (green), AI responses (blue), Live transcription (purple).
6. **Scrollable transcript container** — Transcript uses `bg-muted/30 rounded-lg h-48 overflow-y-auto` scrollable container with per-line color (user="primary", assistant="foreground"). Replace the current open list layout.
7. **Current subtitle highlight** — separate pulsing card at top of transcript for the most recent assistant message (with `animate-pulse` background).
8. **Conversation summary card** — optional green-tinted card below transcript if conversation has ended (production shows GPT-generated summary).
9. **Voice preview button** — already in Settings from iteration 2 Task 4. Keep.
10. **No device selector** in portfolio Settings (production uses real `MediaDeviceInfo` API for hardware selection; portfolio is synthetic).
11. **No quota warnings** (production has quota alert banners — `VoiceComponent.tsx:35-50`).
12. **No real audio waveform** — keep the 32-bar synthetic waveform from iteration 2 + iteration 3 as a visual element (production doesn't have a waveform; it has status indicators).
13. **English only** for copy; no RTL toggle.

## 3. Arsitektur

### 3.1 VoiceSession — production-style ConversationControls

Mirror production's `ConversationControls.tsx` visual layout:

```
┌─────────────────────────────────────────────┐
│                                             │
│        [Live status badge: "Live"]          │  ← status badge (kept from iteration 3)
│                                             │
│      [Atto avatar (80px, accent bg)]         │  ← hero avatar (kept)
│                                             │
│   [SM avatar]      [AI avatar]               │  ← dual avatars (kept)
│                                             │
│  "Ask the tax code" + voice.name + desc      │  ← title block (kept)
│                                             │
│   ┌────────────────────────────────┐         │
│   │  ▌▌▌▌▌▌▌▌▌  (32-bar waveform)  │         │  ← 32-bar waveform (kept)
│   └────────────────────────────────┘         │
│                                             │
│   [Mute]   [BIG Mic]   [End]                 │  ← REPLACE: Mic becomes large primary
│                                             │
│       ●  Listening... / Speaking...          │  ← NEW: inline status indicator
│                                             │
│   "ElevenLabs · GPT-4o reasoning"            │  ← footer (kept)
│                                             │
│   • Real-time processing   • AI responses    │  ← NEW: QuickStart pills
│   • Live transcription                       │
│                                             │
└─────────────────────────────────────────────┘
```

Key changes from current iteration 3:
- **Mic button** becomes LARGE round button (96px default, scale on hover/active).
- **Pulsing ring** overlay (`absolute inset-0 rounded-full animate-ping`) when conversation is active.
- **Status indicator** below controls: 3 animated dots (blue, `text-blue-500`) when listening OR static dot (green, `text-green-500`) when speaking.
- **QuickStart pills** at the very bottom: 3 colored dots + labels (green dot = Real-time processing, blue dot = AI responses, purple dot = Live transcription). Matches production's `ConversationControls.tsx:158-171`.

### 3.2 Transcript — production-style TranscriptDisplay

Mirror production's `TranscriptDisplay.tsx` layout:

```
┌─────────────────────────────────────────────┐
│ [← Back] Conversation                       │  ← header (kept)
├─────────────────────────────────────────────┤
│ ╭─ Currently speaking ─────────────────╮   │  ← NEW: pulsing current subtitle card
│ │ [assistant message text]              │   │     (animate-pulse bg)
│ ╰────────────────────────────────────────╯   │
│                                             │
│ Conversation history                        │  ← section header
│ ┌────────────────────────────────────────┐ │
│ │ You: ...question...                     │ │  ← per-line, text-primary
│ │ Atto: ...answer...                      │ │  ← per-line, text-foreground
│ │ You: ...question...                     │ │
│ │ ...                                    │ │
│ │ (scrollable, h-48)                     │ │
│ └────────────────────────────────────────┘ │
│                                             │
│ (Optional) Conversation summary             │  ← section header
│ ┌────────────────────────────────────────┐ │
│ │ [GPT-generated summary text]            │ │  ← bg-muted/30 rounded-lg
│ └────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

Key changes from current iteration 3:
- Wrap conversation history in a scrollable container (`bg-muted/30 rounded-lg p-4 h-48 overflow-y-auto`).
- Per-line color: "You:" lines = `text-primary` (accent), assistant lines = `text-foreground`.
- Current subtitle highlight: separate pulsing card at top with `animate-pulse` background (matches production's `bg-muted/50 p-4 rounded-lg animate-pulse`).
- Optional conversation summary section (production shows GPT-generated summary after conversation ends). Portfolio implements as a static card with `bg-muted/30 rounded-lg p-4`.
- Avatars per turn: keep iteration 3 work (SM / AI).
- Audio duration buttons per turn: keep iteration 3 work.

### 3.3 Settings — production-style SettingsPanel + QuickStart footer

Mirror production's `SettingsPanel.tsx` layout. Portfolio keeps the iteration 2 + 3 structure but:

- **Voice picker cards**: keep iteration 3 voice preview button.
- **Language picker**: replace bare pills with Globe icon dropdown (production's LanguageSwitcher). Can reuse `LanguageDropdown` from Sub-project C if available — but it's a separate demo. Simpler: native `<select>` styled with theme tokens.
- **QuickStart footer**: ADD 3 colored-dot pills at the bottom of Settings (Real-time processing, AI responses, Live transcription) — mirrors production's pattern.
- No device selector (production has hardware API integration).

## 4. File structure

### Files to create

- `src/demos/taxai-talk/screens/MicButton.tsx` — extracted BIG round Mic button with pulsing ring overlay.
- `src/demos/taxai-talk/screens/StatusIndicator.tsx` — extracted listening/speaking status with animated dots.
- `src/demos/taxai-talk/screens/QuickStartPills.tsx` — extracted 3 colored-dot pills footer.

### Files to modify

- `src/demos/taxai-talk/screens/VoiceSession.tsx` — use MicButton + StatusIndicator + QuickStartPills.
- `src/demos/taxai-talk/screens/Transcript.tsx` — wrap history in scrollable container; add current-subtitle highlight card + optional summary card.
- `src/demos/taxai-talk/screens/Settings.tsx` — use QuickStartPills (same component as VoiceSession).
- `src/demos/taxai-talk/mocks.ts` — add `CONVERSATION_SUMMARY` text (synthetic GPT summary).

### Files NOT changed

- `src/demos/taxai-talk/routes.tsx` (still voice | transcript | settings).
- `src/demos/taxai-talk/index.tsx`.
- Vite config (manual chunk for taxai-talk already in place).
- Theme tokens (reuse existing).

## 5. Implementation order

1. **Extend `mocks.ts`** — add `CONVERSATION_SUMMARY` text (synthetic GPT summary of the sample conversation).
2. **Create `MicButton.tsx`** — large round button (96px) with pulsing ring overlay.
3. **Create `StatusIndicator.tsx`** — listening (3 blue dots, `animate-pulse`) or speaking (1 green dot) status.
4. **Create `QuickStartPills.tsx`** — 3 colored-dot pills footer (real-time / AI responses / live transcription).
5. **Rewrite `VoiceSession.tsx`** — uses MicButton + StatusIndicator + QuickStartPills.
6. **Rewrite `Transcript.tsx`** — scrollable history container + current subtitle pulse card + optional summary card.
7. **Rewrite `Settings.tsx`** — use QuickStartPills + (keep voice picker + language select).
8. **Smoke test + README**.

## 6. Yang TIDAK dilakukan

- Tidak clone production code (read-only)
- Tidak setup real ElevenLabs / GPT-4o / OpenAI backend
- Tidak add framer-motion animations
- Tidak add device selector (hardware API integration)
- Tidak add quota warnings
- Tidak add RTL toggle
- Tidak add real audio waveform (keep synthetic 32-bar from iteration 3)
- Tidak add auth / sign-in

## 7. Verifikasi

- `npx tsc --noEmit -p tsconfig.app.json` clean
- `npm run build` clean
- Dev server at port 3001: navigate `#/demos/taxai-talk`
  - Voice: Atto avatar + status badge + 32-bar waveform + BIG Mic button with pulsing ring (synthetic — shows pulsing red ring when "active"), status indicator below ("Listening..." with 3 dots), 3 QuickStart pills at bottom (green/blue/purple)
  - Transcript: back button + "Currently speaking" pulsing card at top + scrollable conversation history (h-48, per-line colors), optional "Conversation summary" card below
  - Settings: voice picker cards (Aria/River/Sarah/George) with Preview buttons + language picker + 3 QuickStart pills at bottom

## 8. Commit strategy

Single feature commit at end:
- `feat(taxai-talk): rewrite to 99% match production talk.taxai.ae`

## 9. Implementation phases (mapped to subagent tasks)

- **D.1**: Foundation — extend mocks + create MicButton + StatusIndicator + QuickStartPills.
- **D.2**: VoiceSession rewrite (use the 3 new components).
- **D.3**: Transcript rewrite (scrollable container + current subtitle + summary).
- **D.4**: Settings rewrite (QuickStartPills footer + keep existing voice picker).
- **D.5**: Smoke test + README.

## 10. Risks & mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| BIG Mic button's pulsing ring overloads in dark mode | Low | The ring uses `var(--accent)` tint, theme-token aware |
| Scrollable container's `h-48` too short for long transcripts | Low | Acceptable for portfolio demo |
| QuickStart pills too low for screen | Low | Footer section is fine — visible at all viewports |
| Status indicator state (listening vs speaking) needs synthetic animation | High | Static toggle between 2 visual states; no animation needed for state change |

---

## 11. Spec coverage check

| Spec section | Covered by |
|---|---|
| §3.1 VoiceSession | D.2 |
| §3.2 Transcript | D.3 |
| §3.3 Settings | D.4 |
| §4 file structure | All D.* |
| §5 implementation order | All D.* |