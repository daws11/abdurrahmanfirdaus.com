# channelflow — visual style recon

Read-only. No code copied. Patterns only, for a fresh prototype team to recreate brand identity.

## 1. UI location

Working directory: `/Users/yanuar/Documents/channelflow/apps/web/`

Top-level (1 level deep):

```
Dockerfile  README.md  eslint.config.mjs  next-env.d.ts  next.config.ts
package.json  postcss.config.mjs  public/  src/  tsconfig.json
```

Representative files per pattern:

- **Entry**: `src/app/layout.tsx` (root layout, sets fonts + ThemeProvider)
- **Route group**: `src/app/(app)/layout.tsx` (auth + AppShell wrapper)
- **Page**: `src/app/(app)/inbox/[[...id]]/page.tsx` (deep-link catch-all)
- **Shell**: `src/shell/AppShell.tsx` + `src/shell/MainNav.tsx`
- **Theme**: `src/app/globals.css` (single CSS file, no `tailwind.config.*`)

Note: this is **Next.js 16 App Router** (not Vite). No `tailwind.config.*` file exists — uses Tailwind v4 inline `@theme` directives in `globals.css`.

## 2. Brand & theme

Source: `apps/web/src/app/globals.css`

- **Accent**: emerald (Tailwind). Active nav uses `bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400`. Logo tile uses gradient `from-emerald-500 to-emerald-700`. Buttons spinner uses `border-t-emerald-600`. Focus rings use `ring-emerald-500/20`.
- **Background**:
  - light: `--background: #ffffff` (shell uses `bg-slate-50`)
  - dark: `--background: #0f172a` (slate-900)
- **Foreground**: slate-900 (light) / slate-50 (dark)
- **Muted**: slate-500 / slate-400
- **Borders**: `border-slate-200` (light) / `border-slate-800` (dark) — 1px
- **Fonts**:
  - sans: `Inter` (via `next/font/google`, variable `--font-sans`)
  - mono: `JetBrains Mono` (variable `--font-mono`)
- **Radius**: `rounded-lg` is the default (12px); tooltips `rounded-md` (6px); modal `rounded-2xl` (16px); avatars/badges `rounded-full`
- **Plugins**: `tailwindcss-animate` for animations

## 3. Shell anatomy

Source: `src/shell/AppShell.tsx`, `src/shell/MainNav.tsx`, `src/app/(app)/layout.tsx`

- **Layout**: vertical flex; sidebar rail on left, main content fills remainder
- **Sidebar (desktop)**: `w-16` (64px) rail, `bg-white` / `dark:bg-slate-950`, `border-r border-slate-200`, `py-4`. Fixed icon-only nav (no labels — tooltip-on-hover). Logo tile at top: `h-9 w-9 rounded-lg` emerald gradient.
- **Top bar**: none. Header lives inside each page (e.g. `ConversationHeader.tsx`).
- **Bottom mobile tab bar**: `h-16 fixed bottom-0` with `border-t border-slate-200`, `bg-white`, `pb-[env(safe-area-inset-bottom)]`. 4 primary tabs + notification tab + "More" overflow. 7 items fold into the rail on desktop.
- **Main content background**: `bg-slate-50` (light) / `dark:bg-slate-950` (dark) — applied on the AppShell root
- **Nav icons**: `h-10 w-10 rounded-lg` tiles, `h-5 w-5` icon, `strokeWidth={2}` (active `2.25`)
- **Default mode**: `light` (per `ThemeProvider defaultTheme="light" enableSystem`)
- **Status dots on icons**: `healthy: bg-emerald-500`, `warning: bg-amber-500`, `error: bg-rose-500` (2.5×2.5 ring-2)
- **Badge pill**: `bg-emerald-600 text-white ring-2 ring-white`

## 4. Density & primitives

Sample: `src/components/centralized-inbox/ConversationList.tsx`, `ChannelChip.tsx`, `Avatar.tsx`, `FolderTabs.tsx`

- **Padding scale** (observed):
  - List header: `px-4 py-3`
  - Search bar: `px-3 py-2.5`
  - Tab row: `px-2 py-2`
  - Empty state: `px-6 py-16`
  - Row vertical: `py-1` (compact rows)
- **Heights**:
  - Buttons: `h-9` (logo), `h-10` (nav icons), `h-16` (mobile bar)
  - Inputs: `py-1.5` inline search
  - Spinner: `h-8 w-8`
- **Radius**:
  - Buttons/cards: `rounded-lg`
  - Inputs/pills: `rounded-md`
  - Modal: `rounded-2xl`
  - Chips/badges/avatars: `rounded-full`
- **Status pill conventions** (from `ConversationList.tsx` GOAL_BADGE):
  - Interested: `bg-emerald-50 text-emerald-700` (dark `emerald-950/40` + `emerald-300`)
  - Booking: `bg-blue-50 text-blue-700`
  - Booked: `bg-green-50 text-green-700`
  - Lost: `bg-rose-50 text-rose-600`
- **Channel chip colors** (from `ChannelChip.tsx`):
  - WhatsApp: emerald, **Instagram DM**: violet, **Email**: sky, **TikTok**: slate, **IG comment**: bordered violet
- **Avatar**: gradient `from-slate-200 to-slate-300` (light) / `slate-700 to slate-800` (dark); sizes xs/sm/md/lg = `h-6/h-8/h-10/h-12`; ring options: emerald or violet
- **Focus ring**: `focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20`
- **Row height**: not explicit (no `h-` on list rows); driven by `py-1` + text size. Compact, dense, mail-client style.

## 5. Routes & screens

Top-level routes from `src/app/(app)/`:

1. `/inbox` (catch-all `[[...id]]` — drives conversation deep-links)
2. `/outbound`
3. `/analytics`
4. `/bookings`
5. `/ai`
6. `/channels`
7. `/settings`
8. `/profile`
9. `/share` (public, outside `(app)`)
10. `/login`

## 6. NDA check (presence only, not read)

Files of concern found by `find` (none read):

- `.env`, `.env.example` (root)
- `apps/server/migrations/0015_seed_email_filter_defaults.sql`
- `apps/server/migrations/0042_seed_quick_replies.sql`
- `apps/server/scripts/seed-menu.ts`
- `apps/server/scripts/seed-kb.ts`
- `apps/server/scripts/seed-prompt-blocks.ts`
- `apps/server/src/routes/webhook.ts`

No matches for `iseller*`, `xero*`, `BNI*`, real-looking `.csv`, `.json`, or `.html` outside `node_modules` / `.git` / `.next`.

Confirm the project also still has `apps/server/` (server API) and `apps/booking/` (separate Vite app) — recon scope was `apps/web/` only.

## Quick spec for prototype

- **Framework**: Next.js 16 + React 19 + Tailwind v4 (CSS-based config, no `tailwind.config*`)
- **Accent**: emerald (`#10b981`); accent CTA gradient `emerald-500 → emerald-700`
- **Surface palette**: white / slate-50 (page) / slate-900 (dark)
- **Text**: slate-900 / slate-500 / slate-400
- **Borders**: slate-200 / slate-800 (1px)
- **Font**: Inter (sans), JetBrains Mono (mono for codes/timestamps)
- **Radius**: `rounded-lg` default, `rounded-md` for inputs, `rounded-full` for chips
- **Shell**: 64px left icon rail (desktop), 64px bottom tab bar (mobile), no top bar
- **Density**: compact, `py-1/2/3`, mail-client feel; tabs `h-10`; button `h-9`
- **Status**: emerald (good) / amber (warn) / rose (error); also blue/green/violet for categorical channel badges
- **Icons**: `lucide-react` (v0.468), `strokeWidth={2.25}` for active, `2` for inactive
