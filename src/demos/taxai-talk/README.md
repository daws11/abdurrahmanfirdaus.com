# taxai-talk

Live voice session, sample transcript, and voice settings — mirrors the
production `talk.taxai.ae` UI (Next.js + ElevenLabs + GPT-4o). Production
is rendered read-only; portfolio re-implements the visual layer in
React + theme tokens.

## What's real, what's mocked

- **Real** — layout and visual fidelity to production. Sub-component
  decomposition mirrors production's split: `MicButton`, `StatusIndicator`,
  `QuickStartPills` correspond to production's `ConversationControls` and
  `QuickStart`. Compose the three portfolio screens (Voice, Transcript,
  Settings) the same way production composes `VoiceChat`.
- **Real** — Listen / Speak state animation (pulsing dots), listening →
  speaking transitions, currently-speaking pulse card, scrollable
  transcript history (capped at h-64) with per-turn avatars + audio
  durations + bilingual EN/AR `dir` switching, conversation summary card
  (synthetic GPT-style), 4 ElevenLabs voice cards with Preview buttons,
  QuickStart pills footer (Real-time processing / AI responses / Live
  transcription).
- **Mocked** — Mic controls toggle a synthetic state machine (idle →
  connecting → active → ending). No real audio, no real transcription,
  no real summary generation. Transcript turns are a static 6-turn
  bilingual sample.
- **Out of scope** — Real audio waveform analysis (portfolio uses a 32-bar
  synthetic animation), microphone device selector, audio output mode
  toggle (production uses `MediaDeviceInfo` browser API for hardware
  integration). Brand identity follows the portfolio's shadcn new-york
  with dark surface (`#0b0b14` bg) and violet accent — no production code,
  schemas, or fixtures committed here.

## Layout map

```
Voice
├── Live badge (Radio + OK color)
├── Three avatars (You / center AI / voice variant)
├── Voice name + description block
├── 32-bar synthetic waveform (staggered animate-pulse)
├── Controls row: Mute + <MicButton> + End
├── <StatusIndicator> (reserved-space + Listening/Speaking labels)
├── "Powered by ElevenLabs · GPT-4o reasoning"
└── <QuickStartPills>

Transcript
├── Header (sample conversation + subtitle)
├── "Now speaking" pulse card (most recent assistant turn)
├── Conversation history (scrollable, max-h-64, per-turn blocks)
└── Conversation summary (static card)

Settings
├── Voice cards (4 voices, Aria highlighted, Preview button per card)
├── Response language pills (Multilingual / English / العربية)
└── Capabilities section → <QuickStartPills>
```
