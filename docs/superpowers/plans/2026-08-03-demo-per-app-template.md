# Per-App Demo Build — Subagent Template

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (one subagent per app). Each plan follows this template with `{id}` substituted per app.
>
> **Pre-req:** Foundation plan (`2026-08-03-demo-foundation.md`) is complete. `src/demos/_shared/{theme,Shell,Button,Badge,Field,Sheet,Stepper,KanbanColumn,DataTable,EmptyState,StatTile,TopBar,Sidebar,Brand,futures/index}.ts(x)` exist and are wired.

**Goal:** Build one demo (`{id}`) end-to-end with its brand identity applied, ready for verification.

**Architecture:** Each per-app plan is independent. Subagent receives the theme, contract, recon report, and a subagent brief (per spec §9). Subagent owns 1 demo and reports back with: built screens, interactions that work, screenshot path, NDA grep result.

---

## Per-app subagent brief template

Replace `{ID}`, `{LOCAL_DIR}`, `{ROUTES}`, `{SCREENS}` per app before dispatch.

---

### Pre-dispatch: per-app dispatch JSON

```yaml
id: <one of: invenflow, invoice-sense, channelflow, kitchen-fresh, people-culture>
local_dir: <absolute path to production source>
demo_dir: src/demos/<id>/
contract: docs/demos-design-contracts.md
recon: .claude/recon-<id>-style.md
theme_module: src/demos/_shared/theme.ts (record THEMES[id])
build_check: npm run build
dev_check: npm run dev (port 3000)
screenshot_tool: Playwright MCP
```

---

## Task P1: Per-app — read theme + recon

**Files (read-only):**
- Read: `docs/demos-design-contracts.md`
- Read: `.claude/recon-{id}-style.md`

- [ ] **Step 1: Read contract**

Locate the section for this app's id in `docs/demos-design-contracts.md`. Extract:
- Brand: name, monogram, surface (light/dark)
- Token values: `--bg`, `--surface`, `--fg`, `--muted`, `--border`, `--accent`, `--accent-fg`, `--warn`, `--ok`, `--bad`
- Shell: `sidebarWidth`, `topBarHeight`, `density`
- Font family

- [ ] **Step 2: Read recon report**

Extract:
- Routes in production app (top-level paths)
- Density scale (`p-3`/`p-4` etc.)
- Component vocabulary (badges, tables, sheets, steppers, kanban columns)
- NDA-flagged files to never import

---

## Task P2: Build `mocks.ts` (synthetic fixtures)

**Files:**
- Create: `src/demos/{id}/mocks.ts`

- [ ] **Step 1: Define types**

Each demo defines the types it needs locally. Example shape:

```ts
// src/demos/{id}/mocks.ts
import type { OutletId } from "@/demos/_shared/fixtures/inventory";

export interface {AppType}Item {
  id: string;
  ...
}

// Re-export shared fixtures with this demo's domain names where useful.
export { OUTLETS, VENDORS, SKUS } from "@/demos/_shared/fixtures/inventory";
```

- [ ] **Step 2: Define synthetic fixture rows**

Sizes (target qualitative depth, not exact counts):
- Invenflow: 6 POs, 4 receiving items, 8 stocktake SKUs × 5 outlets = 40 rows
- Invoice Sense: 8 invoices
- Channelflow: 10 bookings
- Kitchen Fresh: 14 prep items × 5 outlets = 70
- People & Culture: 24 employees

Naming conventions (mandatory, NDA-safe):
- IDs: `INV-0001`, `PO-0001`, `EMP-042`, `TG-01`, `O1`, `WH`
- Vendors: `Vendor A` … `Vendor E`
- People: `Person 01` … `Person 24`, `Guide 01` … `Guide 05`
- Channel: `WhatsApp`, `Instagram`, `Email`, `TikTok` (public product names are fine)
- Status labels: invent fresh; do not copy

- [ ] **Step 3: Build & commit**

```bash
cd /Users/yanuar/Documents/abdurrahmanfirdaus.com
npm run build
git add src/demos/{id}/mocks.ts
git commit -m "feat(demos/{id}): synthetic fixtures in mocks.ts"
```

---

## Task P3: Build `routes.tsx`

**Files:**
- Create: `src/demos/{id}/routes.tsx`

```ts
// src/demos/{id}/routes.tsx
//
// Typed sub-routes for this demo. URL shape: #/demos/{id}/{screen}.
// The router in src/demos/router.tsx passes `sub` to the demo component.

export type {Id}Screen = "..." | "...";

export const {ID}_SCREENS: { id: {Id}Screen; label: string; icon?: string }[] = [
  // one row per screen the demo implements
];

export function getScreenLabel(sub: string | null, fallback: {Id}Screen): {Id}Screen {
  if (!sub) return fallback;
  return ({ID}_SCREENS.find((s) => s.id === sub)?.id ?? fallback) as {Id}Screen;
}
```

The exact screens list comes from the recon report. Choose 3–4 screens that best represent the app.

- [ ] **Step 1: Build & commit**

```bash
git add src/demos/{id}/routes.tsx
git commit -m "feat(demos/{id}): typed routes"
```

---

## Task P4: Build `index.tsx` (the shell + router for this demo)

**Files:**
- Create: `src/demos/{id}/index.tsx`

Pattern (per-app specifics filled in):

```tsx
// src/demos/{id}/index.tsx
import { useMemo } from "react";
import { Shell } from "@/demos/_shared/Shell";
import { useTheme } from "@/demos/_shared/useTheme";
import { setDemoHash } from "@/demos/router";
import { THEMES, type DemoTheme } from "@/demos/_shared/theme";
import { {ID}_SCREENS, getScreenLabel } from "./routes";
import { default as {Screen1} } from "./screens/{Screen1}";
// ... one import per screen

export function {Id}({ theme, sub }: { theme: DemoTheme; sub: string | null }) {
  useTheme(theme.id);          // applies .demo-{id} + tokens to <html>
  const screen = getScreenLabel(sub, "default-screen-id");
  // sidebar nav row per screen
  const nav = useMemo(() => (
    <ul className="space-y-0.5 px-2">
      {{ID}_SCREENS.map((s) => {
        const active = screen === s.id;
        return (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => setDemoHash(theme.id, s.id)}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm"
              style={{
                backgroundColor: active ? "var(--surface)" : "transparent",
                color: active ? "var(--fg)" : "var(--muted)",
              }}
            >
              {s.label}
            </button>
          </li>
        );
      })}
    </ul>
  ), [screen, theme.id]);

  // screen content
  const content = (() => {
    switch (screen) {
      case "...": return <{Screen1} />;
      // ...
      default: return <{DefaultScreen} />;
    }
  })();

  return <Shell theme={theme} nav={nav}>{content}</Shell>;
}
```

- [ ] **Step 1: Build**

```bash
npm run build
```
Expected: build passes (screens may be stubs for now; they get filled in P5).

- [ ] **Step 2: Commit**

```bash
git add src/demos/{id}/index.tsx
git commit -m "feat(demos/{id}): app shell wrapping Shell + screen router"
```

---

## Task P5: Build screens

**Files:**
- Create: `src/demos/{id}/screens/{Screen1}.tsx` … `src/demos/{id}/screens/{ScreenN}.tsx`

Each screen file is the actual UI. Subagent should:

1. Use the brand tokens via `var(--accent)`, `var(--bg)`, etc. (NEVER hardcode hex).
2. Use the shared primitives from `src/demos/_shared/` — don't re-implement Button, Badge, Sheet, etc.
3. Use synthetic fixtures from `mocks.ts`.
4. Provide at least one interactive flow per screen — see spec §2 "interactivity":
   - State changes (kanban transitions, toggle, edit)
   - Drawers (drill into detail)
   - Filters / search
   - Multi-step (wizard)
5. Keep files focused: one screen per file, ~150–400 lines.

- [ ] **Step 1: Implement first screen**

Follow the production app's layout for that screen, but write every line fresh. Use the contract tokens.

- [ ] **Step 2: Implement remaining screens**

Repeat for each.

- [ ] **Step 3: Build**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/demos/{id}/screens/
git commit -m "feat(demos/{id}): screens ({list})"
```

---

## Task P6: README.md (mandatory per app)

**Files:**
- Create: `src/demos/{id}/README.md`

One paragraph (3–5 sentences), exactly:

- What this demo shows.
- Which screens exist and what clicking does.
- What is mocked vs not.
- Hard statement of NDA boundary.

Example skeleton (engineer fills in app-specific text):

```md
# {Brand}

{One paragraph: what this demo demonstrates, which 3–4 screens exist,
the primary click-through flow, and what's mocked.}

## NDA

Synthetic data only. Brand identity, layout conventions, and component
vocabulary are derived from the production app's visual style — no
production code, schemas, integrations, or fixtures are committed to this
repository.
```

- [ ] **Step 1: Write README**

- [ ] **Step 2: Commit**

```bash
git add src/demos/{id}/README.md
git commit -m "docs(demos/{id}): README"
```

---

## Task P7: Subagent final checklist (mandatory)

Before reporting back to the orchestrator, subagent MUST:

- [ ] **Step 1: NDA grep — must return zero hits**

```bash
cd /Users/yanuar/Documents/abdurrahmanfirdaus.com
grep -rE 'xero|iseller|teaspoon|mastra|whatsapp|tsp|BNI|tenantId|api[_-]?key|secret' src/demos/{id}/
```

Expected: nothing. (`WhatsApp`-style product name in case-study copy is OK; we don't use it in fixtures.)

If any hit ties to a real identifier, fix and re-run.

- [ ] **Step 2: Build clean**

```bash
npm run build
```

Expected: exit 0. If any TS error mentions a primitive prop signature mismatch, escalate.

- [ ] **Step 3: Dev server boots**

```bash
npm run dev &
sleep 5
curl -sI http://localhost:3000/ | head -1
```

Expected: `HTTP/1.1 200 OK`. Stop the dev server with `pkill -f vite` after.

- [ ] **Step 4: Playwright screenshot of one representative screen**

Use `mcp__playwright__browser_navigate` to open:

```
http://localhost:3000/#/demos/{id}/<one-screen>
```

Then `mcp__playwright__browser_take_screenshot` with `filename: src/demos/{id}/screenshot.png` (or to `/tmp/{id}-screenshot.png`).

- [ ] **Step 5: Stop dev, commit screenshot if needed**

```bash
pkill -f vite
git add src/demos/{id}/screenshot.png 2>/dev/null || true
git commit -m "chore(demos/{id}): verification screenshot" 2>/dev/null || true
```

---

## Subagent report (template)

After all P1–P7 done, subagent returns:

```markdown
# {Brand} demo — subagent report

## Built
- Files created: (list)
- Screens implemented: (list with one-sentence purpose each)
- Interactions: (kanban transitions, drawer open, filter, etc.)

## Synthetic fixtures
- (count) rows in (name) collection
- (count) rows in (name) collection

## NDA
- grep result: clean / n hits (with explanation)

## Verification
- npm run build: passed / failed
- Browser smoke test: visited (route), observed (state)

## Screenshot
- /path/to/screenshot.png
- One-line visual description: "Shell with brand color X, top bar shows monogram Y, main content shows Z."

## Out of scope (deferred)
- (anything the spec did not require)
```

---

## Per-app dispatch checklist (orchestrator side)

After receiving a subagent report:

- [ ] Read the report
- [ ] Open the screenshot (Playwright or Read)
- [ ] Verify NDA grep result is clean
- [ ] Verify build passed
- [ ] Confirm at least 1 interaction noted in report
- [ ] Mark the demo as done

---

## What's next

After all 5 per-app subagents return clean reports, run the verification plan
(`2026-08-03-demo-verification.md`).
