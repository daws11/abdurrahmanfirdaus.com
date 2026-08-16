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

capture();
