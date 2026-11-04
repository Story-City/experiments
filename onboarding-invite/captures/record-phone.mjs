import { chromium, devices } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = __dirname;
const phone = devices['iPhone 14'];
const feedUrl = 'https://story-city.github.io/experiments/onboarding-invite/?v=feed&reload=14';

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  ...phone,
  recordVideo: { dir: outDir, size: { width: phone.viewport.width, height: phone.viewport.height } },
});
const page = await context.newPage();

await page.goto(feedUrl, { waitUntil: 'networkidle' });
await page.waitForSelector('.guide-invite:not([hidden])');
await page.waitForTimeout(1800);

const feedX = page.locator('#guideInviteFeed [data-dismiss]');
await feedX.click();
await page.waitForTimeout(700);

await page.click('.dbg-btn[data-place="overview"]');
await page.waitForTimeout(3200);
await page.waitForSelector('#guideInviteOverview:not([hidden])');
await page.waitForTimeout(1200);

const overviewX = page.locator('#guideInviteOverview [data-dismiss]');
await overviewX.click();
await page.waitForTimeout(700);

await context.close();
await browser.close();

const fs = await import('node:fs');
const webm = fs.readdirSync(outDir).filter((f) => f.endsWith('.webm')).sort((a, b) => {
  return fs.statSync(path.join(outDir, b)).mtimeMs - fs.statSync(path.join(outDir, a)).mtimeMs;
})[0];
if (!webm) throw new Error('no webm recorded');
const dest = path.join(outDir, 'phone-flow.webm');
fs.renameSync(path.join(outDir, webm), dest);
console.log(dest);
