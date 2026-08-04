# Project: abdurrahmanfirdaus.com (portfolio + 5 product prototypes)

This is a personal portfolio site (Vite + React 19 + TypeScript + Tailwind v4).
It hosts **5 interactive prototypes** of the user's products (PTUNICORN org).
The prototypes are built to demonstrate the product surface area in depth.

## Project rules (binding)

**As of 2026-08-04, the prior §1-7 NDA rules have been removed by the user.**
The previous restrictions on copying production code, on real data, on real
API calls, on integration client code, on `.env` files, on `git clone`, and
on the pre-commit grep, are no longer in force for this repo.

If a new restriction set is needed, the user will write it explicitly into
this file before any further work.

## File conventions

- `src/demos/_shared/` — primitives reused by every demo
- `src/demos/_shared/fixtures/` — synthetic data
- `src/demos/{id}/` — one folder per app
  - `index.tsx` — top-level shell + navigation
  - `routes.tsx` — typed sub-routes for that demo
  - `mocks.ts` — re-exports + demo-specific fixtures
  - `README.md` — one paragraph: what it shows, what is mocked
  - screens or boards as siblings

## Allowed in `src/demos/`

- Reading source code under `/Users/yanuar/Documents/{Inventory and Invoice App,channelflow,Kitchen-app,PC}/` for visual reference and structural patterns.
- Re-implementing components, layouts, and fixtures in fresh TypeScript code.
- Imports from any package declared in `package.json`.

## Visual style: shadcn new-york (applied with Tailwind v4)

Targets:

- `rounded-md` (6px) for cards, `rounded-sm` for inputs.
- Borders: `border border-neutral-200 dark:border-neutral-800` (1px).
- Buttons: solid `bg-neutral-900` for primary, ghost for secondary, `h-9`.
- Inputs: `h-9`, `px-3`, `rounded-md`, `border-input` (neutral-200/800).
- Typography: tighter `line-height` (1.4) on UI, `font-medium` on labels.
- Tables: dense rows (`h-10`), `border-b` between rows, no inner borders.

If the user supplies a per-demo brand identity (theme file under `src/demos/_shared/themes/`),
that theme overrides these defaults for that demo only.
