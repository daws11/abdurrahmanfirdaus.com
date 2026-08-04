# Demo recon — PTUNICORN repos

Read-only inspection via `gh api`. Source: https://github.com/PTUNICORN/{name}
on 2026-07-30. No `git clone` performed.

## Per-repo summary

| Repo | Stack | UI lib | Backend | Top-level layout | Disk |
|---|---|---|---|---|---|
| `Invoice-Sense` | Vite 7 + React 18 + Express + Drizzle/Postgres | Radix UI primitives + cva (full shadcn new-york) | Express, passport-local, drizzle-orm, ws | root is the app; `client/` and `server/` likely subfolders | 33 MB |
| `invenflow` | Vite + React + TS (top-level `package.json` only declares dev/build/lint) | TBD — UI likely in subfolder | TBD | root has docs/CSVs only; app code in subfolder | 11 MB |
| `people-and-culture-app` | pnpm workspace monorepo | `design-system/` package | `packages/api` (TBD) | `mobile/`, `packages/`, `docs/`, `data-shapes/`, `product-overview.md`, `PRD.md` | 35 MB |
| `kitchen-fresh` | Vite 5 + React 18 + Express + Drizzle/Postgres | Radix UI primitives + cva (full shadcn new-york) | Express, ws, multer, ssh2-sftp | root is the app; `client/`, `server/` likely subfolders | 5 MB |
| `channelflow` | pnpm workspace monorepo (`apps/{server,web}`) | TBD (`apps/web`) | `apps/server` (TBD) | `apps/{server,web}`, `docs/`, `package.json` (concurrently only) | 12 MB |

All 5 repos: **TypeScript primary**, **private visibility**, **active within last 30 days**.

## UI framework findings

**Invoice-Sense** and **kitchen-fresh** are full shadcn new-york installs:

- `tailwindcss-animate` (v1.0.7), `tw-animate-css` (v1.2.5)
- `class-variance-authority`, `tailwind-merge`, `clsx`, `cmdk`
- Full Radix suite: accordion, alert-dialog, aspect-ratio, avatar, checkbox,
  collapsible, context-menu, dialog, dropdown-menu, hover-card, label,
  menubar, navigation-menu, popover, progress, radio-group, scroll-area,
  select, separator, slider, switch, tabs, toast, toggle, toggle-group,
  tooltip
- `wouter` for routing, `react-hook-form` for forms, `recharts` for charts,
  `react-day-picker` for dates, `vaul` for drawers
- `framer-motion` v11
- Vite 7 (Invoice-Sense) or Vite 5 (kitchen-fresh), Tailwind v3.4.17

**Style target for demos:** shadcn new-york applied with Tailwind v4.

## NDA risk flags found in root listings

- `Invoice-Sense` — `BNI_API_DOCS.md`, `BNIdirect_Inquiry_Account_StatementAPi.md`,
  `BNIdirect_JWT_Signature.md`, `XERO_SETUP_FIXED.md`,
  `INVOICE_SOURCE_IMPLEMENTATION.md`. Documents only, but they describe
  vendor-specific integration patterns. **Do not reproduce these in the demo.**
- `invenflow` — `Tspoonlab Sales Correction*.csv`, `tspoonlab_order_test.html`,
  `Gmail - Menunggu Pembayaran BNI Virtual Account...html`, multiple
  `.env.{dev,staging,production}` files. Real-looking data files in root.
  **Do not read these; do not reproduce.**
- `people-and-culture-app` — `PRD.md`, `data-shapes/`, `product-overview.md`,
  `mobile/` directory, `packages/` workspace. Highest risk: schema, business
  logic, employee data shapes likely present. **Do not read; do not reproduce.**
- `kitchen-fresh` — `iseller-wbhook-data.json` (raw iSeller webhook payloads
  in root), `tspoonlab-sales-*.csv`, `Acai Queen Mapping Table.csv`,
  `Dish_List.csv`, `TIB_Mapping_Table*.csv`. **Do not read; do not reproduce.**
- `channelflow` — only `.env.example` flagged. Lowest risk. pnpm workspace
  with `apps/{server,web}`.

## Repository layouts — where the UI lives (TBD = needs deeper read)

```
Invoice-Sense
├── .env.example
├── BNI_API_DOCS.md         ⚠️ do not read
├── Dockerfile
├── README.md
├── client/                 ← UI likely here
├── server/                 ← backend, do not read
└── package.json (root has full deps)

invenflow
├── .env.{dev,staging,production}*  ⚠️ do not read
├── CLAUDE.md
├── client/                 ← UI likely here (TS only, no express in root)
├── server/                 ← backend, do not read
└── package.json (root: dev/build/lint only)

people-and-culture-app
├── .env.example
├── PRD.md                  ⚠️ do not read
├── data-shapes/            ⚠️ do not read
├── product-overview.md     ⚠️ do not read
├── design-system/          ← shared UI package
├── packages/               ← monorepo packages
├── mobile/                 ← React Native app, do not read
├── docs/
└── pnpm-workspace.yaml

kitchen-fresh
├── .env.example
├── iseller-wbhook-data.json  ⚠️ do not read
├── tspoonlab-*.csv          ⚠️ do not read
├── client/                  ← UI likely here
├── server/                  ← backend, do not read
└── package.json (root has full deps)

channelflow
├── .env.example
├── apps/
│   ├── server/             ← backend, do not read
│   └── web/                ← UI here
├── docs/
└── package.json (concurrently only — root is workspace orchestrator)
```

## Per-demo approach

| Demo | Source of truth for rebuild | Risk level |
|---|---|---|
| **Invenflow** | Invenflow `client/` UI structure + `caseStudies[1]` story in `portfolio.ts` | Medium — TS files safe to read; do not touch `.env.*` or CSVs |
| **Invoice Sense** | `Invoice-Sense/client/` UI + `caseStudies[0]` story | Low — full shadcn new-york install, well-known patterns |
| **Channelflow** | `channelflow/apps/web/` UI + `caseStudies[2]` story | Low — clean monorepo, only `.env.example` flagged |
| **Kitchen Fresh** | `kitchen-fresh/client/` UI + projects[3] description | Low-Medium — full shadcn new-york, but webhook files in root |
| **People & Culture** | `people-and-culture-app/design-system/` + `projects[2]` description | **High** — `PRD.md`, `data-shapes/`, `product-overview.md` exist; do not open these |

## Decision: how to read each repo

For each demo, an Explore agent will:

1. List files in `client/` (or `apps/web/`, or `design-system/`) only
2. Read **at most 10 representative UI files** per repo:
   - 1–2 page/route entry points
   - 1–2 list/table components
   - 1–2 form/filter components
   - 1 layout component
3. **Skip**: any `*.test.*`, `*.stories.*`, `server/`, `api/`, `db/`,
   `migrations/`, `*.env*`, `seed*`, `*Webhook*`, `*webhook*`,
   `tspoonlab*`, `iseller*`, `BNI*`, `XERO*`, `*.csv`, `*.json`
   in root that look like fixtures or webhooks.

All recon output stays in this file or in `.claude/demos-recon-{repo}.md`.
**No recon output is committed to `src/demos/`** — only synthetic fixtures
go there.
