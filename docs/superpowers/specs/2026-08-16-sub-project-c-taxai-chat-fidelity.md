---
title: Sub-project C — TaxAI Chat 99% production fidelity
date: 2026-08-16
status: draft
owner: Abdurrahman Firdaus
source-task: Iteration 3 / Sub-project C — re-implement chat.taxai production UI in the portfolio's TaxAI Chat prototype
parent-iteration: iteration 3 visual fidelity push
---

# Sub-project C — TaxAI Chat 99% production fidelity

## 1. Konteks & masalah

Iteration 1 + 2 added `taxai-chat` demo at `src/demos/taxai-chat/` with 3 screens (Inbox, Conversation, Settings). Iteration 3 added per-message avatars, typing indicator, hover-reveal reactions, profile mini in sidebar, QuickStart empty state. User-flagged: prototype "masih sangat tidak mirip dan terlalu generic". Want 99% production fidelity.

Production source: `chat.taxai` cloned to `/tmp/taxai-prod/chat/` for reference. Read-only.

**Production structure (verified by reading production source):**

```
src/
├── components/
│   ├── app-sidebar.tsx          (283 lines) — full sidebar: branding + sessions + new-chat + language + token + user
│   ├── app-navbar.tsx          (41 lines)  — top bar
│   ├── auth-form.tsx           (238 lines) — login/register (out of scope)
│   ├── chat-input.tsx          (46 lines)  — composer wrapper
│   ├── chat-messages.tsx       (38 lines)  — message list wrapper
│   ├── language-switcher.tsx   (112 lines) — Globe icon dropdown (EN/AR + RTL)
│   ├── subscription-info.tsx   (199 lines) — Subscription card
│   ├── theme-provider.tsx      (69 lines)  — dark mode
│   └── ui/                     — shadcn primitives (button, card, sidebar, progress, dialog, etc.)
└── app/
    └── chat/                   — Next.js pages
```

**Production brand:** AI assistant is called **"Atto"** (TaxAI / ATTO group). Sidebar header reads "Talk with Atto". Message bubbles use MarkdownRenderer. User bubbles `bg-primary text-primary-foreground`; assistant `bg-muted text-foreground`. Hover-reveal action tray positioned `absolute -bottom-4 right-2`. Language: EN/AR with RTL toggle. Animations: slide-in-from-left/right or zoom-in.

## 2. Decisions made during exploration (locked)

1. **Match production flow** — keep 3 screens (Inbox, Conversation, Settings) but re-implement each with production visual fidelity.
2. **Production brand "Atto"** — replace generic "TaxAI" placeholder with "Atto" in the sidebar header, message bubble attributions, empty state copy.
3. **Production sidebar layout** — Inbox becomes production-style AppSidebar: branding at top → "New chat" button → conversation history (with delete actions) → bottom: LanguageSwitcher dropdown + token progress + user info + Settings/Signout.
4. **Production chat message** — Conversation uses production's `chat-message.tsx` pattern: dual bubble (user right, AI left), Markdown rendering inside bubble, hover-reveal action tray at bottom-right, attachments as separate cards above the bubble.
5. **Conversation list** — production uses delete-on-hover (Trash icon). Portfolio re-implements with a hover-reveal delete button on each row.
6. **No settings page overhaul** — keep Settings screen (Language, Model, Account), but upgrade Language picker to a Globe-icon dropdown matching production's LanguageSwitcher.
7. **Subscription card** — production has a full SubscriptionInfo card. Portfolio re-implements a compact version inside Settings (Plan name + usage + upgrade CTA).
8. **No auth** — keep portfolio's session-only approach. No login/register screens.
9. **English only** for copy. RTL support out of scope for portfolio demo (production handles it via `<html dir="rtl">` toggle).
10. **No framer-motion** in portfolio demo (production uses it). Skip animations.
11. **Markdown rendering** — portfolio can do simple `**bold**` + `*italic*` parsing or just render raw text. Full markdown is overkill for demo.

## 3. Arsitektur

### 3.1 Inbox — production-style AppSidebar

Reorganize the current Inbox sidebar to match production's AppSidebar structure:

```
┌─────────────────────────────────────────────┐
│ [Atto logo] Talk with Atto     [chevron]    │  ← header with branding
├─────────────────────────────────────────────┤
│ [+ New chat]                                  │  ← outline button
├─────────────────────────────────────────────┤
│ Recent                                       │
│ ● Active session                             │  ← session row (active highlighted)
│   "VAT rate on restaurant food"               │
│   VAT · today · 8 messages                    │
│   [trash icon]                                │  ← hover-reveal delete action
│ ● Older session 1                            │
│ ● Older session 2                            │
│ ...                                           │
├─────────────────────────────────────────────┤
│ [Globe] English ▼                            │  ← language switcher dropdown
│ ── Tokens this month ──                      │  ← token quota progress bar
│ ▓▓▓▓▓▓▓░░ 87 / 300                          │
│ (SM) Sara Al-Mansouri                        │  ← user info + avatar
│ sara.mansouri@example.ae                     │
├─────────────────────────────────────────────┤
│ [Settings]                                    │  ← nav link to settings screen
│ [Sign out] (decorative — no real auth)       │
└─────────────────────────────────────────────┘
```

Production-specific differences from current iteration 3 Inbox:
- **Header** with Atto branding (was: bare Profile mini).
- **"New chat" button** as outline button at top (was: filled accent).
- **Conversation history** with **delete-on-hover** Trash icon (was: bare clickable rows).
- **Language switcher dropdown** at footer (was: bare pills in Settings screen).
- **Sign out** link (decorative, no real auth).
- **Group labels** ("Recent") matching production's `SidebarGroupLabel`.

### 3.2 Conversation — production-style chat-message pattern

Mirror production's `chat-message.tsx`:

- **Dual bubble** layout: user messages right-aligned with `bg-primary text-primary-foreground`; assistant messages left-aligned with `bg-muted text-foreground`. Portfolio maps to `var(--accent)` / `var(--accent-fg)` for user and `var(--surface)` / `var(--fg)` for assistant.
- **Avatar circles** on every bubble: user (initials), AI ("Atto"). Keep the iteration 3 avatar work.
- **Markdown rendering** in bubbles. Portfolio implements minimal `**bold**` + `*italic*` parsing (custom inline function) instead of pulling in a markdown library.
- **Hover-reveal action tray** at bottom-right of assistant bubbles: Copy + ThumbsUp + Heart (iteration 3 already has these; verify positioning matches production `absolute -bottom-4 right-2`).
- **Attachment cards** as separate items above user bubbles (not inside the bubble). Portfolio maps to a small File icon + filename pill.
- **Timestamp** below each bubble (already in iteration 3).
- **Citations** under AI messages (iteration 3 already has these).
- **Typing indicator** with 3 dots (iteration 3 already has this).
- **Composer** at bottom (already in iteration 3): paperclip + textarea + send button.

### 3.3 Settings — production-style LanguageSwitcher + SubscriptionInfo

Mirror production's components:

- **LanguageSwitcher dropdown** — Globe icon button (h-9 w-9 rounded-full) that opens a small panel with 2 options: English / العربية. Active option highlighted with primary bg. RTL toggle on Arabic (production sets `<html dir="rtl">` — portfolio skips since no real RTL).
- **Subscription card** — Card with Crown icon + plan name + usage progress bar + Change Plan / Upgrade buttons. Production has more detail; portfolio keeps it compact.
- **Account section** — already in iteration 3, keep as-is.

### 3.4 Visual styling

Production uses shadcn new-york + taxai blue accent. Portfolio maps:
- `bg-primary` → `var(--accent)` (TaxAI blue/teal).
- `text-primary-foreground` → `var(--accent-fg)`.
- `bg-muted` → `var(--surface)`.
- `text-foreground` / `text-muted-foreground` → `var(--fg)` / `var(--muted)`.
- Card borders: `var(--border)`.
- Status badges: ok (green) / warn (yellow) / bad (red) / accent.
- Shadows: `shadow-sm` (production) → portfolio's `shadow-sm`.

### 3.5 File changes summary

```
src/demos/taxai-chat/
├── mocks.ts                     # extend CONVERSATIONS + add SESSION_HISTORY, USER_META, LANGUAGES
├── routes.tsx                   # no change (still 3 screens)
├── index.tsx                    # no change
├── theme.ts (existing)          # verify accent ok
└── screens/
    ├── Inbox.tsx                # MAJOR REWRITE — production sidebar
    ├── Conversation.tsx         # MEDIUM REWRITE — production chat-message
    ├── Settings.tsx             # MEDIUM REWRITE — LanguageSwitcher + Subscription card
    ├── SidebarHeader.tsx        # NEW — extracted branding header
    ├── SidebarFooter.tsx        # NEW — extracted language + token + user footer
    ├── LanguageDropdown.tsx     # NEW — extracted Globe icon dropdown
    ├── SessionRow.tsx           # NEW — extracted conversation row with hover-delete
    └── ChatBubble.tsx           # NEW — extracted dual-bubble with markdown parsing
```

## 4. File structure

### Files to create

- `src/demos/taxai-chat/screens/SidebarHeader.tsx`
- `src/demos/taxai-chat/screens/SidebarFooter.tsx`
- `src/demos/taxai-chat/screens/LanguageDropdown.tsx`
- `src/demos/taxai-chat/screens/SessionRow.tsx`
- `src/demos/taxai-chat/screens/ChatBubble.tsx`

### Files to modify

- `src/demos/taxai-chat/mocks.ts` — extend `CONVERSATIONS`, add `SESSION_HISTORY`, `USER_META`, `LANGUAGES`.
- `src/demos/taxai-chat/screens/Inbox.tsx` — rewrite to production AppSidebar layout.
- `src/demos/taxai-chat/screens/Conversation.tsx` — use new `ChatBubble`, keep avatars/typing/reactions/citations.
- `src/demos/taxai-chat/screens/Settings.tsx` — use new `LanguageDropdown`, add compact Subscription card.

### Files NOT changed

- `src/demos/taxai-chat/routes.tsx` (still inbox | conversation | settings).
- `src/demos/taxai-chat/index.tsx`.
- `vite.config.ts` (manual chunk for taxai-chat already in place from iteration 2).
- Theme tokens (no new tokens needed; reuse existing accent/surface/border/muted/fg/ok/bad).

## 5. Implementation order

1. **Extend `mocks.ts`** — add SESSION_HISTORY (synthetic sessions), USER_META, LANGUAGES, update CONVERSATIONS with `Atto` branding references.
2. **Create `SidebarHeader.tsx`** — branding header (Atto logo + "Talk with Atto" + chevron).
3. **Create `LanguageDropdown.tsx`** — Globe icon + dropdown (EN/AR with active state).
4. **Create `SessionRow.tsx`** — single conversation row with hover-reveal Trash delete action.
5. **Create `SidebarFooter.tsx`** — composes LanguageDropdown + token progress + user info + Settings/Signout links.
6. **Create `ChatBubble.tsx`** — dual-bubble with markdown parsing + hover-reveal action tray.
7. **Rewrite `Inbox.tsx`** — uses SidebarHeader + SessionRow list + SidebarFooter.
8. **Rewrite `Conversation.tsx`** — uses ChatBubble.
9. **Rewrite `Settings.tsx`** — uses LanguageDropdown + compact Subscription card.
10. **Smoke test + README** — boot dev server, walk through 3 screens, update README.

## 6. Yang TIDAK dilakukan

- Tidak clone production code (read-only)
- Tidak setup real auth / MongoDB / OpenAI backend
- Tidak add framer-motion animations
- Tidak add full markdown library (rendering limited to `**bold**` + `*italic*`)
- Tidak add RTL toggle (production has it via `<html dir="rtl">`)
- Tidak add realtime chat polling
- Tidak add full SubscriptionInfo card (compact version only)
- Tidak add Login/Register screens (portfolio is session-only)

## 7. Verifikasi

- `npx tsc --noEmit -p tsconfig.app.json` clean
- `npm run build` clean
- Dev server at port 3001: navigate `#/demos/taxai-chat`
  - Inbox: Atto branding header, "New chat" button, 4-6 session rows with hover-delete, LanguageSwitcher (Globe icon dropdown), token progress bar, user info, Settings link
  - Conversation: dual bubble (Atto avatar left, user SM right), Markdown rendering in bubbles, hover-reveal actions on assistant bubbles, citations, typing indicator, paperclip+send composer
  - Settings: Globe icon → English/العربية dropdown with active state, Subscription card (Crown icon + plan + usage + Change Plan/Upgrade), Account section

## 8. Commit strategy

Single feature commit at end (consistent with sub-project B):
- `feat(taxai-chat): rewrite to 99% match production chat.taxai`

## 9. Risks & mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| SessionRow hover-delete confusing on touch devices | Low | Add aria-label + onClick handler visible always, hover just provides visual cue |
| Atto branding might confuse users (it's "TaxAI Wizard" elsewhere) | Low | Document in README — production's actual product name is ATTO |
| Mini markdown parser may miss edge cases (nested bold/italic) | Medium | Acceptable for demo — production uses full markdown library |
| Sidebar header overlaps with Shell sidebar | Low | Use absolute max-width on SidebarHeader, fit within Shell's sidebar slot |
| LanguageSwitcher dropdown clipped by Shell's overflow:hidden | Medium | Use fixed positioning for the dropdown panel (production uses absolute) |

## 10. Implementation phases (mapped to subagent tasks)

Each phase = 1 subagent task with full review cycle:

- **C.1**: Foundation — extend `mocks.ts` + create `SidebarHeader.tsx` + `LanguageDropdown.tsx`.
- **C.2**: SessionRow + SidebarFooter (sidebar body composition).
- **C.3**: ChatBubble + Conversation rewrite.
- **C.4**: Inbox rewrite + Settings rewrite.
- **C.5**: Wire index + smoke test + README.