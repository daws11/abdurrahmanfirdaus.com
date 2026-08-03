# Visual-style recon: people-and-culture-app (PeopleOS)

Read-only pass over `/Users/yanuar/Documents/PC/people-and-culture-app` to extract brand/visual tokens a fresh prototype team can use to recreate the look without copying source. No code is transcribed; only concrete values are recorded.

---

## 1. UI source location

Monorepo, pnpm. Web app is the primary target.

| Path | Purpose |
|---|---|
| `packages/frontend/` | **Web app (Vite + React + TS + Tailwind).** The UI source. |
| `packages/backend/` | API (skipped — not UI). |
| `packages/shared/` | Shared types (skipped). |
| `design-system/` | **Brand tokens, fonts, color doc.** Source of truth for the prototype. |
| `shell/` | Older shell README + components dir (lightweight wrapper; superseded by `packages/frontend/src/components/shell/`). |
| `sections/` | Per-section packages (training-player, analytics-and-tracking, etc.) — read component code here for visual reference, no copy. |
| `mobile/` | React Native app. **Skipped** (only design tokens are shared with web, and those live in `design-system/`). |
| `docs/`, `prompts/`, `scripts/`, `pm2/`, `instructions/` | Non-UI infra. |
| `PRD.md`, `data-shapes/`, `product-overview.md`, `roadmap.md`, `CONNECTEAM_UI_PLAN.md`, `WORKFORCE_UI_CONSISTENCY.md`, `REFACTOR_OUTLET_SCHEDULE.md`, `CLAUDE.md` (root) | **NDA-sensitive docs — flagged, not read.** |

**Pick:** `packages/frontend` is the web UI source. `design-system/` is the brand source of truth.

---

## 2. Brand & theme

### Tokens (`design-system/tokens.css` and `packages/frontend/src/styles/global.css` are equivalent)

CSS custom properties are declared but Tailwind class names are used directly in components. Treat the named Tailwind colors as the canonical palette.

| Role | Light | Dark | Notes |
|---|---|---|---|
| **Primary accent** | `indigo-600` `#4F46E5` | `indigo-400/500` | Brand purple. Buttons, focus ring, active nav, brand-tint of native form controls (`accent-color: var(--color-primary-600)` on `html`). |
| Primary scale | `indigo-50` … `indigo-950` | | Full standard Tailwind indigo ramp defined. |
| **Secondary** | `amber-500/600` | `amber-300` | Tags, highlights, warning states, impersonation banner. |
| **Neutral** | `slate-50` … `slate-950` | | Backgrounds, text, borders, cards. **No custom slate ramp** — uses stock Tailwind slate. |
| **Background (app body)** | `slate-50` `#F8FAFC` | `slate-950` `#020617` | Default body bg. |
| **Card surface** | `white` | `slate-900` | |
| **Border (default)** | `slate-200` `#E2E8F0` | `slate-800` `#1E293B` | 1px. |
| **Muted text** | `slate-500/600` | `slate-400` | |
| **Body text** | `slate-900` | `slate-100` | |
| **Success** | `emerald-100/700`, `green-100/700` | `emerald-900/35` + `emerald-300`, `green-900/35` + `green-300` | Both used (StatusPill uses green; emeralds appear for "published"). |
| **Warning** | `amber-100/800` | `amber-900/35` + `amber-300` | |
| **Danger / rejected** | `rose-100/700` (and `red-600` for buttons) | `rose-900/35` + `rose-300` | |
| **Impersonation banner** | `amber-500` solid white text | | Distinct, not a Tailwind class — direct `bg-amber-500`. |

### Typography

`design-system/fonts.md` originally specified **DM Sans** (headings + body) and **IBM Plex Mono** (code), loaded from Google Fonts. **In practice, the current app does not load DM Sans** — `tokens.css` and `global.css` both comment that the old webfont was never loaded and silently fell back to the system stack. Inline styles in `AppShell.tsx` still set `style={{ fontFamily: "'DM Sans', sans-serif" }}` on shell elements, but the resolved face is the system stack.

For a prototype that should *look* like PeopleOS:

- **Sans (UI body + headings):** native system stack — `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`. **Equivalent intent to load DM Sans**; matches the RN app's OS-font choice.
- **Mono:** `IBM Plex Mono, ui-monospace, SFMono-Regular, Menlo, monospace` (defined; minimal use in UI).
- The `design-system/tokens.css` `--font-heading` and `--font-body` both alias to the system stack. `--font-mono` is the only custom one.

### Border radius convention

Mixed, **not** uniform. Two distinct scales:

- **Cards (`Card.tsx`):** `rounded-2xl` (16px). White/slate-900 surface, 1px slate-100/slate-800 border, `shadow-sm`. Comment in source explicitly says "mirrors the RN Card: 16px radius".
- **Buttons (`Button.tsx`):** `rounded-xl` (12px). Comment: "mirrors the RN PrimaryButton (borderRadius 14)". Filled variants carry `shadow-lg shadow-indigo-500/30` (colored shadow).
- **Inputs (`Input.tsx`):** `rounded-xl` (12px). `py-2.5` (taller than default). Border `slate-300` / `slate-700`.
- **StatusPill:** `rounded-full` (pill).
- **Badge:** `rounded-md` (6px).
- **Nav items (MainNav):** `rounded-md`.
- **Mobile bottom nav (MobileBottomNav):** `rounded-2xl` floating pill.
- **Default global `rounded-md` in `global.css` button base class** for `.btn-*` legacy classes.

**Takeaway:** a fresh prototype should pick 12px (`rounded-xl`) for inputs/buttons and 16px (`rounded-2xl`) for cards to match the perceived PeopleOS feel — these are the two dominant radii.

### Other global CSS

- `html` has `overscroll-behavior: none` and `touch-action: manipulation` (mobile-app feel).
- `accent-color: var(--color-primary-600)` on `html` — tints native checkboxes/radios/date pickers to indigo.
- Custom thin scrollbar (6px thumb, `#cbd5e1` / `#334155` dark). Coarse-pointer (touch) devices hide scrollbar entirely.
- Body text is `bg-slate-50 text-slate-900` (light) / `bg-slate-950 text-slate-100` (dark).

---

## 3. Shell anatomy

Files: `packages/frontend/src/components/shell/AppShell.tsx`, `MainNav.tsx`, `MobileTopBar.tsx`, `MobileBottomNav.tsx`.

### Light vs dark mode

- `darkMode: 'class'` in `tailwind.config.js`. Both modes are fully designed; light is the **default** (`body` is `bg-slate-50 text-slate-900`).
- Dark mode toggled via `useUIStore.toggleDarkMode()`; user menu exposes it.

### Desktop / admin shell

- **Root container:** `h-screen supports-[height:100dvh]:h-dvh flex bg-slate-50 dark:bg-slate-950`.
- **Sidebar (left):**
  - Background: `bg-white dark:bg-slate-950`.
  - Width: `w-64` (256px) expanded, `w-16` (64px) collapsed. Collapse state auto-set on tablet (`md`-`lg` viewport).
  - Right border: 1px `border-slate-200 dark:border-slate-800`.
  - Logo bar: `h-14`, brand mark (32px) + "PeopleOS" wordmark.
  - Below: scrollable nav (`py-3 px-2 space-y-0.5`), then bottom Settings item, then `UserMenu`.
- **Active nav item:** `bg-indigo-50 text-indigo-700` (light) / `bg-indigo-950/50 text-indigo-300` (dark), with a `3px × 20px` `bg-indigo-600` left bar (`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full`). Inactive: `text-slate-600` / `dark:text-slate-400` with `hover:bg-slate-100`.
- **Icons:** Lucide, `strokeWidth={1.5}`, size 18px.
- **Top bar (admin mobile only):** `h-14 px-4` with hamburger + "PeopleOS" text. `bg-white/90 dark:bg-slate-950/90 backdrop-blur-md`, `border-b border-slate-200 dark:border-slate-800`.
- **Main content area:** `flex-1 flex flex-col min-w-0`; `<main>` is `flex-1 overflow-y-auto` with no extra background (inherits body `slate-50` / `slate-950`).
- **Impersonation banner:** `sticky top-0 z-50`, `bg-amber-500 text-white` (the only solid non-utility color in the chrome).

### Mobile / employee shell (employees get a different layout — keep in mind)

- **Sidebar hidden**, replaced by:
- **Mobile top bar:** `h-14 px-4`, `bg-white/90 dark:bg-slate-900/90 backdrop-blur-md`, `border-b`. Root routes show "PeopleOS" title + search icon + bell (with unread `bg-rose-500` dot). Sub-routes show back button + page title.
- **Mobile bottom nav:** Floating **pill** (`fixed inset-x-0`, `mx-3 rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-lg`), 5 tabs (Home, Shifts, Time Clock, Tasks, Profile). Active tab: `text-indigo-600` with `bg-indigo-50 dark:bg-indigo-500/15` pill behind the icon (icon bumps up `-translate-y-px` and `stroke-[2.25]`).
- **Pull-to-refresh indicator:** circular `w-9 h-9` `bg-white dark:bg-slate-800` with indigo `ArrowPathIcon` (heroicons), used only on employee mobile.

### UserMenu (sidebar bottom)

- User avatar + name + dropdown with: profile, dark-mode toggle, logout.

---

## 4. Density & primitives

Files: `packages/frontend/src/components/ui/{Card,Button,Input,Table,StatusPill,Badge,SectionLabel}.tsx`.

### Padding / spacing scale (observed)

- **Page content (admin):** `p-4` for typical page wrapper; `space-y-4` between cards; the page skeleton uses `p-4 space-y-4` with cards `p-4 space-y-3`.
- **Card padding:** `p-4` (used in skeleton) to `p-6` (table cells). No standard size; pattern is "snug, not airy".
- **Nav rows:** `px-3 py-2` (top-level) / `pl-9 pr-3 py-1.5` (indented children).
- **Button heights:** `py-1.5` sm, `py-2` md, `py-3` lg — i.e. ~32 / 36 / 44px.
- **Input:** `py-2.5` (taller than default).
- **Table header:** `px-6 py-3`, uppercase `text-xs font-medium` `tracking-wider` `text-gray-500`. (Note: header uses `gray-*` while rest of design uses `slate-*` — a mild inconsistency in the prototype base.)
- **Table body cells:** `px-6 py-4 whitespace-nowrap text-sm`. Row height ≈ 56px.
- **Page loader skeleton:** `h-7 w-2/5` (title bar) + `h-4 w-3/5` (subhead) + 4× `rounded-2xl` cards with `h-5 w-1/3` and `h-4 w-2/3` lines.

### Border radius (recap, with usage)

- `rounded-2xl` (16px) → **cards, mobile bottom-nav pill, mobile search sheet**.
- `rounded-xl` (12px) → **buttons, inputs**.
- `rounded-md` (6px) → **nav items, badges, generic containers**.
- `rounded-full` → **pills (StatusPill), avatars, FAB-style buttons**.

### Shadows

- `shadow-sm` on cards.
- `shadow-lg shadow-indigo-500/30` (and `shadow-red-500/30`) on filled primary/danger buttons.
- `shadow-lg shadow-slate-900/10 dark:shadow-black/30` on the floating mobile bottom nav.
- `shadow-md border border-slate-200` on the pull-to-refresh indicator.

### Status pill / tag colors (`StatusPill.tsx`)

Pill is `rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.04em]`. Map:

| Status | Light | Dark |
|---|---|---|
| `approved` | `bg-green-100 text-green-700` | `bg-green-900/35 text-green-300` |
| `pending`, `submitted` | `bg-amber-100 text-amber-800` | `bg-amber-900/35 text-amber-300` |
| `rejected`, `declined`, `archived` | `bg-rose-100 text-rose-700` | `bg-rose-900/35 text-rose-300` |
| `draft` | `bg-slate-100 text-slate-600` | `bg-slate-800 text-slate-300` |
| `published` | `bg-emerald-100 text-emerald-700` | `bg-emerald-900/35 text-emerald-300` |

Unknown statuses fall through to `pending`. **The StatusPill is the only place this canonical semantic-color map lives — reuse it.**

### Badge

`rounded-md px-1.5 py-0.5 text-[11px] font-bold tracking-[0.02em]`. Generic — `bg`/`fg` props for arbitrary tinted labels (e.g. task category color at 20%). No fixed palette.

### Section label

`text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-500 dark:text-slate-400`. Used above grouped cards.

### Table row height

- `h-10` header bar, `py-4` body cells (with `px-6` horizontal). Effective body row height ≈ 56px.
- `default pageSize=20`; `pageSizeOptions` opt-in (e.g. 10/20/50/All).
- Hover row: `hover:bg-gray-50 dark:hover:bg-slate-800/50` (note: hover state uses `gray`, not `slate`).
- Dividers: `divide-y divide-gray-200 dark:divide-slate-700` (thead→tbody) and `divide-gray-200 dark:divide-slate-800` (rows).

### Density verdict

PeopleOS is **compact-medium**: tighter than Linear, looser than Notion. Cards are padded 4-6, table rows ~56px, buttons ~36px. Defaults: `text-sm` (14px) for body, `text-[11px]` for tags/labels, `text-xs` for table headers, `text-base` for top-bar titles.

---

## 5. Top-level routes (web)

From `packages/frontend/src/App.tsx`. Auth-gated routes are wrapped in `<ShellLayout>` (i.e. they all live under `/`). Public/standalone routes sit outside the shell.

**Shell routes (`/...`, protected):**

- `/dashboard` — admin home
- `/home` — employee feed (mobile-first)
- `/shifts`, `/time-clock`, `/time-off`, `/tasks`, `/tasks/:id`, `/swap-requests` — employee self-service
- `/forms`, `/forms/:id`, `/forms/my-submissions`
- `/profile`, `/profile/settings`, `/quick-actions`, `/notifications`
- `/training-player` (employee), `/training-builder` (admin), `/training-builder/new`, `/training-builder/:id`, `/training-player/:id`, `/training-analytics/:id`
- `/question-bank`, `/assignments`, `/analytics`, `/video-bank`
- `/hiring`, `/hiring/jobs`, `/hiring/candidates`, `/hiring/jobs/:jobId/candidates`, `/hiring/jobs/:jobId/candidates/:candidateId`, `/hiring/question-bank`, `/hiring/analytics`
- `/human-resources`, `/users`, `/departments`, `/employees`, `/employees/:id`
- `/workforce` (redirects to `/workforce/overview`), `/workforce/overview`, `/workforce/locations`, `/workforce/skills`, `/workforce/gps`, `/workforce/scheduling`, `/workforce/scheduling/:outletId`, `/workforce/time-clock-lobby`, `/workforce/time-clock-lobby/attendance`, `/workforce/time-clock-lobby/attendance/:slug`, `/workforce/attendance` (redirect), `/workforce/my-time-clock`, `/workforce/requests`, `/workforce/tasks`, `/workforce/announcements`, `/workforce/celebrations`, `/workforce/forms`, `/workforce/forms/new`, `/workforce/forms/:id/edit`, `/workforce/forms/:id/submissions`, `/workforce/forms/pending`
- `/whatsapp`, `/ai-agent` — admin only
- `/chat` — team chat
- `/settings`

**Outside shell (public/standalone):**

- `/login`, `/first-login`, `/forgot-password`, `/reset-password`
- `/get-app` — public PWA install page
- `/careers`, `/careers/complete`, `/careers/:jobId/*` — public hiring
- `*` → role-aware redirect (`/dashboard` for admin, `/home` for user)

> Note: many URLs are also reachable via direct nav items in `MainNav`; the sidebar groups them under Training / Hiring / Workforce / and top-level items.

---

## 6. NDA check (presence only — **not read**)

Root of `people-and-culture-app/`:

- `PRD.md` — present (21KB). **NDA-flagged, not read.**
- `product-overview.md` — present (~3KB). **NDA-flagged, not read.**
- `data-shapes/` — present (`overview.ts`, `README.md`). **NDA-flagged, not read.**
- `roadmap.md` — present (48KB). Planning doc, NDA-adjacent. Not read.
- `CONNECTEAM_UI_PLAN.md` — present (10KB). Design competitor analysis, NDA-adjacent. Not read.
- `WORKFORCE_UI_CONSISTENCY.md` — present (18KB). UI consistency notes, NDA-adjacent. Not read.
- `REFACTOR_OUTLET_SCHEDULE.md` — present (10KB). Refactor plan, NDA-adjacent. Not read.
- `CLAUDE.md` (root) — present (5KB). Project-specific agent instructions. Not read.
- `instructions/` — present. Likely NDA-adjacent. Not read.
- `docs/` — present. Not read.

`packages/frontend/` (1 level in):

- `package.json`, `vite.config.ts`, `tsconfig.json`, `tailwind.config.js`, `index.html` — UI config only.
- `public/` — static assets (icons in `icons/`).
- `scripts/` — likely build/dev scripts.
- `src/` — components, pages, hooks, store, services, styles, lib, i18n, utils, vite-env.
- No `.env*`, `seed*`, `*Webhook*`, `*api*key*`, `.csv` found at maxdepth 3.
- No `*Webhook*` / `*webhook*` / `*api*key*` matches anywhere outside `backend/` and `mobile/` (under `node_modules` excluded).

`packages/frontend/src/` (next 1 level):

- `pages/` — large set of page components; no `.env*` / `seed*` / `*.csv` / `*webhook*` matches.
- `services/` — likely contains `api.ts`, `pushClient.ts`, `haptics.ts`, `pageCache.ts`. **Not read** (could contain endpoint shapes).

`design-system/`:

- `tokens.css`, `fonts.md`, `tailwind-colors.md` — already read (safe, no secrets).
- `brand/` — image assets only (icon, mark, logo).

**Conclusion:** Highest-NDA surfaces (PRD, product-overview, data-shapes) are present and untouched. No `.env*` or seed data in the web app. Webhooks are presumably in the backend (not opened). All design decisions in this report are sourced from `design-system/tokens.css`, `global.css`, `tailwind.config.js`, and the public UI primitives in `src/components/ui/` and `src/components/shell/`.

---

## Prototype checklist (for the team)

When building a UI-only prototype in the same brand identity:

1. **Primary accent:** indigo-600 (`#4F46E5`). Use `bg-indigo-600 text-white` for primary buttons, `bg-indigo-50 text-indigo-700` for active nav, `text-indigo-600` for active tab.
2. **Background:** `bg-slate-50` light / `bg-slate-950` dark; cards `bg-white` / `dark:bg-slate-900`.
3. **Borders:** `border-slate-200` / `dark:border-slate-800`, 1px.
4. **Fonts:** system stack (`-apple-system, BlinkMacSystemFont, …`); treat "DM Sans" as a placeholder for "modern geometric sans" — fine to keep system stack or substitute Inter/DM Sans.
5. **Radii:** `rounded-2xl` for cards, `rounded-xl` for buttons/inputs, `rounded-md` for nav items, `rounded-full` for pills.
6. **Sidebar:** 256px expanded / 64px collapsed, white/slate-950 surface, indigo-50 active state with 3px indigo-600 left bar.
7. **Top bar:** 56px (h-14), white/90 with backdrop-blur, slate-200 bottom border.
8. **StatusPill palette:** green-100/approved, amber-100/pending, rose-100/rejected, slate-100/draft, emerald-100/published. `text-[11px] font-bold uppercase tracking-[0.04em]`.
9. **Table:** thead `px-6 py-3 text-xs uppercase tracking-wider text-gray-500`, rows `px-6 py-4 text-sm`, hover `bg-gray-50`, divide `divide-gray-200`.
10. **Density:** 14px body (`text-sm`), 11px labels, ~56px table rows, ~36px buttons, card padding 4-6.
11. **Impersonation banner / distinct chrome accent:** `bg-amber-500 text-white` sticky strip — unique to this app, can be skipped in a generic prototype.
12. **Light mode is default**; dark mode is fully designed and class-driven.
