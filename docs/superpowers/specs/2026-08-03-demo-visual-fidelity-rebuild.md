# High-Fidelity Rebuild of 5 PTUNICORN Demos on the Portfolio

**Date:** 2026-08-03
**Status:** Awaiting user review
**Spec author:** Claude (MiniMax-M3)
**Project:** `abdurrahmanfirdaus.com` (portfolio + 5 UI-only prototypes)

---

## 1. Context

The portfolio (`abdurrahmanfirdaus.com`) currently links to 5 private repos under the org `PTUNICORN`:

| Demo | Repo | Local directory |
|---|---|---|
| Invenflow | `PTUNICORN/invenflow` | `/Users/yanuar/Documents/Inventory and Invoice App/invenflow` |
| Invoice Sense | `PTUNICORN/Invoice-Sense` | `/Users/yanuar/Documents/Inventory and Invoice App/Invoice-Sense` |
| Channelflow | `PTUNICORN/channelflow` | `/Users/yanuar/Documents/channelflow` |
| Kitchen Fresh | `PTUNICORN/kitchen-fresh` | `/Users/yanuar/Documents/Kitchen-app/kitchen-fresh` |
| People & Culture | `PTUNICORN/people-and-culture-app` | `/Users/yanuar/Documents/PC/people-and-culture-app` |

A first-pass set of 5 demos already exists in `src/demos/{id}/` from earlier work. The user has reviewed those demos and considers them unsatisfying because:

- Each demo uses the same generic shell (dark sidebar, "UI PROTOTYPE" badge) — none feel like their own app.
- No visual identity (logo, brand color, typography, layout conventions) tied to the production app.
- The result reads as "5 versions of the same template" rather than "5 distinct products."

Goal: **Rebuild all 5 demos from scratch with high visual fidelity to each app's production source**, while honoring the NDA constraints written into `.claude/CLAUDE.md`.

## 2. User-confirmed decisions

| Question | Decision |
|---|---|
| Recon source | **Combined**: read source code locally for color/typography/layout conventions, AND run app via Playwright where feasible to screenshot |
| Visual fidelity | **High**: per-demo shell, brand colors from source, monogram logo placeholder |
| Scope | **Rebuild from scratch**. Delete existing `src/demos/{id}/*`. Carry over only `router.tsx`, `_index.ts`, `DemoGate.tsx`, `vite.config.ts` chunk split |
| Subagent strategy | **Pipeline per app**: 1 orchestrator (this session) + 5 parallel subagents (1 per app) |
| Sequencing | **Parallel from the start** — after a shared design-token contract is written |

## 3. Authorisation (effective 2026-08-04)

The user has authorised rebuilding the demos with high fidelity, including reading the source code under `/Users/yanuar/Documents/{Inventory and Invoice App,channelflow,Kitchen-app,PC}/` and re-using structural patterns, layouts, and field schemas from those sources.

**`src/demos/*` is rebuilt from the production source.** Visual, structural, and field-design fidelity is the goal. The remaining constraints are:

- The portfolio is a public, static SPA — no live network calls, no SDK wiring (so no real WhatsApp / Instagram Graph / Xero/iSeller/Teaspoon/Mastra SDK imports). The relevant fields appear in the UI; the integrations stay mocked.
- No `.env` files or secrets committed. (This was always a hard line — secrets must not be published.)
- Production repos under `/Users/yanuar/Documents/...` are still read-only. We read them; we do not push to them.

## 4. Goals and non-goals

### 4.1 Goals

1. Each demo feels like its own product when first opened: shell color, brand accent, monogram/logo, top-bar widgets, and sidebar density match what the user would see in the production app.
2. Navigation, component primitives, and per-screen layout follow conventions of that app.
3. Synthetic data is rich enough that a visitor can click through primary flows (kanban transitions in Invenflow, mismatch drill-down in Invoice Sense, conversation panel in Channelflow, prep checklist in Kitchen Fresh, onboarding wizard in People & Culture).
4. Build remains green; bundle size per demo stays under ~60 kB gzip (current is 8–17 kB).
5. NDA grep stays clean.
6. Production repos are not modified, cloned, or annotated by this work.

### 4.2 Non-goals

- No backend, no persistence beyond component state.
- No real integration wiring (Xero / iSeller / WhatsApp / Mastra).
- No mobile / React-Native view of `people-and-culture-app` (web only).
- No pixel-perfect copy of any single production screen. The fidelity goal is **"this app, our prototype"** not **"this is the same app"**.
- No redesign of the portfolio marketing site. Only the `src/demos/*` subtree is rebuilt.

## 5. Approach — pipeline with shared design-token contract

### 5.1 Why a contract

Five subagents building in parallel will drift unless they share:
- Type names for primitives (`Button`, `Sidebar`, `TopBar`, `Field`, `Sheet`).
- Route shape and URL pattern (`#/demos/{id}/{screen}`).
- File layout convention (`index.tsx`, `routes.tsx`, `mocks.ts`, `README.md`, `screens/*`).
- Brand-token naming (`--accent`, `--accent-fg`, etc., one scope per demo).

The orchestrator writes the contract once. Subagents consume the contract verbatim.

### 5.2 Two-phase pipeline

**Phase A — orchestrator-only (sequential):**

1. Read CSS files, Tailwind config, `globals.css`, layout JSX of each of the 5 production apps.
2. Where feasible, install deps and `npm run dev` to capture Playwright screenshots of representative screens.
3. Extract, per app: brand color palette (3–5 hues), typography (font family, weights, scale), shell anatomy (sidebar width, top-bar height, density), key surface treatments (cards, badges, status pills).
4. Write `docs/demos-design-contracts.md` — the contract consumed by subagents.
5. Delete the old `src/demos/{id}/*` directories.
6. Set up new `src/demos/_shared/` with: brand-token utilities, `Shell.tsx` taking a `theme: DemoTheme` prop, `Button`, `Sidebar`, `TopBar`, `Badge`, `DataTable`, `Sheet`, `Field`, `EmptyState`, `StatTile`.

**Phase B — parallel subagents (one per demo):**

Each subagent receives the contract and:

1. Builds `src/demos/{id}/index.tsx`, `routes.tsx`, `mocks.ts`, `README.md`.
2. Builds 3–4 screens under `src/demos/{id}/screens/` that follow the production app's screen taxonomy (read from local source for layout structure, rewritten with our own component vocabulary).
3. Produces synthetic fixtures (sized to match production scale qualitatively — 30 SKUs, 18 employees, 25 bookings, 24 invoices, 14 kitchen items).
4. Adds a per-demo `theme` config (5 themes total, all defined in the contract) and wires it through the shared shell.

The orchestrator then:

1. Lints, builds, and verifies each demo renders without console errors.
2. Uses Playwright (browser MCP) to visit each route, take a screenshot, and confirm the visual treatment is intentional.
3. Runs NDA grep.
4. Shows the user the screenshots and a one-line summary per demo.

## 6. File-by-file plan

### 6.1 New files

```
docs/
└── demos-design-contracts.md          # Phase A output — single source of truth

src/demos/
├── _shared/
│   ├── theme.ts                       # 5 DemoTheme records + token mapping
│   ├── Shell.tsx                      # brand-aware shell — takes DemoTheme
│   ├── Brand.tsx                      # monogram + brand-name component
│   ├── TopBar.tsx                     # demo-aware top bar
│   ├── Sidebar.tsx                    # demo-aware sidebar
│   ├── Button.tsx                     # cva-driven, 4 variants
│   ├── Badge.tsx                      # status / chip
│   ├── DataTable.tsx                  # generic table primitive
│   ├── Sheet.tsx                      # right-side drawer
│   ├── Field.tsx                      # labeled input wrapper
│   ├── EmptyState.tsx
│   ├── StatTile.tsx
│   ├── Stepper.tsx                    # wizard progress (P&C onboarding)
│   ├── KanbanColumn.tsx               # used by Invenflow purchasing
│   └── fixtures/
│       ├── inventory.ts               # SKUs, vendors, outlets
│       ├── invoices.ts                # invoice rows + line items
│       ├── bookings.ts                # channel conversations, parties
│       ├── employees.ts               # employee roster
│       └── kitchen.ts                 # prep list, par levels

src/demos/invenflow/{index,routes,mocks,README}.tsx + screens/{Purchasing,Receiving,Inventory,Stocktake,Movement}.tsx
src/demos/invoice-sense/{index,routes,mocks,README}.tsx + screens/{Inbox,InvoiceDetail,MismatchDrawer,MatchRules}.tsx
src/demos/channelflow/{index,routes,mocks,README}.tsx + screens/{ChannelQueue,BookingDetail,CommissionLedger}.tsx
src/demos/kitchen-fresh/{index,routes,mocks,README}.tsx + screens/{OutletSwitcher,DailyOps,ShiftHandoff}.tsx
src/demos/people-culture/{index,routes,mocks,README}.tsx + screens/{Directory,EmployeeRecord,OnboardingFlow}.tsx
```

### 6.2 Modified files

```
src/demos/_index.ts                    # status stays "live"; adds per-demo `theme` field
src/demos/router.tsx                   # unchanged structurally; carries DemoTheme into Shell
src/demos/_shared/DemoGate.tsx         # unchanged
src/demos/_shared/DemoHub.tsx          # rewritten — each demo card uses its own brand color/logo
src/App.tsx                            # unchanged
vite.config.ts                         # updated chunk names if file layout changes
src/data/portfolio.ts                  # unchanged
```

### 6.3 Files deleted

```
src/demos/invenflow/boards/*           (replaced by new screens/)
src/demos/invenflow/index.tsx
src/demos/invenflow/README.md
src/demos/invoice-sense/...
src/demos/channelflow/...
src/demos/kitchen-fresh/...
src/demos/people-culture/...
```

The shared layer (`src/demos/_shared/Shell.tsx`, `DataTable.tsx`, etc.) is **kept but rewritten**, not deleted — the file set is the same; only their contents are replaced with brand-aware versions.

## 7. Design-token contract (preview)

The actual contract file (`docs/demos-design-contracts.md`) will be written by the orchestrator in Phase A. For preview, here is the **shape** (not the values — values come from the source):

```ts
// src/demos/_shared/theme.ts

export interface DemoTheme {
  id: "invenflow" | "invoice-sense" | "channelflow" | "kitchen-fresh" | "people-culture";
  brand: {
    name: string;             // e.g. "Invenflow"
    monogram: string;         // 1–2 chars, e.g. "IF"
    /** "light" = pale bg, dark fg; "dark" = neutral-950 bg, light fg */
    surface: "light" | "dark";
  };
  /** CSS variables scoped to `.demo-${id}` */
  tokens: {
    "--bg": string;
    "--surface": string;
    "--fg": string;
    "--muted": string;
    "--border": string;
    "--accent": string;       // primary brand color
    "--accent-fg": string;    // readable on top of --accent
    "--warn": string;
    "--ok": string;
    "--bad": string;
  };
  /** Tailwind class tokens overriding the defaults */
  tw: {
    appBg: string;
    sidebarBg: string;
    border: string;
  };
  /** Anatomy of the shell */
  shell: {
    sidebarWidth: number;     // px
    sidebarCollapsedWidth: number;
    topBarHeight: number;     // px
    density: "compact" | "comfortable";
  };
  font: {
    sans: string;             // CSS font-family
    mono?: string;
  };
}
```

The contract file lives at `docs/demos-design-contracts.md` and contains the 5 concrete `DemoTheme` records (one per app) with values derived from production source CSS.

## 8. NDA guardrails during implementation

In addition to the existing 7 rules in `.claude/CLAUDE.md`:

8. **Code-freshness rule.** Even though we read production source for visual reference, **every line of `src/demos/*` is written fresh** in this session. Subagents are instructed: "Use the production source as a visual guide — colors, layout, spacing — but write every line of code fresh." This prevents the more subtle violation of producing code that looks like a transcription.
9. **Names-not-strings rule.** Brand names are constants in `theme.ts`, never inlined in component code as string-literal copies of the production app's text. Example: brand `"Invenflow"` lives in `theme.brand.name`, not `"Invenflow"` typed in 20 components.
10. **No fixture inheritance.** Subagents must not import fixtures from production source. All fixtures are built fresh from description in `src/data/portfolio.ts` plus standard synthetic placeholders (`Vendor A`, `SKU-001`, `INV-0001`).

## 9. Subagent brief (template — sent to each of the 5)

Each subagent receives the contract + a per-app brief. The brief always includes:

> **Your task.** Build `src/demos/{id}/` using only files under that directory and the shared primitives in `src/demos/_shared/`. The contract file `docs/demos-design-contracts.md` defines your theme tokens, shell anatomy, and component vocabulary — read it first, build to it.
>
> **Reference.** Production source is at `{LOCAL_DIR}`. You may `Read` files there for visual layout, color, typography, and component anatomy. You may **not** copy, paste, transcribe, or import any line from that source.
>
> **Required files:** `index.tsx`, `routes.tsx`, `mocks.ts`, `README.md`, plus 3–4 screens.
>
> **Mandatory NDA checks before you finish:**
> 1. `grep -rE 'xero|iseller|teaspoon|mastra|whatsapp|tsp|BNI|tenantId|api[_-]?key|secret' src/demos/{id}/` must return nothing tied to a real identifier.
> 2. All fixtures use synthetic placeholders (Vendor A, SKU-001, etc.).
> 3. No `import` resolves to a file outside `src/demos/{id}/` or `src/demos/_shared/`.
> 4. No `fetch(`, `axios`, `import.meta.env`, or third-party SDK import.
>
> **Output.** A short report: which screens built, what interaction works, what was stubbed, screenshot path.

## 10. Verification

After each subagent finishes, the orchestrator:

1. `cd /Users/yanuar/Documents/abdurrahmanfirdaus.com && npm run build` — must exit 0.
2. `npm run dev` and visit each `#/demos/{id}/*` route via Playwright.
3. Take one screenshot per demo (one screen per demo).
4. `grep -rE 'xero|iseller|teaspoon|mastra|whatsapp|tsp|BNI|tenantId|api[_-]?key|secret' src/demos/` — clean.
5. `git status` — only intended changes under `src/demos/` and `docs/`. No production-repo files touched.

Once verification passes, present screenshots to user for sign-off.

## 11. Open questions for the implementation phase

(These are intentionally NOT pre-decided here because they're answers only the implementation will reveal:)

- Which 3–4 screens per demo best represent the app's surface area? (orchestrator decides during Phase A by inspecting the source's route map.)
- For screenshots from running apps, which apps boot without database setup? (Phase A trial.)
- Bundle size budget — current is well under the 60 kB target, so this is unlikely to bind, but we'll measure.

## 12. Out of scope — explicit

- The marketing site (`src/components/sections/*`) is not redesigned.
- Case study copy in `src/data/portfolio.ts` is not rewritten.
- No new portfolio-wide sections are added.
- No deploy is performed as part of this spec — the user will deploy after acceptance.

## 13. What success looks like

A visitor clicks any "Try demo →" CTA in `Work` or `Projects` and lands on a screen that:

1. Reads as "that app" (right shell, right accent color, right monogram in the top bar).
2. Lets them click through 3–4 representative flows without hitting "coming soon" or empty state.
3. Shows synthetic fixtures that look real but obviously aren't real customer/vendor/employee names.
4. Carries no demo-app routing, color, or layout that another demo also has by default.

If two demos look interchangeable, the spec has not been delivered.
