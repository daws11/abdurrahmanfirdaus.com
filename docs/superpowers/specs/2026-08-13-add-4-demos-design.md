---
title: Tambah 4 Demo: Laguku (iframe) + 3 TaxAI (re-implement)
date: 2026-08-13
status: draft
owner: Abdurrahman Firdaus
source-task: Portfolio tambah showcase 4 produk baru: laguku.co live + 3 TaxAI (wizard, chat, talk)
---

# Tambah 4 Demo: Laguku (iframe) + 3 TaxAI (re-implement)

## 1. Konteks & masalah

Portfolio `abdurrahmanfirdaus.com` saat ini punya **5 demo** di `src/demos/`:

- `invenflow` — Inventory / warehouse / outlets
- `invoice-sense` — Finance / reconciliation
- `channelflow` — Booking / AI agent
- `kitchen-fresh` — Kitchen / outlet ops
- `people-culture` — HR / workforce

Semua 5 adalah **re-implement sintetik** (mock fixtures, layout cloned dari produksi, brand colors overriden per demo).

Tujuan: tambahkan **4 demo baru** sebagai showcase lini produk AI:

- **Laguku** — AI custom song generator (laguku.co live site)
- **TaxAI Wizard** — subscription onboarding (tax-ai-wizard-web-70)
- **TaxAI Chat** — UAE tax Q&A chat (chat.taxai)
- **TaxAI Talk** — UAE tax voice assistant (talk.taxai.ae)

Total portfolio jadi **9 demo**. Lead naratif: **AI tech stack integration** — OpenAI + Suno (Laguku), GPT + ElevenLabs (Talk), GPT + document RAG (Chat), Stripe gating (Wizard).

## 2. Keputusan yang sudah disetujui (dari brainstorming 2026-08-13)

1. **Jumlah demo:** 4 entry baru (Laguku + 3 TaxAI terpisah).
2. **Perlakuan Laguku:** iframe embed `https://laguku.co` di dalam portfolio shell. Konten 100% live site, hanya chrome portfolio di atas.
3. **Perlakuan 3 TaxAI:** re-implement sintetik mengikuti pola 5 demo existing (mock fixtures, cloned layout, brand override per demo).
4. **Bahasa UI:** English only untuk semua 4 demo baru.
5. **TaxAI Talk:** di-reframe ke konteks pajak UAE (sample conversation tentang VAT / corporate tax), padahal production repo-nya generic voice assistant.
6. **DemoHub:** tanpa beda visual — semua 9 card tampil identik (no "Live" badge untuk Laguku).
7. **Kedalaman:** Laguku = 1 iframe, 3 TaxAI = 3-4 screens/demo (~12 screens total).
8. **Logo Laguku:** copy dari `laguin.id/apps/web/public/logo.png` → `public/assets/images/logos/laguku.png`.
9. **Logo 3 TaxAI:** share 1 logo dari `tax-ai-wizard-web-70/public/lovable-uploads/logo yosr.png` → `public/assets/images/logos/taxai.png` (ketiga produk pakai brand "Yosr" yang sama, beda theme accent).
10. **Copy angle:** AI tech stack integration sebagai centerpiece di setiap blurb.

## 3. Arsitektur

### 3.1 Penambahan ke registry

Tambah 4 entry ke `DEMOS` di `src/demos/_index.ts`:

```ts
export type DemoId =
  | "invenflow"
  | "invoice-sense"
  | "channelflow"
  | "kitchen-fresh"
  | "people-culture"
  | "laguku"
  | "taxai-wizard"
  | "taxai-chat"
  | "taxai-talk";
```

### 3.2 Penambahan ke router

Tambah 4 import + 4 entry di `DEMO_COMPONENTS` di `src/demos/router.tsx`:

```ts
import { Laguku } from "./laguku";
import { TaxaiWizard } from "./taxai-wizard";
import { TaxaiChat } from "./taxai-chat";
import { TaxaiTalk } from "./taxai-talk";

const DEMO_COMPONENTS = {
  // ... existing 5
  laguku: Laguku,
  "taxai-wizard": TaxaiWizard,
  "taxai-chat": TaxaiChat,
  "taxai-talk": TaxaiTalk,
};
```

**Exception:** `Laguku` di-render **tanpa** `<MobileViewportNotice />` (live site sudah punya responsive-nya sendiri). Override di `DemoRouter`:

```ts
const Demo = DEMO_COMPONENTS[route.id];
const isLaguku = route.id === "laguku";
return (
  <>
    <Demo sub={route.sub} theme={meta.theme} />
    {!isLaguku && <MobileViewportNotice />}
  </>
);
```

### 3.3 Theme file baru

4 theme file baru di `src/demos/_shared/themes/`:

| File | Accent (var --accent) | Vibe | Sidebar |
|------|-----------------------|------|---------|
| `laguku.ts` | `#E11D48` (rose-600, match laguin.id `--theme-accent`) | warm, gift, mobile | collapsed 64 |
| `taxai-wizard.ts` | `#0EA5A4` (teal-500) | trust, finance, clean | collapsed 64 |
| `taxai-chat.ts` | `#4F46E5` (indigo-600) | conversational, AI | expanded 240 |
| `taxai-talk.ts` | `#7C3AED` (violet-600) | voice, ambient | collapsed 64 |

Tiap theme = export object yang sesuai `DemoTheme` interface (`src/demos/_shared/theme.ts:9`). Pattern sama dengan `themes/invenflow.ts` dll.

Tambah import + 4 entry di `THEMES` map di `theme.ts`.

### 3.4 Brand logo mapping

Update `LOGOS` di `src/demos/_shared/Brand.tsx:30`:

```ts
const LOGOS = {
  // ... existing 5
  laguku: { src: "/assets/images/logos/laguku.png", kind: "image" },
  "taxai-wizard": { src: "/assets/images/logos/taxai.png", kind: "image" },
  "taxai-chat": { src: "/assets/images/logos/taxai.png", kind: "image" },
  "taxai-talk": { src: "/assets/images/logos/taxai.png", kind: "image" },
};
```

### 3.5 Public assets

Tambah 2 file ke `public/assets/images/logos/`:

- `laguku.png` — copy dari `/Users/yanuar/Documents/laguin.id/apps/web/public/logo.png` (540×200 PNG)
- `taxai.png` — copy dari `https://raw.githubusercontent.com/daws11/tax-ai-wizard-web-70/main/public/lovable-uploads/logo%20yosr.png`

## 4. Per-demo spec

### 4.1 Laguku (iframe)

```
src/demos/laguku/
├── index.tsx     # render <iframe src="https://laguku.co" /> full-height dalam Shell
├── routes.tsx    # 1 route only, no sub-screens (returns null fallback)
└── README.md     # 1 paragraf: "iframe live site dalam portfolio shell"
```

**Konten:**
```tsx
export function Laguku({ theme }: { theme: DemoTheme; sub: string | null }) {
  useTheme(theme.id);
  return (
    <Shell theme={theme}>
      <iframe
        src="https://laguku.co"
        title="Laguku — live"
        className="h-[calc(100vh-var(--topbar-h))] w-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </Shell>
  );
}
```

**Mocks:** tidak ada. **Fixtures:** tidak ada. **Screens folder:** tidak ada.

**Sandbox iframe:** laguku.co saat ini tidak set `X-Frame-Options: DENY` (mobile-first public site). Kalau berubah, fallback ke "External site refuses embed" message + tombol "Open laguku.co →".

### 4.2 TaxAI Wizard (re-implement)

```
src/demos/taxai-wizard/
├── index.tsx
├── routes.tsx
├── mocks.ts
├── README.md
└── screens/
    ├── Register.tsx       # multi-step form: name, email, password, job title
    ├── Plans.tsx          # 4 tier cards: Trial / Monthly / Quarterly / Yearly
    ├── Checkout.tsx       # Stripe Elements mock + order summary
    └── Dashboard.tsx      # quota widget (messages left), subscription status
```

**Screens count: 4.** Default landing = `register`.

**Mocks:**
- `plans: Plan[]` — 4 tiers dengan harga USD ($0/$99/$250/$899), message quota, validity
- `user: User` — sample: "Sara Al-Mansouri", UAE resident, "Freelance consultant"
- `subscription: Subscription` — current plan + remaining messages
- Synthetic names (`Sara Al-Mansoori`, `Omar Al-Suwaidi`), email (`sara@example.ae`).

### 4.3 TaxAI Chat (re-implement)

```
src/demos/taxai-chat/
├── index.tsx
├── routes.tsx
├── mocks.ts
├── README.md
└── screens/
    ├── Inbox.tsx          # sidebar: conversation list + token counter
    ├── Conversation.tsx   # dual bubble + attachment preview + composer
    └── Settings.tsx       # language display: EN/AR toggle (visual only)
```

**Screens count: 3.** Default landing = `inbox`.

**Mocks:**
- `conversations: Conversation[]` — 5-7 sample threads dengan topic pajak UAE (VAT, corporate tax, free zones)
- `messages: Message[]` — sample bubbles: user asks tentang VAT rate, AI jawab dengan reference
- `tokens: { used: number; limit: number }` — quota display

### 4.4 TaxAI Talk (re-implement, tax-refit)

```
src/demos/taxai-talk/
├── index.tsx
├── routes.tsx
├── mocks.ts
├── README.md
└── screens/
    ├── VoiceSession.tsx   # waveform animation + mic/end-call controls
    ├── Transcript.tsx     # multi-language sample conversation (EN/AR, tax-themed)
    └── Settings.tsx       # voice selection, language preference
```

**Screens count: 3.** Default landing = `voice`.

**Mocks:**
- `transcript: Turn[]` — sample conversation:
  - User (EN): "What's the VAT rate for restaurants in the UAE?"
  - AI (EN, voice): "The standard VAT rate in the UAE is 5%, applicable to restaurant food and non-alcoholic beverages."
  - User (AR): "وماذا عن الضريبة الانتقائية؟" (What about excise tax?)
  - AI (AR, voice): "الضريبة الانتقائية 50% على المشروبات الغازية و100% على منتجات التبغ..." (Excise tax is 50% on soft drinks and 100% on tobacco...)
- `voices: Voice[]` — ElevenLabs voice options: "Aria", "River", "Sarah"

## 5. Visual integration

### 5.1 DemoHub

`src/demos/_shared/DemoHub.tsx` otomatis render 9 card karena membaca `DEMOS` array. **Tidak ada perubahan kode** di DemoHub; cukup append ke DEMOS.

Urutan card (existing → new):
1. Invenflow
2. Invoice Sense
3. Channelflow
4. Kitchen Fresh
5. People & Culture
6. **Laguku** ← new
7. **TaxAI Wizard** ← new
8. **TaxAI Chat** ← new
9. **TaxAI Talk** ← new

### 5.2 Copywriting (locked)

| Demo | Title | Division | Blurb |
|------|-------|----------|-------|
| `laguku` | Laguku | AI · Music orchestration | GPT writes the lyrics, Suno composes the track — delivered via WhatsApp. |
| `taxai-wizard` | TaxAI Wizard | AI · Stripe subscription | UAE tax intelligence behind a Stripe subscription — Free Trial to Yearly. |
| `taxai-chat` | TaxAI Chat | AI · Document Q&A | Ask the UAE tax code — GPT answers with document citations. |
| `taxai-talk` | TaxAI Talk | AI · Voice pipeline | GPT reasons, ElevenLabs speaks — tax answers in multiple languages. |

### 5.3 AI stack reference (untuk README fixtures, tidak masuk DemoHub)

| Demo | AI stack | Catatan |
|------|----------|---------|
| Laguku | OpenAI GPT-4 (lyrics + mood) → kai.ai Suno (music) → WhatsApp delivery | Two-stage orchestration: text gen → music gen → delivery |
| TaxAI Wizard | Stripe + AI tax engine (subscription gate) | Wizard = onboarding layer; tax AI lives in Chat/Talk |
| TaxAI Chat | GPT-class chat + document upload (RAG-lite) | Token system tracks usage per user |
| TaxAI Talk | GPT reasoning + ElevenLabs voice synthesis | Real-time voice SDK; multi-lang output |

## 6. Implementation order

1. **Phase 1 — Assets + registry:** Copy 2 logo, add 4 entries ke DEMOS + DEMO_COMPONENTS, create 4 theme files.
2. **Phase 2 — Laguku:** index.tsx + routes.tsx + README. Single iframe screen, no fixtures. Verifikasi iframe loads.
3. **Phase 3 — TaxAI Wizard:** routes + mocks + 4 screens + README.
4. **Phase 4 — TaxAI Chat:** routes + mocks + 3 screens + README.
5. **Phase 5 — TaxAI Talk:** routes + mocks + 3 screens + README.
6. **Phase 6 — Hub verify:** All 9 cards render, hash routing works, theme tokens apply, no console errors.

## 7. Yang TIDAK dilakukan

- Tidak clone production code dari 4 sumber. Re-implement sintetik dari visual reference + deskripsi saja.
- Tidak pakai production fixtures, schema, atau integration client code.
- Tidak setup i18n (Arabic) meskipun production supports it — English only.
- Tidak buat backend, API route, atau Supabase changes — murni frontend mock.
- Tidak embed laguku.co admin panel (`/admin` butuh secret path) — iframe cuma public funnel.

## 8. Open questions

Tidak ada. Semua keputusan sudah dikunci di sesi brainstorming 2026-08-13.

## 9. Verifikasi

- `npm run typecheck` dan `npm run build` clean.
- Hash router: `#/demos/laguku` loads iframe; `#/demos/taxai-wizard` loads Wizard shell.
- `npm run dev` (Playwright snapshot): 9 cards di DemoHub, masing-masing navigasi benar.
- Theme override: tiap demo pakai accent color-nya sendiri (verify `--accent` di DOM).
- Iframe: laguku.co loads dalam 3 detik, mobile-first layout visible.
