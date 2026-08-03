# Recon: invenflow — visual style summary

Read-only visual recon. **No code was transcribed.** Values are reported as
concrete tokens / classes for use by a fresh prototype team.

Source of truth: `packages/frontend/` (Vite + React 19 + Tailwind v3).
Reference doc in source: `docs/DESIGN_SYSTEM.md` (not opened; tokens captured
from `tailwind.config.js` and `src/styles/globals.css` are the surface area
the team needs).

---

## 1. UI location

This repo is a monorepo, not a `client/`-prefixed app. The UI is under
`packages/frontend/`.

```
packages/frontend/
├── index.html                # entry HTML; <meta theme-color> = #112239
├── tailwind.config.js        # design tokens (see §2)
├── postcss.config.js
├── vite.config.ts
├── public/                   # favicon, og-image, manifest
└── src/
    ├── main.tsx              # React 19 + BrowserRouter boot
    ├── App.tsx               # route table (see §5)
    ├── styles/globals.css    # base layer, .app-sidebar gradient, primitives
    ├── components/
    │   ├── layout/           # Layout.tsx, Sidebar.tsx, LoginForm.tsx, ProtectedRoute.tsx
    │   ├── ui/               # Button, PageHeader, Table/, Pagination, Tooltip, Toast, Skeleton
    │   ├── dashboard/        # KpiTile, ChartCard, WorkQueueCard, AlertSummary, …
    │   ├── inventory/        # InventoryList, InventoryGrid, FiltersPanel, …
    │   ├── kanban/           # boards
    │   └── status/           # StatusBadgeOverlay, StatusDetailModal
    ├── pages/                # one file per top-level screen (55 files)
    ├── hooks/, services/, store/ (Zustand), utils/, types/
    └── test/
```

Entry: `src/main.tsx`. Route table: `src/App.tsx`. Shell: `src/components/layout/Layout.tsx`. Theme: `tailwind.config.js` + `src/styles/globals.css`.

---

## 2. Brand & theme

### Brand accent (used by primary buttons, sidebar CTA echo)

`brand.500 = #1a2e4a`, `brand.600 = #112239` (sidebar gradient top),
`brand.700 = #09182b` (sidebar gradient bottom / hover). Sidebar surface is a
vertical gradient `linear-gradient(180deg, rgba(17,34,57,.98) 0%, rgba(9,24,43,.98) 100%)` defined in `.app-sidebar` (globals.css).

Sidebar text/icons on dark panel: `#d8e3f1` (primary), `#8ea1b8` (muted). Logout: `#fca5a5` / `#fecaca`.

### Accent / "primary" (interactive accents, focus rings, chart series 1)

`primary.500 = #3b82f6`, `primary.600 = #2563eb` (the "blue" used for active nav, focus ring, KPI live-pulse dot). Default focus ring: `ring-2 ring-primary-500 ring-offset-2`. Focus ring brand also surfaces as emerald: `ring-emerald-200` in some dashboard forms.

### Semantic status palette (semantic only — never decorative)

- success.500 `#22c55e`, success.600 `#16a34a`
- warning.500 `#f59e0b`, warning.700 `#b45309`
- danger.500 `#ef4444`, danger.600 `#dc2626`
- info.500 `#3b82f6` (same as primary)

### Surface neutrals (semantic tokens)

- `surface` `#ffffff` — cards, table body, input bg
- `subtle` `#f9fafb` — page background, table header, row hover
- `muted` `#f3f4f6` — disabled bg, skeleton, segmented control inactive
- Body default: `bg-subtle text-ink` (set in globals.css `@layer base`)

### Text (`ink` namespace)

- `ink.DEFAULT` `#111827` — body
- `ink.muted` `#6b7280` — secondary
- `ink.subtle` `#9ca3af` — placeholder, hints

### Borders (`line` namespace)

- `line.DEFAULT` `#e5e7eb` (gray-200) — table dividers, card border
- `line.strong` `#d1d5db` (gray-300) — input border, segmented control border

### Chart series (categorical, fixed slot order)

`chart.1 #2a78d6` blue, `chart.2 #eb6834` orange, `chart.3 #1baf7a` aqua,
`chart.4 #eda100` yellow, `chart.5 #e87ba4` magenta, `chart.6 #008300` green,
`chart.other #6b7280`. Validated for CVD; slots 1, 4, 5 are < 3:1 contrast —
ship a label or data table with every chart.

### Typography

- `<meta theme-color="#112239">`. No web font is loaded; the system stack is
  used. No `font-family` set in `tailwind.config.js` or `index.html`. The
  visual feel is system-ui sans (effectively Inter / SF / Segoe depending on
  OS), with **tabular-nums** for KPI values and money.
- No `font-mono` token is defined in the config; monospace is not used in
  shipped UI.
- Semantic sizes: `display` 30/36 700, `heading-1` 20/28 600, `heading-2`
  18/28 600, `heading-3` 16/24 600, `body-lg` 16/24, `body` 14/20,
  `caption` 12/16, `label` 12/16 500 with 0.05em tracking.
- Page title (PageHeader): `text-xl md:text-2xl font-bold text-ink`. Section
  card title: `text-heading-3` (16/24 600).

### Border radius (semantic tokens)

- `field` 6px (0.375rem) — inputs, buttons
- `card` 8px (0.5rem) — cards, panels, KPI tiles, modals outer
- `modal` 12px (0.75rem) — sliders
- `pill` 9999px — badges, status chips, avatars, segmented controls

In practice, button and most components use Tailwind's `rounded-lg` (8px) for
buttons; `rounded-md` (6px) shows up on small chips and date inputs. Status
pills: `rounded-full` = `rounded-pill`.

### Box shadow (semantic)

`shadow-card`, `shadow-card-hover`, `shadow-popover`, `shadow-overlay`,
`shadow-toast`. No raw `shadow` or `shadow-2xl` outside these. `shadow-sm` is
used on mobile header.

### z-index (semantic)

`z-dropdown 50`, `z-sticky 100`, `z-overlay 200`, `z-modal 300`,
`z-popover 400`, `z-toast 500`. No arbitrary `z-[9999]`.

---

## 3. Shell anatomy

`<Layout>` in `src/components/layout/Layout.tsx`. App variant is the default.

- **Page background:** `bg-gray-50` (= `bg-subtle` = `#f9fafb`).
- **Sidebar:**
  - Width: `w-64` expanded (16rem / 256px) ; `w-[72px]` collapsed (4.5rem).
  - Surface: vertical navy gradient `#112239 → #09182b` at 0.98 alpha
    (`.app-sidebar` in globals.css).
  - Right border: `rgba(148,163,184,0.16)`.
  - Default nav text: `#d8e3f1`. Hover: `rgba(255,255,255,0.07)` bg →
    white text. Active: `rgba(255,255,255,0.10)` bg + white text + white
    left rail (`border-blue-700` overridden to white).
  - Section group label color: `#8ea1b8`. Logout: rose-300/200.
  - Sidebar nav is collapsible (persisted). Mobile (<1024px) swaps to a
    slide-in drawer with a `bg-black/25` backdrop.
- **Top bar:** No persistent desktop top bar — the sidebar IS the chrome.
  A 56px mobile-only header (`.h-14`) is rendered below `lg` breakpoint,
  white/95 + backdrop-blur, 1px `border-gray-100` bottom, with a hamburger,
  a brand mark, and a date pill (`text-caption bg-muted rounded-pill`).
- **Content padding:** main content has `px-2 py-3 md:py-4` and
  `lg:pl-64` (or `lg:pl-[72px]` collapsed).
- **Mode:** Light only. `color-scheme: light` is set in `:root`; no `dark:`
  utility classes appear in `tailwind.config.js` or `globals.css`. There is
  no theme toggle. `<meta name="theme-color" content="#112239">` matches
  the sidebar gradient top.
- **Logo:** Custom SVG wordmark + monogram in `components/ui/Logo.tsx`.
  Brand mark uses `text-brand-600` on light surfaces, white on the navy
  sidebar.

---

## 4. Density & primitives

### Padding scale (most-used, in order of frequency)

- `p-3` (12px) — segmented control rows, list rows, small cards
- `p-4` (16px) — KPI tile, ChartCard, AlertSummary, DateRangeFilter, page
  cards (the workhorse)
- `p-2` (8px) — pill padding, filter chips
- `px-3 py-2` — compact table cells; `px-4 py-3` — regular table cells
- `px-4 py-2.5` — list rows in some dashboard cards
- `px-6 py-4` — modal header / large dialogs

### Border radius

- Buttons: `rounded-lg` (8px) per `Button.tsx`; the `.btn-primary` global
  class uses `rounded-md` (6px)
- Cards / KPI / chart: `rounded-lg` for legacy components, `rounded-card`
  (8px) in newer ones — both = 8px visually
- Inputs: `rounded-md` (6px), `rounded-field` (6px) in newer code
- Status pills / chips: `rounded-full` (= `rounded-pill`)
- Modal outer: `rounded-lg` or `rounded-modal` (12px)

### Status pill conventions

From `utils/productStatus.ts` (the canonical "what stage is this stock in"
palette used across cards, badges, filters):

| Status   | Background    | Text           | Border         |
| -------- | ------------- | -------------- | -------------- |
| incoming | `bg-gray-100` | `text-gray-700`| `border-gray-300` |
| received | `bg-blue-100` | `text-blue-700`| `border-blue-300` |
| stored   | `bg-green-100`| `text-green-700`| `border-green-300`|
| used     | `bg-purple-100`| `text-purple-700`| `border-purple-300`|

Pill shape: `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border` (StatusBadgeOverlay).

KPI accent bar (`KpiTile`) uses a 4px-wide left bar plus tinted value text:
neutral `bg-line-strong / text-ink`, info `bg-primary-600 / text-ink`,
warning `bg-warning-500 / text-warning-700`, danger `bg-danger-500 /
text-danger-700`. Live indicator: 6px `rounded-full bg-primary-600` with
`animate-pulse`.

### Button sizes (`Button.tsx`)

- `sm` `px-3 py-1.5 text-sm min-h-[2rem]` (32px)
- `md` `px-4 py-2 text-sm min-h-[2.5rem]` (40px) — default
- `lg` `px-6 py-3 text-base min-h-[3rem]` (48px)

Variants: primary (`bg-brand-600 hover:bg-brand-700 active:bg-brand-800
text-white shadow-sm`), secondary (`bg-gray-100 text-gray-900
hover:bg-gray-200 border border-gray-300`), danger (`bg-red-600
hover:bg-red-700`), ghost, outline. Focus ring: `ring-2 ring-offset-2` with
brand-500 / gray-500 / red-500 per variant.

### Input field (`.input-field`)

`w-full rounded-field border border-line-strong bg-surface px-3 py-2
text-body text-ink`, focus: `ring-2 ring-primary-500 ring-offset-1
border-primary-500`, disabled: `bg-muted text-ink-muted`.

### Table row

Default: `divide-y divide-line` between header and body. Header:
`bg-subtle sticky top-0 z-sticky`. Body: `divide-y divide-line bg-surface`.
Row hover: `hover:bg-subtle`. Selected: `bg-primary-50`. Cell padding:
compact `px-3 py-2`, regular `px-4 py-3`. No explicit `h-10` / `h-9` set on
rows — row height is driven by content + `py-2/3`. Empty state: `px-4 py-12
text-center text-body text-ink-muted`. Caption: `px-3 py-2 text-caption
text-ink-muted`.

### Page header (canonical, used on every page)

`text-xl md:text-2xl font-bold text-ink` title; description `mt-1 text-body
text-ink-muted`; actions cluster right with `gap-2`. Below-slot `mt-4` for
tab bars. Before-slot `mb-2` for breadcrumbs. No leading icon, no card
wrapping.

---

## 5. Routes & screens (top-level only)

Route table is in `src/App.tsx`. Top-level protected screens (the ones a
visitor to the prototype would see after login):

- `/dashboard` — KPI overview, work queues, alert summary
- `/inbox` — mention/notification inbox
- `/boards/purchasing` — kanban board (purchasing flow)
- `/boards/receiving` — kanban board (receiving flow)
- `/boards/investment` — kanban board (investment / approval)
- `/logs` — stored / purchased / received / rejection logs (tabbed)
- `/analytics` — analytics (redirects to `/dashboard?tab=stocktake`)
- `/inventory` — main inventory manager (list / grid / grouped)
- `/stocktake` — stocktake session
- `/movements` — movement requests
- `/bulk-movements` — bulk movement flow
- `/locations` — locations master
- `/persons`, `/departments`, `/suppliers`, `/categories`, `/tags` — master data
- `/users` — user management (admin)
- `/issues` — issues / comments
- `/escalations` — escalation rules
- `/admin/movement-request-forms` — request form builder
- `/admin/settings/whatsapp` — WhatsApp gateway settings
- `/admin/settings/movement-request-schedule` — schedule settings
- `/tspoon-lab`, `/tspoon-lab-settings` — internal integration screen
- `/sku-mappings`, `/service-tokens` — integration settings
- `/print/purchase-request` — printable purchase request

Public (token-gated, no login): `/form/:token`, `/bulk-movement/confirm/:token`,
`/bulk-movement/approve/:token`, `/movement/confirm/:token`,
`/public/stocktake/:token`, `/p/movement-request/:slug`, `/docs/*`.

Several legacy paths (`/kanbans/*`, `/stored-log`, `/purchased-logs`,
`/received-logs`, `/rejection-log`, `/kanban/:id`, `/board/:id`) are
redirects.

---

## 6. NDA check (presence only — not opened)

Flagged; **not read**.

**Root `.env` files (do not open):**
`.env`, `.env.dev.docker`, `.env.example`, `.env.production`,
`.env.production.bak-20260703_164144`,
`.env.production.bak-20260717_144530`,
`.env.production.bak-20260717_180409`,
`.env.production.docker`, `.env.staging`, `.env.staging.docker`.

**Backend `.env`:** `packages/backend/.env`, `.env.example`,
`.env.production`.

**Frontend `.env`:** `packages/frontend/.env.production`.

**Real-data candidates in repo root (not opened):**
- `inventory-items (8).csv` (570 KB) — likely real export
- `import with Tag - direct-import-template (1).csv` (95 KB)
- `New Template - direct-import-template (1).csv` (68 KB)
- `test import - Sheet1.csv` (5.6 KB)
- `Purchase Board - Sheet1.csv` (69 KB)
- `purchase-import-template.csv` (1 KB)
- `purchase-import-transformed.csv` (56 KB)
- `purchase-import-transformed-report.json` (348 B)
- `direct-import.csv` (3 KB)
- `sample-direct-import.csv` (596 B)
- `sales tib 2 feb new.csv` (120 KB)
- `cookies.txt` (131 B)
- `Gmail - Menunggu Pembayaran BNI Virtual Account …html` (39 KB) — real
  customer email with PYM reference; **BNI vendor reference present in
  filename**
- `tspoonlab_order_test.html` (24 KB) — possible Tspoon Lab fixture
- `fonnte-example.js` (2.5 KB) — WhatsApp-gateway integration sample
- `tspoonlab_order_test.html` — Tspoon / Teaspoon vendor reference

**Webhook-named files:** none found at the surface (≤3 levels). The
`/admin/settings/whatsapp` route + `fonnte-example.js` strongly imply a
webhook surface, but no `*webhook*` file is committed at the levels
scanned.

**`iseller*` / `xero*` filenames:** none found at the scanned depth.

**Real-looking seed files:** none at the scanned depth. Several
`*.sql` files at repo root (e.g. `apply-stock-sync-fix.sql`,
`fix-stock-sync-safe.sql`, `reset-locations-products.sql`,
`restore-stock-from-backup.sql`, `analyze-direct-import-no-location.sql`,
`fix-tags-data.sql`) are operationally-named but were not opened.

**Conclusion for prototype team:** Do not import fixtures, env values, or
integration wiring from this repo. The real product vendor / customer
identifiers and credentials are present in root and `packages/backend/`
`.env*` files, in CSV exports, and in the BNI-named email artifact.
Generate synthetic placeholders for every field.
