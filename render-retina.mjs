import { chromium } from 'playwright';

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1584, height: 396 },
  deviceScaleFactor: 2,
});
const page = await context.newPage();
await page.goto('http://127.0.0.1:8801/banner-retina.html', { waitUntil: 'networkidle' });
// wait for Google Fonts to fully load
await page.waitForTimeout(3500);
await page.screenshot({
  path: '/Users/yanuar/Documents/abdurrahmanfirdaus.com/linkedin-banner.png',
  clip: { x: 0, y: 0, width: 1584, height: 396 },
  omitBackground: false,
});
await browser.close();
console.log('✓ retina banner rendered at 2x device scale');
