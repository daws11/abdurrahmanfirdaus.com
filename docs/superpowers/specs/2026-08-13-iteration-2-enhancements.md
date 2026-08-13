---
title: Iteration 2 — 4 enhancements (Laguku redirect, TaxAI UI 1:1, preview images, case studies)
date: 2026-08-13
status: draft
owner: Abdurrahman Firdaus
source-task: Polish the 4 new demos (Laguku + 3 TaxAI) added in iteration 1
---

# Iteration 2 — 4 Enhancements

## 1. Konteks & masalah

Iteration 1 menambahkan 4 demo baru (commit `5145a28` spec, `927b351` plan, `860618e`–`c71f302` 8 task commits). Hasil sudah jalan tapi user-flagged 4 gap:

1. **Laguku iframe ditolak** — `laguku.co` kirim `X-Frame-Options: DENY` + CSP `frame-ancestors 'self'`. Iterasi 1 sudah fallback ke card + tombol "Open laguku.co", tapi user ingin **direct redirect** (no demo shell).
2. **TaxAI UI kurang mirip produksi** — screens terlalu sintetik-umum, belum ada production-style flows (email OTP step, message reactions, typing indicator, avatar di conversation list, dll).
3. **4 demo baru belum punya preview image** — `public/assets/images/demos/` cuma punya 5 PNG lama (channelflow, invenflow, invoice-sense, kitchen-fresh, people-culture). Hub cards untuk 4 demo baru render broken image.
4. **4 demo baru belum punya case study page** — `projectStories` array di `src/data/portfolio.ts` cuma punya 5 entry. Case study section di home + per-project page (`#/projects/<id>`) cuma punya 5.

## 2. Keputusan yang sudah disetujui (dari brainstorming 2026-08-13)

1. **Laguku** — DemoHub card `Laguku` → langsung `<a href="https://laguku.co" target="_blank" rel="noopener noreferrer">` (new tab). Tidak ada demo shell. DemoHub render `<a>` kalau ada `externalUrl` di DemoMeta, `<button>` kalau tidak.
2. **TaxAI UI** — visual style 1:1. Keep shadcn primitives + brand accents. Tambah production-style screens + visual cues (avatars, status dots, typing indicators, message reactions). Sintetik, bukan pixel-perfect clone.
3. **Preview images** — render mock screenshots via Playwright headless capture. Simpan ke `public/assets/images/demos/<id>.png` dan `public/assets/images/projects/<id>.png`.
4. **Case study** — saya tulis narasi lengkap dengan format sama seperti 5 existing (Discovery/Built/Outcome + kicker + impact + stack + integrations + hero + duration + teamSize). Product showcase angle (bukan FDE narrative — bukan internal tool).
5. **Vite port** — port 3000 dipakai proses lain; untuk testing pakai `npm run dev -- --port 3001`. Tidak ubah `vite.config.ts`.

## 3. Arsitektur

### 3.1 DemoMeta: tambah `externalUrl`

File: `src/demos/_index.ts`

```ts
export interface DemoMeta {
  id: DemoId;
  title: string;
  division: string;
  blurb: string;
  route: `/demos/${DemoId}`;
  status: DemoStatus;
  theme: DemoTheme;
  externalUrl?: string;  // NEW — if present, DemoHub renders <a target="_blank">
}
```

Update entry `laguku` (atau hapus dari DEMOS array — lihat §3.2).

### 3.2 Laguku: keep di DEMOS dengan externalUrl, remove shell files

User memilih "DemoHub card langsung ke laguku.co" + "Tidak ada demo shell". Jadi:
- Keep entry `laguku` di DEMOS dengan `externalUrl: "https://laguku.co"` — DemoHub render `<a target="_blank">`.
- Remove `src/demos/laguku/` directory entirely (`index.tsx`, `routes.tsx`, `README.md`).
- Update `router.tsx`: remove `Laguku` import, remove `laguku` entry dari `DEMO_COMPONENTS`, remove `isLaguku` check (MobileViewportNotice always-on setelah ini).
- URL `#/demos/laguku` (direct typing) → tidak match anything di DEMOS → `DemoNotFound`. Acceptable edge case.

Reasoning: card click adalah flow normal; direct URL access adalah edge case. Edge case menampilkan DemoNotFound, yang konsisten dengan convention project.

### 3.3 TaxAI UI enhancements — per demo

#### TaxAI Wizard (7 screens, dari 4)

Current: Register, Plans, Checkout, Dashboard.

Production ref: Email → OTP → Personal Info → Plan Selection → Checkout → Success → Dashboard.

New screens (file structure):
```
src/demos/taxai-wizard/screens/
├── EmailStep.tsx       # email input + "Continue" button
├── OtpStep.tsx         # 6-digit OTP code, auto-advance inputs
├── Register.tsx        # personal info (rename atau reuse? — keep sebagai "PersonalInfo")
├── Plans.tsx           # unchanged (4 tier cards)
├── Checkout.tsx        # unchanged
├── SuccessStep.tsx     # welcome screen post-payment (NEW)
└── Dashboard.tsx       # unchanged
```

Actually, restructuring: rename existing Register → PersonalInfo, add EmailStep + OtpStep before it, add SuccessStep between Checkout and Dashboard.

Total screens: **7** (Email, OTP, PersonalInfo, Plans, Checkout, Success, Dashboard).

New visual cues:
- Stepper top nav: each step shows number + label; completed steps get checkmark icon; active step highlighted.
- Plan cards: avatar initials (`SM` for Sara, `RA` for Rashid, `AJ` for Ahmed, `KM` for Khalid — synthetic consultant names per plan).
- Checkout: add VAT breakdown line + total, currency selector (AED/USD).

#### TaxAI Chat (3 screens, enhanced)

Current: Inbox, Conversation, Settings.

Production ref: Login, Register, Home (history + QuickStart), Profile.

Enhanced (tetap 3 screens):
- **Inbox**: add QuickStart empty state component (when no conversation selected), profile dropdown mini di top of sidebar, online status dots per conversation.
- **Conversation**: avatar inisial di tiap message bubble (user `SM`, AI `TaxAI`), typing indicator (3 animated dots) after user message, message reactions (👍 ❤️ 📋) hover-reveal.
- **Settings**: profile photo placeholder (avatar with initials), language preference toggle (visual).

#### TaxAI Talk (3 screens, enhanced)

Current: Voice, Transcript, Settings.

Production ref: VoiceChat + ConversationControls + SettingsPanel + TranscriptDisplay.

Enhanced (tetap 3 screens):
- **Voice**: add avatar circle (initials), live status badge ("Live" / "Connecting..."), 32-bar waveform (dari 24).
- **Transcript**: avatar per turn, "Play audio" expanded with duration label.
- **Settings**: voice preview button per card (mock), language preference already there.

### 3.4 Preview images

Generate via Playwright headless:
- 4 mock components di `scripts/preview-render/` (one per demo, no shell — just the inner content)
- Use Playwright in script mode (not MCP) to navigate to a temp page that renders the mock at 1280×800, capture screenshot
- Output: 4 PNG files

Files to create:
```
scripts/preview-render/
├── laguku.tsx            # renders a mock Laguku landing preview
├── taxai-wizard.tsx      # mock Register + Plans side-by-side
├── taxai-chat.tsx        # mock Inbox + Conversation side-by-side
├── taxai-talk.tsx        # mock Voice session + waveform
└── capture.mjs           # Playwright script: load each, capture 1280×800 PNG

public/assets/images/demos/
├── laguku.png            # 1280×800 PNG (NEW)
├── taxai-wizard.png      # 1280×800 PNG (NEW)
├── taxai-chat.png        # 1280×800 PNG (NEW)
└── taxai-talk.png        # 1280×800 PNG (NEW)

public/assets/images/projects/
├── laguku.png            # same source (or smaller crop, decide)
├── taxai-wizard.png      # same source
├── taxai-chat.png        # same source
└── taxai-talk.png        # same source
```

Note: existing `projects/` has `.svg`. For the 4 new ones we'll use `.png`. Update `projects` array di `portfolio.ts` accordingly. (Consider migrating existing 5 to `.png` too — but out of scope unless requested.)

**Image dimensions:** both `demos/<id>.png` and `projects/<id>.png` use the same source PNG file at 1280×800. DemoHub renders it at 16:10; FocusRail renders it cropped/fitted via CSS `object-fit`. Same file, two paths (one physical file in `demos/`, one referenced for projects via symlink OR copy). Simplest: physical file lives in `demos/`, `projects/<id>.png` is a symlink. Or just generate two copies. **Decision: copy (no symlinks to keep build portable across OS).**

### 3.5 Case study narratives

File: `src/data/portfolio.ts`

Tambah 4 entry ke `projectStories` array (current 5 → 9).

Tambah 4 entry ke `projects` array (FocusRailItem) — current 5 → 9.

Update `sectionCopy.work.subheading`: "Five systems, told in detail..." → "Nine systems, told in detail...".

**Narrative content (4 entries):**

**Laguku** — AI custom song generator
- Division: `Music · AI`
- Kicker: `"A song in their voice, from their story."`
- Story angle: GPT writes lyrics, Suno composes the music, WhatsApp delivers. Mobile-first product for personal gifting occasions.
- Stack: `React`, `Vite`, `TypeScript`, `OpenAI`, `Suno (via kai.ai)`, `WhatsApp Business API`
- Integrations: `WhatsApp Business`, `OpenAI`, `kai.ai`
- Hero: `/assets/images/demos/laguku.png`
- Duration: `2024 – present`
- TeamSize: `Solo + brand operator`

**TaxAI Wizard** — subscription onboarding for UAE tax AI
- Division: `Tax AI · Stripe`
- Kicker: `"From Free Trial to Yearly — a Stripe-powered onboarding for the UAE tax assistant."`
- Story angle: 7-step registration funnel (email → OTP → personal info → plan selection → checkout → success → dashboard), Stripe-backed, multi-language (EN/AR).
- Stack: `React`, `TypeScript`, `Stripe Elements`, `MongoDB`, `Express`, `JWT`
- Integrations: `Stripe`, `MongoDB`
- Hero: `/assets/images/demos/taxai-wizard.png`
- Duration: `2025 – present`
- TeamSize: `Solo + 1 founder`

**TaxAI Chat** — UAE tax Q&A with citations
- Division: `Tax AI · Document Q&A`
- Kicker: `"Conversations with the UAE tax code — upload, reference, cite."`
- Story angle: Chat interface with file attachment, citation cards under AI answers quoting Federal Decree-Law, dual bubble layout, token tracking.
- Stack: `Next.js`, `TypeScript`, `MongoDB`, `JWT`
- Integrations: `MongoDB`
- Hero: `/assets/images/demos/taxai-chat.png`
- Duration: `2025 – present`
- TeamSize: `Solo`

**TaxAI Talk** — voice assistant for UAE tax
- Division: `Tax AI · Voice pipeline`
- Kicker: `"GPT reasons, ElevenLabs speaks — tax answers in multiple languages."`
- Story angle: Real-time voice assistant using ElevenLabs SDK + GPT-4o reasoning, multilingual output (EN/AR).
- Stack: `Next.js`, `TypeScript`, `ElevenLabs SDK`, `OpenAI`
- Integrations: `ElevenLabs`, `OpenAI`
- Hero: `/assets/images/demos/taxai-talk.png`
- Duration: `2025 – present`
- TeamSize: `Solo`

(Full impact metrics, outcomes lists, etc. to be drafted in spec phase or delegated to writer subagent.)

## 4. File structure

### New files

```
src/demos/taxai-wizard/screens/
├── EmailStep.tsx
├── OtpStep.tsx
└── SuccessStep.tsx

scripts/preview-render/
├── laguku.tsx
├── taxai-wizard.tsx
├── taxai-chat.tsx
├── taxai-talk.tsx
└── capture.mjs

public/assets/images/demos/{laguku,taxai-wizard,taxai-chat,taxai-talk}.png
public/assets/images/projects/{laguku,taxai-wizard,taxai-chat,taxai-talk}.png
```

### Modified files

```
src/demos/_index.ts                                 # +externalUrl on DemoMeta, set on laguku
src/demos/_shared/DemoHub.tsx                       # handle externalUrl (render <a> instead of <button>)
src/demos/router.tsx                                # remove Laguku import + DEMO_COMPONENTS entry + isLaguku guard
src/data/portfolio.ts                               # +4 projectStories, +4 projects, subheading copy
src/demos/taxai-wizard/routes.tsx                   # +3 screens (Email, Otp, Success)
src/demos/taxai-wizard/index.tsx                    # updated nav with 7 steps + stepper
src/demos/taxai-wizard/screens/Register.tsx        # rename to PersonalInfo.tsx for clarity
src/demos/taxai-chat/screens/Inbox.tsx              # +QuickStart empty state + online dots + profile mini
src/demos/taxai-chat/screens/Conversation.tsx       # +avatars + typing indicator + reactions
src/demos/taxai-chat/screens/Settings.tsx           # +profile photo placeholder
src/demos/taxai-talk/screens/VoiceSession.tsx       # +avatar circle + status badge + 32-bar waveform
src/demos/taxai-talk/screens/Transcript.tsx         # +avatar per turn + audio duration
src/demos/taxai-talk/screens/Settings.tsx           # +voice preview button
```

### Files removed

```
src/demos/laguku/index.tsx          # remove (replaced by externalUrl approach in DemoHub)
src/demos/laguku/routes.tsx         # remove
src/demos/laguku/README.md          # remove
```

Plus router.tsx cleanup: remove `Laguku` import, remove `laguku: Laguku` from DEMO_COMPONENTS, remove `isLaguku` guard + `{!isLaguku && <MobileViewportNotice />}` (always render MobileViewportNotice now).

## 5. Visual integration

- **DemoHub**: same look. Card Laguku: image preview + brand tile + tagline + "Open live" CTA with `ExternalLink` icon (instead of "Open demo" + `ArrowRight`).
- **FocusRail homepage**: 9 cards instead of 5. New cards use PNG (not SVG) — slight style diff OK.
- **Case study section**: "Nine systems, told in detail..." + 9 cards in alternating layout.
- **ProjectPage** (`#/projects/laguku` etc): data-driven, 4 new pages render automatically once `projectStories` has the entries.

## 6. Implementation order

1. **Phase 1 — Laguku redirect**: Modify `DemoMeta` + `DemoHub` + remove `src/demos/laguku/*`. Add `externalUrl` to laguku entry.
2. **Phase 2 — TaxAI Wizard expansion**: 3 new screens (Email/Otp/Success) + stepper nav. Update routes + index.
3. **Phase 3 — TaxAI Chat enhancement**: Inbox QuickStart + online dots + profile. Conversation avatars + typing + reactions. Settings profile photo.
4. **Phase 4 — TaxAI Talk enhancement**: Voice avatar + status + 32-bar waveform. Transcript avatars + audio duration. Settings voice preview.
5. **Phase 5 — Preview images**: Mock components + Playwright capture script. Generate 4 PNGs.
6. **Phase 6 — Case studies**: 4 entries di `projectStories` + 4 di `projects`. Update `sectionCopy.work`.
7. **Phase 7 — Hub verification**: 9 cards render, navigation works, 4 new case studies open at `#/projects/<id>`, 4 preview images load.

## 7. Yang TIDAK dilakukan

- Tidak clone production code (visual reference saja).
- Tidak migrate existing 5 SVGs to PNGs (out of scope).
- Tidak tambah i18n (English only untuk UI prototype).
- Tidak ubah port 3000 di vite.config.ts (pakai `--port 3001` saat testing).
- Tidak setup real Stripe/MongoDB/ElevenLabs integration (sintetik).
- Tidak embed production UI screenshots sebagai preview images (render mock sendiri).

## 8. Open questions

Tidak ada. Semua keputusan sudah dikunci di sesi brainstorming 2026-08-13.

## 9. Verifikasi

- `npx tsc --noEmit -p tsconfig.app.json` clean.
- `npm run build` clean.
- Dev server di port 3001: DemoHub shows 9 cards, Laguku click → new tab ke laguku.co.
- Each TaxAI demo: enhanced screens render correctly, avatars/typing/reactions visible.
- 4 new preview images: visible on DemoHub cards + FocusRail cards (no broken image).
- 4 new case study pages: accessible via `#/projects/<id>`.
- ProjectPage renders all 4 new stories.

## 10. Commit strategy

Batch at end (1–2 commits) — not per phase. Default unless user requests otherwise.
