# Sub-project A — Laguku.co Screenshot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace synthetic Laguku preview PNGs with a real `laguku.co` landing-page screenshot captured via Playwright headless, and update the case-study narrative to acknowledge the live capture.

**Architecture:** Standalone Playwright headless capture script (`scripts/capture-laguku.mjs`) navigates to `https://laguku.co`, waits for `networkidle`, screenshots the 1280×800 viewport, and atomically copies the result to both `public/assets/images/demos/laguku.png` and `public/assets/images/projects/laguku.png`. The case-study `fdeCallout` in `src/data/portfolio.ts` gains one sentence acknowledging the live capture. No new dependencies — Playwright is already in `devDependencies`.

**Tech Stack:** Playwright (1.61.x, already in `package.json`), Node.js built-in `node:fs/promises` and `node:url`.

---

## File Structure

### Files to create

- `scripts/capture-laguku.mjs` — standalone Playwright capture script.

### Files to modify

- `src/data/portfolio.ts` — append one sentence to `projectStories[laguku].fdeCallout`.

### Files generated (output of running the script)

- `public/assets/images/demos/laguku.png` — 1280×800 real capture (replaces iteration 2 mock).
- `public/assets/images/projects/laguku.png` — 1280×800 real capture (file copy of demos/ version).

---

## Task 1: Capture real laguku.co screenshot + update narrative

**Files:**
- Create: `scripts/capture-laguku.mjs`
- Modify: `src/data/portfolio.ts` (line ~528, `projectStories[laguku].fdeCallout`)

- [ ] **Step 1: Create `scripts/capture-laguku.mjs`**

Create the file at the repo root with this exact content:

```js
// scripts/capture-laguku.mjs
//
// Captures a real 1280×800 viewport screenshot of https://laguku.co and
// writes it to both public/assets/images/demos/laguku.png and
// public/assets/images/projects/laguku.png. Re-runnable any time laguku.co
// design changes; the case-study hero image stays fresh.
//
// Run: `node scripts/capture-laguku.mjs`

import { chromium } from "playwright";
import { mkdir, copyFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DEMOS_DIR = path.resolve(ROOT, "..", "public", "assets", "images", "demos");
const PROJECTS_DIR = path.resolve(ROOT, "..", "public", "assets", "images", "projects");
const URL = "https://laguku.co";
const VIEWPORT = { width: 1280, height: 800 };

async function capture() {
  await mkdir(DEMOS_DIR, { recursive: true });
  await mkdir(PROJECTS_DIR, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: VIEWPORT });
  await page.goto(URL, { waitUntil: "networkidle", timeout: 30000 });

  const outDemo = path.join(DEMOS_DIR, "laguku.png");
  const outProj = path.join(PROJECTS_DIR, "laguku.png");
  await page.screenshot({ path: outDemo, fullPage: false });
  await copyFile(outDemo, outProj);
  await browser.close();

  console.log(`✓ laguku → ${outDemo}`);
  console.log(`✓ laguku → ${outProj}`);
}

capture().catch((err) => {
  console.error(`✗ capture failed: ${err.message}`);
  process.exit(1);
});
```

- [ ] **Step 2: Run the capture script**

```bash
cd /Users/yanuar/Documents/abdurrahmanfirdaus.com
node scripts/capture-laguku.mjs
```

Expected output (2 lines + optional info logs):

```
✓ laguku → /Users/yanuar/Documents/abdurrahmanfirdaus.com/public/assets/images/demos/laguku.png
✓ laguku → /Users/yanuar/Documents/abdurrahmanfirdaus.com/public/assets/images/projects/laguku.png
```

If you see `✗ capture failed: ...`, run `node scripts/capture-laguku.mjs` once more — `laguku.co` may have a transient network error. If the second attempt also fails, check:
- Internet connectivity (`curl -sI https://laguku.co | head -1` should return `HTTP/2 200`)
- Playwright Chromium installed (`npx playwright install chromium` if missing)

If `laguku.co` returns 4xx/5xx, STOP and report — don't fabricate a fallback.

- [ ] **Step 3: Verify the PNGs**

```bash
ls -la public/assets/images/demos/laguku.png public/assets/images/projects/laguku.png
file public/assets/images/demos/laguku.png
```

Expected:
- Both files exist with **identical byte count** (copyFile produces identical bytes).
- File sizes roughly 150 KB – 500 KB (laguku.co has dark gradient hero — typical PNG size for 1280×800 hero image).
- `file` output: `PNG image data, 1280 x 800, 8-bit/color RGB, non-interlaced`.

If byte counts differ → bug (script's `copyFile` should produce identical bytes; investigate).
If dimensions differ from 1280×800 → script bug; verify viewport in source.

- [ ] **Step 4: Update case-study narrative**

In `src/data/portfolio.ts`, find the `fdeCallout` field of the Laguku `ProjectStory` entry. It's around line 528. Current text (note the trailing `—` em-dash before "The product wasn't missing."):

```ts
    fdeCallout:
      "I didn't start with a feature list. I started with the WhatsApp thread where my friend was trying to send his mom a song for her 60th — and couldn't find one in three hours. The product wasn't missing. The delivery was.",
```

Replace with:

```ts
    fdeCallout:
      "I didn't start with a feature list. I started with the WhatsApp thread where my friend was trying to send his mom a song for her 60th — and couldn't find one in three hours. The product wasn't missing. The delivery was. The hero image on this case study is a live capture of laguku.co — what you see is the production visual as of August 2026.",
```

(Note: when actually writing the file, use the literal em-dash character `—` rather than `—`. The escape is shown here only to keep this plan readable in plain text.)

The change adds exactly one trailing sentence: **" The hero image on this case study is a live capture of laguku.co — what you see is the production visual as of August 2026."**

- [ ] **Step 5: Typecheck**

```bash
npx tsc --noEmit -p tsconfig.app.json
```

Expected: clean (no errors, no output).

- [ ] **Step 6: Commit**

Stage all 4 changes:

```bash
git add scripts/capture-laguku.mjs
git add src/data/portfolio.ts
git add public/assets/images/demos/laguku.png
git add public/assets/images/projects/laguku.png
git commit -m "feat(laguku): capture real laguku.co screenshot for case study hero"
```

Expected commit: 4 files changed (1 new, 1 modified, 2 PNGs replaced — git records PNGs as binary modifications).

---

## Self-review

**Spec coverage:**

- §3.1 capture script → Step 1 ✅
- §3.2 file outputs (2 PNGs) → Step 2 + Step 3 ✅
- §3.3 narrative update → Step 4 ✅
- §8 verification (typecheck) → Step 5 ✅
- §9 commit strategy → Step 6 ✅

**Placeholder scan:** No "TBD", "TODO", "implement later", "fill in details", "add appropriate handling" patterns. Every step has actual commands or actual code.

**Type consistency:** The `fdeCallout` field type is `string` — unchanged. The script uses Playwright types (`Browser`, `Page`) from the `playwright` package, all standard.

**Ambiguity check:**

- Step 1 em-dash encoding: the plan writes `—` for readability, but the actual file edit should use the literal em-dash `—`. This is called out in Step 4 with an explicit note.
- Step 2 "STOP and report": if `laguku.co` returns 4xx/5xx, the implementer must NOT fabricate a fallback. Real failure → real report.
- Step 3 byte-count identical check: `copyFile` is a byte-for-byte copy, so identical sizes are guaranteed if the file write succeeded. Mismatch = corruption.
- Step 4 narrative location: "around line 528" is approximate — the file grows as case studies are added. Search by `id: "laguku"` to find the entry unambiguously.