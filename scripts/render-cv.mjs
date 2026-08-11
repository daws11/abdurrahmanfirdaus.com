import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const PORT = 4173;
const RESUME_URL = process.env.RESUME_URL || `http://localhost:${PORT}/resume`;
const outPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "CV.pdf");

async function waitForServer(url, timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`server not ready at ${url} after ${timeoutMs}ms`);
}

// If RESUME_URL is overridden, assume a server is already running.
const preview = process.env.RESUME_URL
  ? null
  : spawn("npx", ["vite", "preview", "--port", String(PORT)], { stdio: "ignore" });

try {
  if (preview) await waitForServer(`http://localhost:${PORT}/`);

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(RESUME_URL, { waitUntil: "networkidle" });
  await page.emulateMedia({ media: "print" });
  await page.pdf({
    path: outPath,
    format: "Letter",
    printBackground: true,
    margin: { top: "0.5in", bottom: "0.5in", left: "0.5in", right: "0.5in" },
  });
  await browser.close();
  console.log(`✓ CV.pdf regenerated at ${outPath}`);
} finally {
  preview?.kill();
}
