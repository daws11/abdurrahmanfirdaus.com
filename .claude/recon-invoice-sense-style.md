# Visual-style recon: Invoice-Sense (DocuExtract AI / Invoice Accounting App)

Read-only extract from `/Users/yanuar/Documents/Inventory and Invoice App/Invoice-Sense/`.
No source was copied or transcribed. All values below are from `tailwind.config.ts`,
`client/src/index.css`, `components.json`, `client/src/App.tsx`,
`client/src/components/app-navbar.tsx`, `client/src/pages/home.tsx`,
`client/src/components/invoice-list.tsx`, and `client/src/components/ui/sidebar.tsx`.

The app internally calls itself **"DocuExtract AI"** in `design_guidelines.md` but the
shipped HTML title and navbar title are **"Invoice Accounting App"**.

## 1. UI location

Top of `client/` (1 level deep):

- `client/index.html` — entry HTML, no `<html class="dark">` (light is default)
- `client/public/` — static assets (favicon, etc.)
- `client/src/App.tsx` — entry component, route + tab switch
- `client/src/main.tsx` — React root
- `client/src/index.css` — Tailwind + `:root` / `.dark` CSS variables
- `client/src/components/` — `app-navbar.tsx`, `invoice-list.tsx`, `data-panel.tsx`,
  `document-viewer.tsx`, `bulk-action-bar.tsx`, plus `ui/` (shadcn primitives)
- `client/src/pages/` — `home.tsx`, `reconciliation.tsx`, `analytics.tsx`, `login.tsx`,
  `logs.tsx`, `suppliers/`, `settings/`, `payment-request.tsx`, `payment-tracking/`,
  `sales-tracking/`, `weekly-finance-review/`, `daily-finance-dashboard/`
- `client/src/lib/` — `app-navigation.ts` (tab list), `queryClient.ts`, `types.ts`
- `client/src/hooks/` — `use-auth.ts`, `use-invoice-events.ts`, `use-toast.ts`, etc.

Config at repo root: `tailwind.config.ts`, `components.json`, `postcss.config.js`,
`vite.config.ts`, `drizzle.config.ts`.

## 2. Brand & theme

System: **shadcn new-york**, `baseColor: "neutral"`, `cssVariables: true`
(`/Users/yanuar/Documents/Inventory and Invoice App/Invoice-Sense/components.json`).

### Tokens (HSL triples, from `:root` in `client/src/index.css`)

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--background` | `0 0% 100%` | `222 47% 11%` | page bg (default white) |
| `--foreground` | `222 47% 11%` | `210 40% 98%` | text |
| `--card` | `0 0% 98%` | `220 39% 13%` | cards, navbar |
| `--card-foreground` | `222 47% 11%` | `210 40% 98%` | card text |
| `--border` | `220 13% 91%` | `217 33% 17%` | 1px borders |
| `--input` | `220 13% 75%` | `217 33% 35%` | form borders |
| `--muted` | `220 14% 91%` | `215 28% 18%` | muted surfaces |
| `--muted-foreground` | `215 16% 47%` | `217 20% 65%` | secondary text |
| `--sidebar` | `220 13% 95%` | `217 33% 15%` | sidebar bg (present, but app uses resizable panels instead) |
| `--primary` | `221 83% 53%` | `221 83% 53%` | **brand accent = blue-600** |
| `--primary-foreground` | `210 40% 98%` | `210 40% 98%` | |
| `--secondary` | `220 14% 89%` | `215 28% 19%` | |
| `--accent` | `220 13% 92%` | `217 33% 16%` | |
| `--destructive` | `0 84% 60%` | `0 84% 60%` | red-500 ish |
| `--ring` | `221 83% 53%` | `221 83% 53%` | focus ring (same as primary) |
| `--chart-1` | `221 83% 53%` | `221 83% 63%` | primary blue |
| `--chart-2` | `142 76% 36%` | `142 76% 56%` | green (success) |
| `--chart-3` | `262 83% 58%` | `262 83% 68%` | purple |
| `--chart-4` | `32 95% 44%` | `32 95% 64%` | orange (review/warn) |
| `--chart-5` | `346 77% 50%` | `346 77% 65%` | pink |

Tailwind `status` named colors (used in dot indicators only):

- `status.online` = `rgb(34 197 94)` (green-500)
- `status.away` = `rgb(245 158 11)` (amber-500)
- `status.busy` = `rgb(239 68 68)` (red-500)
- `status.offline` = `rgb(156 163 175)` (gray-400)

### Brand accent summary

- **Primary accent:** blue-600 (`hsl(221 83% 53%)`) — buttons, focus ring, "Processing" badge.
- Success / "Scanned" badge uses green (`chart-2` = `142 76% 36%`).
- Warning / "Review" badge uses orange (`chart-4` = `32 95% 44%`).
- Error uses red (`destructive` = `0 84% 60%`).
- Logo block is a blue square (`bg-primary`) with a white `FileText` icon.

### Typography

`--font-sans: Inter, system-ui, sans-serif`
`--font-serif: Georgia, serif`
`--font-mono: "SF Mono", "JetBrains Mono", Menlo, monospace`

Inter is loaded via Google Fonts in `client/index.html` along with a long list of
other font families (`DM Sans`, `Geist`, `IBM Plex Sans`, `Outfit`, `Space Grotesk`,
`Plus Jakarta Sans`, etc.) — likely for the shadcn theme picker; the app itself
sticks to Inter + SF Mono/JetBrains Mono for data.

`design_guidelines.md` calls out the actual type scale used in product:

- H1 24px semibold, H2 18px semibold, H3 14px medium uppercase tracked
- Body 14px regular, Small 12px, Tiny 11px medium
- Monospace 14px for invoice numbers / amounts, with tabular nums

### Border radius

`--radius: .5rem` (8px) base, then via tailwind extend:

- `rounded-sm` = `0.1875rem` (3px)
- `rounded-md` = `0.375rem` (6px) — inputs, badges
- `rounded-lg` = `0.5625rem` (9px) — cards, modals
- Buttons in navbar use `rounded-md`; bulk action bar uses `rounded-full`.

## 3. Shell anatomy

The app is **not** a traditional sidebar layout. It is a single full-height column:

- **Outer wrapper** (`home.tsx` line 764):
  `flex flex-col h-screen min-h-screen w-screen bg-background text-foreground overflow-hidden`

- **Top bar** (`app-navbar.tsx` line 44):
  `h-14 bg-card border-b border-border flex items-center px-4 justify-between gap-4 flex-shrink-0 z-10`
  - Height: **56px** (`h-14`)
  - Background: `--card` (off-white in light, near-black in dark)
  - Left: `bg-primary` square logo (1.5 padding) + `FileText` icon + bold title "Invoice Accounting App"
  - Center-left: tab buttons (ghost when inactive, secondary when active), each with optional badge
  - Right: theme toggle, settings gear (ghost icon button), 1px vertical divider, custom `rightActions` slot (used for "Upload Invoices" primary button), avatar dropdown menu

- **Sidebar:** shadcn `Sidebar` primitive (`client/src/components/ui/sidebar.tsx`) is in the
  dependency but **not used** in the main invoice flow. The real layout is a
  horizontal `ResizablePanelGroup` with three columns:
  - Column 1 (InvoiceList): `defaultSize=25`, `minSize=15`, `maxSize=35`, collapsible
  - Column 2 (DocumentViewer): `defaultSize=45`, `minSize=30`
  - Column 3 (DataPanel): `defaultSize=30`, `minSize=20`, `maxSize=50`
  - Gutter: `<ResizableHandle withHandle />` between each.

- **Default mode:** light. `<html>` has no `class="dark"` in `index.html`;
  `--background` is white. Dark mode is opt-in via the `ThemeToggle` component
  (the `.dark` class on `<html>` flips the CSS variables).

- **Page background:** `bg-background` on the outer wrapper (white in light).
  Each column has its own surface: list panel uses `bg-card border-r border-border`.

- **Bulk action bar** (`bulk-action-bar.tsx`): fixed floating pill, **48px tall**,
  `rounded-full`, `bg-foreground text-background px-6 py-3`, slides up from
  bottom of left column when items are selected.

## 4. Density & primitives

### Spacing scale (from `design_guidelines.md` + observed)

- Micro: `gap-1`, `gap-2` (icon gaps, tight clusters)
- Component padding: `p-3` to `p-4` (cards, list rows, inputs)
- Section padding: `p-6` to `p-8`
- Page margins: `p-4` (consistent edge breathing)

### Standard padding / radius

- Cards: `p-4` to `p-6`, `rounded-lg` (9px), `border border-border`
- Inputs: `h-9` to `h-10`, `px-3`, `rounded-md` (6px)
- Buttons: `h-9` (icon) to `h-10` (primary), `rounded-md`, `font-medium`
- Icon buttons: 32px (`h-8 w-8`) or 36px squares
- Status badges: `rounded-md`, `text-xs` (`h-5` ≈ 20px)

### Status pill conventions (from `invoice-list.tsx` `getStatusBadge`)

- **Verified / "Scanned"** — green:
  `bg-chart-2/10 text-chart-2 border-chart-2/20`, `CheckCircle` icon
- **Needs Review** — orange:
  `bg-chart-4/10 text-chart-4 border-chart-4/20`, `AlertCircle` icon
- **Processing** — primary blue:
  `bg-primary/10 text-primary border-primary/20`, `Loader2` animated
- **Error** — red:
  `bg-destructive/10 text-destructive border-destructive/20`, `AlertCircle`
- Outline variant (`border`) is used so the badge border is part of the color, not gray.

### Tables / line items

`design_guidelines.md` describes:

- Minimal borders (horizontal only)
- Alternating row backgrounds
- Right-aligned numbers
- Editable cells with focus states
- Subtotal / tax 14px regular, total 18px bold
- Tabular nums on currency columns

No fixed row height is hard-coded in source; rows in line-items tables visually render
at ~`h-10` (40px) per design doc.

### Other conventions from `design_guidelines.md`

- Toast: top-right, 4s duration
- Modal max width 672px (`max-w-2xl`)
- Document preview area uses a subtle checkerboard background for empty state
- Image controls: 32px square icon-only floating toolbar (zoom 25% increments, rotate, download)
- Confidence meter: horizontal bar with percentage label

## 5. Top-level routes / tabs

From `client/src/lib/app-navigation.ts` `AppTab` union and `client/src/App.tsx`:

1. `/login` — `LoginPage`
2. `/` — `Home` (Invoices, three-column layout)
3. `/reconciliation` — `ReconciliationPage`
4. `/suppliers` — `SuppliersPage` (label: "Mapping")
5. `/payment-request` — `PaymentRequestPage`
6. `/payment-tracking` — `PaymentTrackingPage`
7. `/logs` — `LogsPage`
8. `/analytics` — `AnalyticsPage` (also `/analytics/:section`)
9. `/sales-tracking` — `SalesTrackingPage`
10. `/weekly-finance-review` — `WeeklyFinanceReviewPage`
11. `/daily-finance-dashboard` — `DailyFinanceDashboardPage` (label: "Daily Health")
12. `/settings` and `/settings/:section` — `SettingsPage`

Deep-link pattern: `/:uniqueId` (12 alphanumeric) loads a single invoice and is
immediately rewritten back to `/`.

Tab list order as built: Invoices, Reconciliation, Mapping, Payment Request,
Payment Tracking, Logs, Analytics, Sales Tracking, then optional Daily Health and
Weekly Finance Review appended.

## 6. NDA flag — present in the working copy (do NOT open or copy)

Root-level files matching sensitive patterns (just presence, not contents read):

- `/Users/yanuar/Documents/Inventory and Invoice App/Invoice-Sense/.env` (real values)
- `/Users/yanuar/Documents/Inventory and Invoice App/Invoice-Sense/.env.example`
- `/Users/yanuar/Documents/Inventory and Invoice App/Invoice-Sense/env.example`
- `/Users/yanuar/Documents/Inventory and Invoice App/Invoice-Sense/env.local`
- `/Users/yanuar/Documents/Inventory and Invoice App/Invoice-Sense/backup_replit.sql`
- `/Users/yanuar/Documents/Inventory and Invoice App/Invoice-Sense/manual_schema_update.sql`
- `/Users/yanuar/Documents/Inventory and Invoice App/Invoice-Sense/post_migration.sql`
- `/Users/yanuar/Documents/Inventory and Invoice App/Invoice-Sense/pre_drizzle_migration.sql`
- `/Users/yanuar/Documents/Inventory and Invoice App/Invoice-Sense/Purchase Board - Sheet1.csv` — real purchase data CSV
- `/Users/yanuar/Documents/Inventory and Invoice App/Invoice-Sense/BNI_API_DOCS.md`
- `/Users/yanuar/Documents/Inventory and Invoice App/Invoice-Sense/BNIdirect_Inquiry_Account_StatementAPi.md`
- `/Users/yanuar/Documents/Inventory and Invoice App/Invoice-Sense/BNIdirect_JWT_Signature.md`
- `/Users/yanuar/Documents/Inventory and Invoice App/Invoice-Sense/XERO_SETUP_FIXED.md`
- `/Users/yanuar/Documents/Inventory and Invoice App/Invoice-Sense/WHATSAPP_*.md` (6 files)
- `/Users/yanuar/Documents/Inventory and Invoice App/Invoice-Sense/ERP API v3 (1).md`
- `/Users/yanuar/Documents/Inventory and Invoice App/Invoice-Sense/PUBLIC-API-V2.md`
- `/Users/yanuar/Documents/Inventory and Invoice App/Invoice-Sense/attached_assets/` (full directory, likely uploads / scans)
- `/Users/yanuar/Documents/Inventory and Invoice App/Invoice-Sense/backups/`
- `/Users/yanuar/Documents/Inventory and Invoice App/Invoice-Sense/migrations/`
- `/Users/yanuar/Documents/Inventory and Invoice App/Invoice-Sense/server/` (backend, not part of UI recon)

Inside `client/` (1 level) the only sensitive pattern is `client/index.html` which
preconnects to `fonts.googleapis.com` — no env, no real-data fixtures, no
webhook handlers in the UI tree.

## Notes for the prototype team

- The visual identity is **shadcn new-york on neutral**, with a single blue
  accent (blue-600 / `hsl(221 83% 53%)`). This already matches the target style
  in `abdurrahmanfirdaus.com/.claude/CLAUDE.md` (shadcn new-york,
  1px borders, `rounded-md` cards). The one divergence: the portfolio
  brief calls for **emerald-400** as the accent, but Invoice-Sense uses
  **blue-600**. For the prototype, the emerald accent is the correct choice
  per the site brief — do not import the blue.
- Density is high and "Linear-like": 14px body, 12px metadata, monospace for
  numbers, fixed-top 56px navbar, resizable 3-column body.
- The status pill pattern (translucent fill, full-color border, full-color text,
  leading icon) is the one to lift verbatim into the new demos.
- Do not reuse the `AppNavbar` tab structure — the new demo only needs to
  show the **Invoices** surface (3-column layout) since the case study is
  about invoice processing.
- Per repo NDA rules, do not import any file from this tree. The values above
  were extracted as numeric / hex / Tailwind class tokens only, not as code.
