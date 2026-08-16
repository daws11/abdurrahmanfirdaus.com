---
title: Sub-project A — Real laguku.co screenshot capture
date: 2026-08-16
status: draft
owner: Abdurrahman Firdaus
source-task: Iteration 3 / Sub-project A — replace synthetic Laguku preview with real laguku.co screenshot
parent-iteration: iteration 2 enhancements (spec 2026-08-13)
---

# Sub-project A — Real laguku.co screenshot capture

## 1. Konteks & masalah

Iteration 2 menambahkan 4 demo baru (commit `5145a28` spec, `927b351` plan, `860618e`–`c71f302` task commits; iteration 2 enhancement commits `65448c1`–`fbef240`). Untuk preview image, iteration 2 Task 5 membuat 4 mock HTML di `scripts/preview-render/` dan men-capture-nya via Playwright ke PNG.

Laguku preview saat ini (`public/assets/images/demos/laguku.png` + `public/assets/images/projects/laguku.png`) adalah mock sintetik dari `scripts/preview-render/laguku.html` — bukan visual asli produk. User-flagged: prototype "masih sangat tidak mirip" dan ingin screenshot asli dari `laguku.co` (laguin.id) untuk case study.

Laguku sudah redirect-only dari DemoHub (shell demo dihapus di iteration 2 Task 1) sehingga demo visual satu-satunya untuk Laguku adalah case study hero image + FocusRail card image.

## 2. Keputusan yang disetujui (dari brainstorming 2026-08-16)

1. **Sub-project A** jadi quick-win pertama, sebelum Sub-project B/C/D (TaxAI 99% fidelity).
2. **Pendekatan 1** — phase per sub-project dengan spec → plan → implementation sendiri.
3. **Capture mode** — viewport only (1280×800), bukan full-page scroll.
4. **Image placement** — replace mock di kedua path (`demos/` dan `projects/`).
5. **Narrative update** — yes, tambah 1 kalimat di `projectStories[laguku]` referencing real screenshot.

## 3. Arsitektur

### 3.1 Capture script

Standalone Playwright headless capture script. Berbeda dari `scripts/preview-render/capture.mjs` (yang boot static HTTP server untuk mock HTML), script ini navigate ke live site.

**File baru**: `scripts/capture-laguku.mjs`

```js
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

**Design decisions:**

- **Viewport 1280×800** — match existing demo PNG dimensions (verified di iteration 2 Task 7).
- **`waitUntil: "networkidle"`** — tunggu hero section + lazy-loaded assets settle. Alternative `domcontentloaded` lebih cepat tapi bisa capture layout shift.
- **Cookie banner** — jika `laguku.co` menampilkan cookie consent, screenshot akan include banner overlay. Iterasi pertama skip dismiss — kalau banner visually dominates, tambahkan `page.locator(...).click()` di iterasi selanjutnya. Out-of-scope untuk A.
- **`timeout: 30000`** — 30 detik timeout untuk navigate + networkidle. Laguku.co simple SPA, biasanya <5 detik. 30s generous untuk slow connection.
- **Atomic copy** — script capture sekali ke `demos/`, lalu copy ke `projects/`. Hindari 2 navigations yang bisa produce different screenshots jika laguku.co ada random element (misalnya rotating testimonials).
- **No `--skip-screenshots` flag** — script selalu capture. Jika laguku.co down, exit 1.
- **Standalone file** — bukan extension dari `scripts/preview-render/capture.mjs` karena flow-nya beda (live site vs static HTML server).

### 3.2 File outputs

```
public/assets/images/demos/laguku.png       # 1280×800 (NEW — replaces mock)
public/assets/images/projects/laguku.png    # 1280×800 (NEW — replaces mock)
```

Demos dan projects size harus sama karena `copyFile` dari source yang sama. Verifikasi di Step 5.

### 3.3 Case study narrative update

Tambah 1 kalimat ke `fdeCallout` di `src/data/portfolio.ts` ProjectStory entry untuk laguku (sekitar line 528). Current:

```ts
    fdeCallout:
      "I didn't start with a feature list. I started with the WhatsApp thread where my friend was trying to send his mom a song for her 60th — and couldn't find one in three hours. The product wasn't missing. The delivery was.",
```

Replace dengan:

```ts
    fdeCallout:
      "I didn't start with a feature list. I started with the WhatsApp thread where my friend was trying to send his mom a song for her 60th — and couldn't find one in three hours. The product wasn't missing. The delivery was. The hero image on this case study is a live capture of laguku.co — what you see is the production visual as of August 2026.",
```

**Design decisions:**

- Capture date "August 2026" di-include di kalimat supaya pembaca tahu kapan visual ini di-snapshot. Lebih spesifik (date of run) lebih baik tapi spec script tidak pass argumen tanggal; user bisa re-run kapan saja untuk refresh. Generic month-year cukup.
- Tidak add section baru atau expand story — fokus minimal di 1 kalimat acknowledgment sesuai user request.
- Tidak touch `kicker`, `story`, `impact`, `outcomes`, `stack`, `integrations`, `heroSrc`, `duration`, `teamSize` — semua field lain tetap sama.

## 4. File structure

### New files

```
scripts/capture-laguku.mjs
```

### Modified files

```
src/data/portfolio.ts                 # projectStories[laguku].fdeCallout (1 kalimat tambahan)
public/assets/images/demos/laguku.png # replaced by script output
public/assets/images/projects/laguku.png # replaced by script output
```

### Files NOT changed

- `scripts/preview-render/laguku.html` — mock HTML tetap (untuk iterasi 2 reference, jika user ingin re-run capture lama)
- `src/demos/_index.ts` — Laguku entry tetap (sudah punya `externalUrl: "https://laguku.co"` dari iterasi 2)
- `src/demos/_shared/DemoHub.tsx` — Laguku card logic tidak berubah
- `src/components/sections/work.tsx` — case study list render tidak berubah
- `src/components/sections/ProjectPage.tsx` — case study page tidak berubah
- Vite config, package.json — tidak ada dependency baru

## 5. Implementation order

1. **Create capture script** — `scripts/capture-laguku.mjs` dengan Playwright headless
2. **Run script** — verifikasi 2 PNGs ter-write dengan size sama
3. **Update narrative** — tambah 1 kalimat ke `fdeCallout` di `projectStories[laguku]`
4. **Typecheck** — pastikan TypeScript masih clean
5. **Commit** — script + narrative update + PNGs sebagai 1 commit

## 6. Yang TIDAK dilakukan

- Tidak capture full-page scroll (user pilih viewport only)
- Tidak ubah `kicker` atau `story` field pada Laguku entry
- Tidak add cookie banner dismiss logic (out-of-scope, iterasi berikutnya jika perlu)
- Tidak ubah TaxAI demos (Sub-project B/C/D terpisah)
- Tidak add capture timestamp ke filename
- Tidak setup CI/scheduled re-capture

## 7. Open questions

Tidak ada. Semua keputusan sudah dikunci di sesi brainstorming 2026-08-16.

## 8. Verifikasi

- `node scripts/capture-laguku.mjs` exit 0, 2 PNGs ter-write
- `ls -la public/assets/images/demos/laguku.png public/assets/images/projects/laguku.png` — sizes match (~150-300 KB)
- `npx tsc --noEmit -p tsconfig.app.json` clean
- `npm run build` clean
- Manual: `http://localhost:3001/#/demos` → Laguku card shows real screenshot (not mock)
- Manual: `http://localhost:3001/#/projects/laguku` → case study hero shows real screenshot + fdeCallout includes "live capture of laguku.co"

## 9. Commit strategy

1 commit untuk Sub-project A:
- `scripts/capture-laguku.mjs` (new)
- `src/data/portfolio.ts` (narrative update)
- `public/assets/images/demos/laguku.png` (replaced)
- `public/assets/images/projects/laguku.png` (replaced)

Commit message: `feat(laguku): capture real laguku.co screenshot for case study hero`

## 10. Risks & mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| `laguku.co` returns error / down | Low | Script exit 1 dengan clear error message; CI/local run tidak proceed |
| `laguku.co` shows different layout for mobile vs desktop | Already handled | Viewport 1280×800 explicit, `waitUntil: "networkidle"` wait for stable render |
| Cookie banner overlays hero | Medium | Out-of-scope; future iteration if banner dominates visual |
| Playwright version mismatch with system Chromium | Low | Project uses Playwright 1.61.1 (in package.json) which auto-fetches Chromium binary on `npm install` |
| Narrative update breaks Markdown rendering | Very low | Single sentence added inside existing quote string, no Markdown parse change |