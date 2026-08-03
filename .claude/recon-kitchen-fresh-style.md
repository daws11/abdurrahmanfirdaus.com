# Recon — Kitchen Fresh (production app)

Read-only visual recon. No source copied; values extracted from local files at
`/Users/yanuar/Documents/Kitchen-app/kitchen-fresh`. App is a "Food Freshness
Manager for Nasi Campur Restaurant" — staff-facing timer/dashboard tool for
tracking dish freshness in a kitchen.

## 1. UI location

- `client/` exists; standard Vite React app.
- `client/index.html` — entry HTML.
- `client/src/main.tsx` — entry script.
- `client/src/App.tsx` — wraps providers + Router (`wouter`).
- `client/src/components/MainApp.tsx` — top-level shell (sidebar + route switch).
- `client/src/components/UnifiedSidebar.tsx` — sidebar nav.
- `client/src/pages/*.tsx` — page-level routes (14 files).
- `client/src/components/ui/*` — shadcn primitives (50 components present).
- Theme lives in `tailwind.config.ts` (root) + `client/src/index.css`.

## 2. Brand & theme

Source: `tailwind.config.ts`, `client/src/index.css`.

### Accent
- `--primary` light: `219 95% 45%` (blue, ~ `#1d4ed8` family)
- `--primary` dark: `219 95% 55%`
- Used for primary buttons, active sidebar items, brand badge (`bg-primary`).
- App is NOT emerald-themed — primary is blue. Distinct from portfolio accent.

### Background / surface (light mode, default)
- `--background`: `0 0% 98%` (off-white page bg)
- `--card`: `0 0% 100%` (white cards)
- `--sidebar`: `0 0% 96%` (slightly darker neutral than page bg)
- `--foreground`: `0 0% 10%` (near-black text)
- `--muted`: `0 2% 92%` (muted surfaces)
- `--muted-foreground`: `0 0% 40%`
- `--border`: `0 0% 88%`
- `--card-border`: `0 0% 94%`
- `--sidebar-border`: `0 0% 90%`
- `--input`: `0 0% 80%`

### Background / surface (dark mode)
- `--background`: `222 47% 11%` (deep slate-blue)
- `--card`: `220 26% 14%`
- `--sidebar`: `222 47% 8%`
- `--foreground`: `0 0% 95%`
- `--border`: `220 26% 18%`

### Status / chart palette (used by timer cards)
- `--chart-1` (good / green): `142 76% 36%` light / `45%` dark
- `--chart-2` (alert / yellow): `45 93% 47%` light / `55%` dark
- `--chart-3` (check/replace / red): `0 84% 60%` light / `65%` dark
- `--chart-4` (empty / grey): `210 11% 71%` light / `60%` dark
- `--chart-5` (matches primary blue): `219 95% 45%`
- `--destructive`: `0 84% 60%` (red, used for destructive buttons / errors)
- Also has `status.{online,away,busy,offline}` RGB literals (green/amber/red/grey).

### Font family
- Sans: `Inter, sans-serif` (`--font-sans` → `font-sans`)
- Serif: `Georgia, serif` (`--font-serif`)
- Mono: `Menlo, monospace` (`--font-mono`)
- `index.html` preloads many Google fonts (Geist, Inter, DM Sans, Space Grotesk,
  Plus Jakarta Sans, etc.) — but runtime default is Inter only.

### Border radius
- Base `--radius`: `.5rem` (8px)
- Extended scale: `lg` 9px, `md` 6px, `sm` 3px.
- Cards use `rounded-xl` (1rem, default shadcn card primitive).
- Buttons: `rounded-md`.
- Badges: `rounded-md`.
- Inputs: default shadcn (`rounded-md`).

## 3. Shell anatomy

Source: `client/src/components/UnifiedSidebar.tsx`, `client/src/components/ui/sidebar.tsx`,
`client/src/components/MainApp.tsx`.

- **Sidebar**: standard shadcn sidebar component.
  - Width: `16rem` (256px) expanded, `3rem` (48px) collapsed icon-only,
    `18rem` on mobile.
  - Background: `bg-sidebar` (light = `0 0% 96%`, dark = `222 47% 8%`).
  - Foreground: `text-sidebar-foreground`.
  - Header: brand mark "Kitchen Fresh" with `Clock` icon in a `bg-primary`
    rounded square.
  - Nav: group of `SidebarMenuItem` rows with lucide icons (Home, Gauge,
    Utensils, Calculator, TrendingUp, etc.).
  - Footer: user avatar + dropdown menu (Logout / view options) and a
    "Business" outlet-scope selector.
- **Top bar**: none. No persistent top app bar — sidebar fills full height
  (`min-h-svh`), main content is `SidebarInset` with `flex-1 overflow-auto`.
- **Main content background**: inherits `--background` (off-white / dark slate).
- **Auth state**: when unauthenticated, full-screen login form replaces shell.
- **Default mode**: **light** (no `dark` class set on `<html>` or `<body>` in
  `index.html` or `main.tsx`; `darkMode: ["class"]` so user/system can flip).

## 4. Density & primitives

Source: `client/src/components/ui/{card,button,badge,table}.tsx`,
`client/src/components/DishManager.tsx`, `FoodItem.tsx`.

- **Padding scale** in use: `p-2`, `p-3`, `p-4`, `p-6`. Card default `p-6`,
  dense lists use `gap-2` / `space-y-2`.
- **Radius**: `rounded-md` for buttons/badges/inputs, `rounded-xl` for cards,
  `rounded-lg` for brand chip and dropdown items.
- **Status pill / tag**: shadcn `<Badge>` only — variants `default` (primary),
  `secondary` (neutral), `destructive` (red), `outline`. No colored
  success/warn variants in the primitive itself; status colors live on
  `bg-food-*` classes for the timer cards.
- **Food status colors** (timer tile background, from `FoodItem.tsx`):
  - `empty` → `bg-food-empty` (chart-4 grey)
  - `good` → `bg-food-good text-white` (chart-1 green)
  - `alert` → `bg-food-alert text-foreground` (chart-2 yellow)
  - `check` → `bg-food-check text-white` (chart-3 red)
  - `replace` → `bg-food-replace text-white animate-pulse` (chart-3 red, blinks)
- **Table row height**: `h-12` header cells, body cells default `p-4`. Hover:
  `hover:bg-muted/50`. Rows separated with `border-b`.
- **Buttons**: `min-h-9 px-4 py-2` default, `min-h-8` sm, `min-h-10` lg,
  `h-9 w-9` icon. Variants: default / destructive / outline / secondary / ghost.
- **Card**: `bg-card border border-card-border shadow-sm rounded-xl`.
- **Elevation utility**: custom `hover-elevate` / `active-elevate-2` utilities
  in `index.css` for subtle hover/active states.

## 5. Routes & screens

From `client/src/components/MainApp.tsx` `switch (location)`:

- `/` — Dashboard (DemandSummaryDashboard)
- `/fresh-counter` — live dish timer board
- `/print-label` — label printer
- `/dishes` — dish manager (CRUD)
- `/logs` — activity logs
- `/manager` — manager view
- `/demand-calculator` — demand forecast
- `/settings` — settings panel
- `/receipt-log` — receipt log
- `/sales-analytics` — sales analytics
- `/sales-margin-analytics` — sales margin analytics
- `*` (404) — not-found

11 primary routes + 404.

## 6. NDA check (flag only, not read)

In repo root `/Users/yanuar/Documents/Kitchen-app/kitchen-fresh/`:

- `.env` (real)
- `.env.example`, `.env.auth.example` (templates)
- `Acai Queen Mapping Table.csv`, `Dish_List.csv`,
  `Example Acai Queen.csv`, `TIB_Mapping_Table*.csv`,
  `Tspoonlab Sales Correction*.csv`, `tspoonlab-*.csv`,
  `tspoonlab-sales-20260302*.csv` — vendor / sales data
- `iseller-wbhook-data.json`, `webhook_data_yesterday.json`,
  `receipt_data.json` — webhook payloads
- `debug-react-error.html`, `demand_calculator.html`, `idk.html`,
  `matching-table*.html`, `parser-example.html`, `recipe-per-dishes-cost.html`,
  `tspoonlab_order_test.html` — debug/internal HTML
- `attached_assets/`, `backups/`, `exported-csv/`, `logs/`, `migrations/`,
  `docs/`, `client/dev-dist/`, `client/.playwright-mcp/`, `client/public/` —
  excluded from this scan but present at 1 level deep.

Under `client/` 1 level deep:

- No additional `.env*`, `seed*`, `webhook*`, `iseller*`, `xero*`, or `BNI*`
  files matched the pattern.

These are flagged so the prototype team knows the real integrations and data
shapes that exist but **must NOT be reproduced or referenced** in
`src/demos/`.