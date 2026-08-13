import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { mkdir, copyFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import http from "node:http";
import fs from "node:fs";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PREVIEWS_DIR = path.resolve(ROOT);
const DEMOS_DIR = path.resolve(ROOT, "..", "..", "public", "assets", "images", "demos");
const PROJECTS_DIR = path.resolve(ROOT, "..", "..", "public", "assets", "images", "projects");
const PORT = 5183;

// Tiny static file server so Playwright can fetch the mock HTML via http://.
const server = http.createServer((req, res) => {
  const file = path.join(PREVIEWS_DIR, decodeURIComponent(req.url === "/" ? "/laguku.html" : req.url));
  try {
    const body = fs.readFileSync(file);
    const ext = path.extname(file);
    const ct = ext === ".html" ? "text/html; charset=utf-8" : "application/octet-stream";
    res.writeHead(200, { "Content-Type": ct });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
});

const TARGETS = [
  { id: "laguku", html: "laguku.html" },
  { id: "taxai-wizard", html: "taxai-wizard.html" },
  { id: "taxai-chat", html: "taxai-chat.html" },
  { id: "taxai-talk", html: "taxai-talk.html" },
];

async function waitForServer(url, timeoutMs = 10000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error(`server not ready at ${url}`);
}

try {
  await mkdir(DEMOS_DIR, { recursive: true });
  await mkdir(PROJECTS_DIR, { recursive: true });
  await new Promise((r) => server.listen(PORT, r));
  await waitForServer(`http://localhost:${PORT}/`);

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  for (const t of TARGETS) {
    await page.goto(`http://localhost:${PORT}/${t.html}`, { waitUntil: "networkidle" });
    const outDemo = path.join(DEMOS_DIR, `${t.id}.png`);
    const outProj = path.join(PROJECTS_DIR, `${t.id}.png`);
    await page.screenshot({ path: outDemo, fullPage: false });
    await copyFile(outDemo, outProj);
    console.log(`✓ ${t.id} → ${outDemo} + ${outProj}`);
  }

  await browser.close();
  console.log(`✓ Captured ${TARGETS.length} previews`);
} finally {
  server.close();
}