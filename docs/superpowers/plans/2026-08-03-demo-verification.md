# Demo Verification — Orchestrator Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans. After all 5 per-app plans complete, the orchestrator runs this verification end-to-end.
>
> **Pre-req:** Foundation + all 5 per-app plans complete.

**Goal:** Verify that all 5 demos are production-ready under the spec's "high visual fidelity" bar — each demo looks distinct, builds clean, has interactive flow, and passes NDA grep.

**Architecture:** Sequential verification across the 5 demos + a final cross-portfolio check. The orchestrator (this session) runs the verification; per-app subagents are NOT used here — the work is small and reviewing screenshots is the orchestrator's job.

---

## Task V1: Pre-build sanity check

**Files:** none touched

- [ ] **Step 1: Tree check**

```bash
cd /Users/yanuar/Documents/abdurrahmanfirdaus.com
ls src/demos/{invenflow,invoice-sense,channelflow,kitchen-fresh,people-culture}/
```

Each should contain: `index.tsx`, `routes.tsx`, `mocks.ts`, `README.md`, `screens/`.

- [ ] **Step 2: Shared layer check**

```bash
ls src/demos/_shared/{theme,useTheme,Shell,TopBar,Sidebar,Brand,Button,Badge,Field,Sheet,Stepper,KanbanColumn,DataTable,EmptyState,StatTile,futures/index}.ts src/demos/_shared/themes/
```

Expected: each `.ts(x)` present; `themes/` dir has 5 files.

- [ ] **Step 3: Registry check**

```bash
grep "theme:" src/demos/_index.ts
```

Expected: each demo entry has a `theme:` field.

---

## Task V2: NDA grep — must be clean across the entire `src/demos/` subtree

- [ ] **Step 1: Run the canonical grep**

```bash
cd /Users/yanuar/Documents/abdurrahmanfirdaus.com
grep -rE 'xero|iseller|teaspoon|mastra|whatsapp|tsp|BNI|tenantId|api[_-]?key|secret' src/demos/
```

Expected: **no hits** tied to a real identifier. Notes:
- `"WhatsApp"` may appear only in channel-name demos (Channelflow) as a public product label — that is fine.
- Any other hit is a violation; consult the subagent report and decide: rename fixture, comment as case-study copy, or remove.

- [ ] **Step 2: Cross-check with grep -l**

```bash
grep -rEl 'xero|iseller|teaspoon|mastra|whatsapp|tsp|BNI|tenantId' src/demos/
```

If any file is listed, fix it before continuing.

- [ ] **Step 3: Production-repo untouched check**

```bash
cd /Users/yanuar/Documents/invenflow 2>/dev/null && git status -s || echo "no invenflow cwd"
```

Per-demo: confirm each of the 5 production repos shows `nothing to commit` (the working copy was not modified by this work).

---

## Task V3: Build clean

- [ ] **Step 1: Type-check + build**

```bash
cd /Users/yanuar/Documents/abdurrahmanfirdaus.com
rm -rf dist
npm run build 2>&1 | tee /tmp/build.log
```

Expected: exit 0. Inspect `/tmp/build.log`:
- All 5 demo chunks emitted (manualChunks per vite.config.ts).
- Per-demo chunk sizes — each < 60 kB gzip.

- [ ] **Step 2: If build fails — triage**

Most likely failures in priority order:
1. Type errors in screens — fix in place; do not bypass with `as any`.
2. Missing `theme` prop in `index.tsx` — add it.
3. Missing import for a primitive — add it.
4. Chunk size > 60 kB — investigate via `npx vite-bundle-visualizer`.

---

## Task V4: Dev server smoke test

- [ ] **Step 1: Start dev**

```bash
cd /Users/yanuar/Documents/abdurrahmanfirdaus.com
npm run dev &
sleep 5
curl -sI http://localhost:3000/ | head -1
```

Expected: `HTTP/1.1 200 OK`.

- [ ] **Step 2: For each demo, visit the hub + one screen, screenshot**

For each `id` in `invenflow, invoice-sense, channelflow, kitchen-fresh, people-culture`:

```js
// via Playwright MCP
mcp__playwright__browser_navigate({ url: `http://localhost:3000/#/demos/${id}` })
// take screenshot, then continue to one screen
mcp__playwright__browser_navigate({ url: `http://localhost:3000/#/demos/${id}/<one-screen>` })
mcp__playwright__browser_take_screenshot({ type: "png", filename: `verify-${id}.png` })
```

Save screenshots in `.playwright-mcp/verify-{id}.png` (or `/tmp/`).

- [ ] **Step 3: Compare screenshots for distinctness**

Open each screenshot side-by-side. Confirm:
- 5 demos have visibly different shell colors / brand accents.
- 5 demos have different monograms in the top bar.
- 5 demos have visibly different sidebar / top-bar accents.

If two demos look interchangeable, dispatch a fix subagent for whichever demo does not match its source recon.

- [ ] **Step 4: Console error check**

```js
mcp__playwright__browser_console_messages({ level: "error" })
```

Expected: only the Vercel Analytics 404 in preview environment (acceptable). No JS errors during navigation.

---

## Task V5: Per-demo interaction spot-check

For each demo, click 1 primary interaction (per the per-app subagent's report):

| Demo | Interaction |
|---|---|
| Invenflow | Move a PO card from New → Approve via "Advance →" button |
| Invoice Sense | Click an invoice row; mismatch drawer opens for INV-0002 / INV-0006 |
| Channelflow | Click a thread; conversation panel loads |
| Kitchen Fresh | Cycle a prep item through pending → in-progress → done |
| People & Culture | Stepper: click step 2 in onboarding wizard |

Record pass/fail per demo in the final report.

---

## Task V6: Marketing site unaffected

- [ ] **Step 1: Visit `/`**

```js
mcp__playwright__browser_navigate({ url: "http://localhost:3000/" })
mcp__playwright__browser_take_screenshot({ type: "png", filename: "verify-marketing.png" })
```

- [ ] **Step 2: Confirm**

Compare to pre-build screenshot (`final-marketing.png` in project root). Expected: visually identical (the rebuild should not touch the marketing site).

---

## Task V7: Stop dev + final commit

- [ ] **Step 1: Stop dev**

```bash
pkill -f vite
```

- [ ] **Step 2: Commit verification screenshots if kept in repo**

(Optional — they're useful as a permanent record of "before user review".):

```bash
cd /Users/yanuar/Documents/abdurrahmanfirdaus.com
git add .playwright-mcp/verify-*.png 2>/dev/null
git commit -m "chore(demos): post-rebuild verification screenshots"
```

(Only if `.playwright-mcp/` is git-ignored, skip the commit entirely.)

---

## Verification report (template)

```markdown
# Demo rebuild verification report

Date: 2026-08-03

## Build
- npm run build: PASS / FAIL
- Chunks: vendor=X kB, demo-shared=Y kB, demo-{id} ranges Z-W kB

## NDA
- grep src/demos/: clean / n hits (listed)

## Per-demo

### Invenflow
- Hub: …
- One screen: …
- Interaction: pass/fail
- Screenshot: path

### Invoice Sense
- … (same)

### Channelflow
- …

### Kitchen Fresh
- …

### People & Culture
- …

## Marketing site
- Unchanged: yes / no (diff summary)

## Issues found
- (list with priority and owner)

## Recommendation
- Ready for user review / needs follow-up
```

---

## Stop criteria

- Build is green.
- 5 demos render with distinct visual identity (each screenshot is visibly different from the other 4).
- All 5 primary interactions work.
- NDA grep is clean.
- Marketing site unchanged.

If any of the above fail, **do not consider verification complete**. Dispatch a fix subagent or directly patch the failure, then re-run V2–V5 for the affected demo.
