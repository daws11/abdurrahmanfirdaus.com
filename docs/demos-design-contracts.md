# Demo Design Contracts — Source of Truth

**Date:** 2026-08-03
**Purpose:** Single shared reference that the foundation subagent and the 5 per-app subagents build to. Values are extracted from read-only recon of the 5 production apps (see `.claude/recon-*.md`). No production code, fixtures, or strings are reused — only visual tokens.

---

## Conventions across all 5 demos

- **CSS variables scoped under `.demo-{id}`** on `<html>` (set by `useTheme` hook). Each demo's primitives consume `var(--accent)`, `var(--bg)`, etc.
- **Light vs dark:** each demo follows its production source default. Invenflow, Invoice Sense, Kitchen Fresh, and People & Culture default to **light**. Channelflow is also **light** by default (per Next.js ThemeProvider defaultTheme). Dark variants are optional and out of scope.
- **Status semantics (consistent across demos):**
  - `--ok` (success / matched / active) — emerald-ish
  - `--warn` (pending / warn) — amber
  - `--bad` (error / mismatch / rejected) — red/rose
  - `--accent` (brand / primary CTA / active nav) — **demo-specific, see below**
- **Border radius:** `rounded-md` (6px) is the default for cards/inputs across all demos. Some demos prefer `rounded-lg` (Channelflow, Invenflow buttons). Each demo may override.
- **Border thickness:** 1px everywhere.
- **Font:** system stack (Inter-like) — no external webfont loading in the prototype. Mono defaults to `ui-monospace`.
- **Density:** "compact" (closer to mail-client, tighter rows) for Channelflow + Invenflow; "comfortable" for the other 3. `KanbanColumn`, `Sheet`, and `Stepper` adjust accordingly.

---

## Per-demo theme records

Each block below is a literal `DemoTheme` record. The foundation subagent MUST copy these values verbatim into `src/demos/_shared/themes/{id}.ts`.

### 1. Invenflow

Source recon: `.claude/recon-invenflow-style.md`

```ts
{
  id: "invenflow",
  brand: {
    name: "Invenflow",
    monogram: "IF",
    surface: "light",
  },
  tokens: {
    "--bg":        "#f9fafb",  // page bg (bg-subtle)
    "--surface":   "#ffffff",  // card bg
    "--fg":        "#111827",  // ink
    "--muted":     "#6b7280",  // muted text
    "--border":    "#e5e7eb",  // line.DEFAULT
    "--accent":    "#112239",  // brand-600 (sidebar gradient top)
    "--accent-fg": "#ffffff",
    "--warn":      "#f59e0b",  // warning-500
    "--ok":        "#22c55e",  // success-500
    "--bad":       "#ef4444",  // danger-500
  },
  shell: {
    sidebarWidth: 256,
    sidebarCollapsedWidth: 72,
    topBarHeight: 0,          // no top bar; sidebar IS chrome
    density: "compact",
  },
  font: {
    sans: "system-ui, -apple-system, 'Segoe UI', sans-serif",
    mono: "ui-monospace, SFMono-Regular, Menlo, monospace",
  },
}
```

**Notes:**
- Sidebar uses a vertical gradient `#112239 → #09182b` at 0.98 alpha. Implementation: in `Sidebar.tsx`, apply `backgroundImage: "linear-gradient(180deg, var(--accent) 0%, #09182b 100%)"` over `--accent`.
- The gradient bottom color `#09182b` should be set as `--accent-deep` on the `.demo-invenflow` scope. Add this as a token.
- No top bar — `topBarHeight: 0`. The `TopBar` component should NOT render when `theme.shell.topBarHeight === 0`.
- Status pills are `rounded-full text-xs font-medium border` (full radius). `Badge` primitive defaults to `rounded-md`; in Invenflow screens, override to `rounded-full` for status chips.

### 2. Invoice Sense

Source recon: `.claude/recon-invoice-sense-style.md`

```ts
{
  id: "invoice-sense",
  brand: {
    name: "Invoice Sense",
    monogram: "IS",
    surface: "light",
  },
  tokens: {
    "--bg":        "#ffffff",
    "--surface":   "#fafafa",  // card (0 0% 98%)
    "--fg":        "#0f172a",  // (222 47% 11%)
    "--muted":     "#64748b",  // muted-foreground (215 16% 47%)
    "--border":    "#e2e8f0",  // (220 13% 91%)
    "--accent":    "#2563eb",  // blue-600 (221 83% 53%)
    "--accent-fg": "#ffffff",
    "--warn":      "#f59e0b",  // orange/chart-4
    "--ok":        "#16a34a",  // green/chart-2 (142 76% 36%)
    "--bad":       "#dc2626",  // destructive (0 84% 60%)
  },
  shell: {
    sidebarWidth: 0,          // 3-column ResizablePanel layout, no sidebar
    sidebarCollapsedWidth: 0,
    topBarHeight: 56,
    density: "comfortable",
  },
  font: {
    sans: "Inter, system-ui, sans-serif",
    mono: "ui-monospace, SFMono-Regular, Menlo, monospace",
  },
}
```

**Notes:**
- App uses a full-height column with a 56px top bar and 3-column `ResizablePanelGroup` (InvoiceList 25% / DocumentViewer 45% / DataPanel 30%) in the main area. The `Shell` should render just `<TopBar />` + main content (no `Sidebar`), with the 3-column layout implemented at the screen level (e.g. via CSS grid).
- Add a `--accent-deep` token: `#1d4ed8` (blue-700).
- Buttons render `rounded-md`; cards `rounded-lg`. Override `Badge` / `Button` radius per-screen as needed.
- Two text-related font families actually used in source: Inter + SF Mono / JetBrains Mono. Use Inter via system-stack hint; mono as above.
- Routes list: `/login`, `/` (invoices 3-column), `/reconciliation`, `/suppliers` (Mapping), `/payment-request`, `/payment-tracking`, `/logs`, `/analytics`, `/sales-tracking`, `/weekly-finance-review`, `/daily-finance-dashboard`, `/settings`. Prototype should expose 3–4 most representative (Inbox 3-column is mandatory, Reconciliation is a strong second).

### 3. Channelflow

Source recon: `.claude/recon-channelflow-style.md`

```ts
{
  id: "channelflow",
  brand: {
    name: "Channelflow",
    monogram: "CF",
    surface: "light",
  },
  tokens: {
    "--bg":        "#f8fafc",  // slate-50
    "--surface":   "#ffffff",
    "--fg":        "#0f172a",  // slate-900
    "--muted":     "#64748b",  // slate-500
    "--border":    "#e2e8f0",  // slate-200
    "--accent":    "#10b981",  // emerald-500
    "--accent-fg": "#ffffff",
    "--warn":      "#f59e0b",  // amber-500
    "--ok":        "#10b981",  // emerald-500 (same as accent)
    "--bad":       "#f43f5e",  // rose-500
  },
  shell: {
    sidebarWidth: 64,         // w-16 icon rail
    sidebarCollapsedWidth: 64,
    topBarHeight: 0,          // no top bar; pages have their own headers
    density: "compact",
  },
  font: {
    sans: "Inter, system-ui, sans-serif",
    mono: "JetBrains Mono, ui-monospace, SFMono-Regular, monospace",
  },
}
```

**Notes:**
- Sidebar is icon-only 64px (`w-16`); `collapsedWidth === expandedWidth`. `Sidebar` component should auto-hide text labels when width ≤ 80.
- Logo tile is `h-9 w-9 rounded-lg` with gradient `from-emerald-500 to-emerald-700`. Implementation: in `Brand.tsx`, when `theme.id === "channelflow"`, render the gradient tile instead of solid `var(--accent)`.
- Channel chips have categorical colors:
  - WhatsApp: emerald (uses --accent)
  - Instagram DM: violet — `--channel-ig: #8b5cf6`
  - Email: sky — `--channel-email: #0ea5e9`
  - TikTok: slate — `--channel-tiktok: #64748b`
  - These are channel categorical accents, separate from `--accent`. Add as `--channel-*` tokens on the `.demo-channelflow` scope.
- Icon stroke: 2 (active 2.25). Most lucide-react icons accept `strokeWidth` prop.
- Routes: `/inbox`, `/outbound`, `/analytics`, `/bookings`, `/ai`, `/channels`, `/settings`, `/profile`. Pick 3 (Inbox mandatory, Bookings, Commission/Analytics).

### 4. Kitchen Fresh

Source recon: `.claude/recon-kitchen-fresh-style.md`

```ts
{
  id: "kitchen-fresh",
  brand: {
    name: "Kitchen Fresh",
    monogram: "KF",
    surface: "light",
  },
  tokens: {
    "--bg":        "#fafafa",  // 0 0% 98%
    "--surface":   "#ffffff",
    "--fg":        "#1a1a1a",  // 0 0% 10%
    "--muted":     "#666666",  // 0 0% 40%
    "--border":    "#e0e0e0",  // 0 0% 88%
    "--accent":    "#1d4ed8",  // blue-600 (219 95% 45%)
    "--accent-fg": "#ffffff",
    "--warn":      "#f59e0b",  // chart-3 / 32 95% 44%
    "--ok":        "#22c55e",  // chart-2 / 142 76% 36%
    "--bad":       "#ef4444",  // chart-5 / 0 84% 60%
  },
  shell: {
    sidebarWidth: 256,
    sidebarCollapsedWidth: 48,  // shadcn compact
    topBarHeight: 0,
    density: "comfortable",
  },
  font: {
    sans: "Inter, system-ui, sans-serif",
    mono: "Menlo, ui-monospace, SFMono-Regular, monospace",
  },
}
```

**Notes:**
- Sidebar is shadcn `SidebarProvider + SidebarInset` pattern; in the prototype a 256px collapsible sidebar.
- App is "staff-facing timer/dashboard". Status colors are timer-related (green/yellow/red/grey for good/alert/check/empty).
- Sample surface uses `--radius` base 8px → cards `rounded-xl` (1rem), buttons/badges/inputs `rounded-md` (6px). Override per surface.
- Routes: 14 pages per recon (timer routes for menu items, outlets, settings). Pick 3 most distinctive for prototype (DailyOps is mandatory; ShiftHandoff + OutletSwitcher are strong).

### 5. People & Culture

Source recon: `.claude/recon-people-culture-style.md`

```ts
{
  id: "people-culture",
  brand: {
    name: "PeopleOS",
    monogram: "PC",
    surface: "light",
  },
  tokens: {
    "--bg":        "#f8fafc",  // slate-50
    "--surface":   "#ffffff",
    "--fg":        "#0f172a",  // slate-900
    "--muted":     "#64748b",  // slate-500
    "--border":    "#e2e8f0",  // slate-200
    "--accent":    "#4F46E5",  // indigo-600
    "--accent-fg": "#ffffff",
    "--warn":      "#f59e0b",  // amber-500
    "--ok":        "#10b981",  // emerald-500
    "--bad":       "#f43f5e",  // rose-500
  },
  shell: {
    sidebarWidth: 256,
    sidebarCollapsedWidth: 64,
    topBarHeight: 56,
    density: "comfortable",
  },
  font: {
    sans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, system-ui, sans-serif",
    mono: "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
  },
}
```

**Notes:**
- Sidebar active item: `bg-indigo-50 text-indigo-700` with a 3px indigo-600 left bar. Implementation: `Sidebar` component exposes `active` prop on items; for `.demo-people-culture`, the active row gets the indigo left-bar treatment, not just text color.
- Buttons are `rounded-xl` (12px), not `rounded-md`. Override `Button` radius in this theme.
- Cards are `rounded-2xl` (16px) with `shadow-sm`. Override `Card` (or its inline equivalent) in this theme.
- StatusPill is `11px bold uppercase tracking-0.04em`. Override `Badge` size class here.
- Top bar is `h-14` with `bg-white/90 backdrop-blur-md`. Implementation: `TopBar` accepts a `glass` boolean; when `theme.id === "people-culture"`, set the glass treatment.
- Routes: multi-group (Training / Hiring / Workforce / Employee self-service / Admin). Pick 3 (Directory + EmployeeRecord + OnboardingFlow).

---

## Per-demo CSS scope overrides (`.demo-{id}`)

Foundation subagent appends the following to `src/index.css` so CSS variable scopes match the theme records above. Each block declares the same variables the theme module sets programmatically via `useTheme`, so the JS-applied values and CSS-declared values agree.

```css
/* Invoice Sense */
.demo-invoice-sense {
  --bg: #ffffff;
  --surface: #fafafa;
  --fg: #0f172a;
  --muted: #64748b;
  --border: #e2e8f0;
  --accent: #2563eb;
  --accent-fg: #ffffff;
  --warn: #f59e0b;
  --ok: #16a34a;
  --bad: #dc2626;
  --radius: 8px;
  font-family: Inter, system-ui, sans-serif;
}

/* Invenflow */
.demo-invenflow {
  --bg: #f9fafb;
  --surface: #ffffff;
  --fg: #111827;
  --muted: #6b7280;
  --border: #e5e7eb;
  --accent: #112239;
  --accent-deep: #09182b;
  --accent-fg: #ffffff;
  --warn: #f59e0b;
  --ok: #22c55e;
  --bad: #ef4444;
  --radius: 8px;
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
}

/* Channelflow */
.demo-channelflow {
  --bg: #f8fafc;
  --surface: #ffffff;
  --fg: #0f172a;
  --muted: #64748b;
  --border: #e2e8f0;
  --accent: #10b981;
  --accent-fg: #ffffff;
  --warn: #f59e0b;
  --ok: #10b981;
  --bad: #f43f5e;
  --channel-ig: #8b5cf6;
  --channel-email: #0ea5e9;
  --channel-tiktok: #64748b;
  --radius: 12px;
  font-family: Inter, system-ui, sans-serif;
}

/* Kitchen Fresh */
.demo-kitchen-fresh {
  --bg: #fafafa;
  --surface: #ffffff;
  --fg: #1a1a1a;
  --muted: #666666;
  --border: #e0e0e0;
  --accent: #1d4ed8;
  --accent-fg: #ffffff;
  --warn: #f59e0b;
  --ok: #22c55e;
  --bad: #ef4444;
  --radius: 8px;
  font-family: Inter, system-ui, sans-serif;
}

/* People & Culture */
.demo-people-culture {
  --bg: #f8fafc;
  --surface: #ffffff;
  --fg: #0f172a;
  --muted: #64748b;
  --border: #e2e8f0;
  --accent: #4F46E5;
  --accent-fg: #ffffff;
  --warn: #f59e0b;
  --ok: #10b981;
  --bad: #f43f5e;
  --radius: 12px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
```

---

## Per-demo surface variant notes

The `Shell` component (in `src/demos/_shared/Shell.tsx`) reads `theme.shell.topBarHeight` and `theme.shell.sidebarWidth` to decide what to render:

| Demo | Sidebar | Top bar | Notes |
|---|---|---|---|
| Invenflow | ✓ (chrome, gradient) | ✗ | Top bar hidden. Sidebar uses gradient `linear-gradient(180deg, var(--accent), var(--accent-deep))`. |
| Invoice Sense | ✗ | ✓ | Just top bar over main content. Screens implement their own grid. |
| Channelflow | ✓ (icon-only 64px) | ✗ | Sidebar shows icons only — labels hidden because width = collapsed. Top bar hidden. |
| Kitchen Fresh | ✓ (256/48px collapsible) | ✗ | Standard shadcn collapsible. Top bar hidden. |
| People & Culture | ✓ (256/64px collapsible) | ✓ (glass) | Both visible. Top bar uses glass `bg-white/90 backdrop-blur-md`. |

The `Shell` implementation treats `topBarHeight === 0` as "do not render TopBar"; treats `sidebarWidth === sidebarCollapsedWidth` as "icon-only" (no labels); treats `sidebarWidth === 0` as "no sidebar". This single rule satisfies all 5 demos.

---

## Per-demo brand-customizing primitives

| Demo | Brand-specific override |
|---|---|
| Invenflow | Sidebar background: `linear-gradient(180deg, var(--accent) 0%, var(--accent-deep) 100%)`. Status chips: `rounded-full`. |
| Invoice Sense | App-level `display: flex; height: 100%; flex-direction: column`. Main content uses `display: grid; grid-template-columns: 25% 1fr 30%; gap: 0`. Status pill: `bg-{color}/10 border-{color}/30` with leading icon (use Tone variant in `Badge`). |
| Channelflow | Brand tile (`Brand.tsx`) for `channelflow`: gradient `linear-gradient(135deg, #10b981 0%, #047857 100%)` instead of solid `var(--accent)`. Channel chips render with `--channel-*` tokens; `Badge` accepts `channel?: 'whatsapp'\|'instagram'\|'email'\|'tiktok'`. |
| Kitchen Fresh | Status tiles show "good/alert/check/empty" semantics. Add a `TimerTile` primitive (`StatTile` variant). |
| People & Culture | Sidebar active row gets `box-shadow: inset 3px 0 0 var(--accent)` (left bar). `Button` radius `rounded-xl`. `Card`-like surface `rounded-2xl shadow-sm`. Top bar glass (`backdrop-blur-md bg-white/90`). |

These overrides live in the per-app screen code, not in the shared layer, EXCEPT for the `Brand` channelflow gradient and the `Shell` sidebar gradient for Invenflow — those go into `Shell.tsx` / `Brand.tsx` as conditional branches on `theme.id`.

---

## Out-of-scope (do not implement in this rebuild)

- Any non-3-screen subset of the production app (e.g. Invoice Sense has 12 routes — only 3–4 are exposed).
- Real authentication, real OAuth, real integrations.
- The mobile (React Native) view of People & Culture.
- Original copy / strings from production apps (rebuild from portfolio.ts descriptions or fresh).
- Real vendor logos / favicons. Monogram placeholder only.

---

## Sign-off

This contract is the source of truth. Subagents must NOT invent values that diverge from this file. If a value is missing here, the foundation subagent escalates to the orchestrator for resolution before coding.
