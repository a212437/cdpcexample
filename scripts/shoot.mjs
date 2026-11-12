import { chromium } from 'playwright-core';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const base = (process.env.SITE_URL ?? 'http://127.0.0.1:4321/cdpcexample').replace(/\/$/, '');
const executablePath =
  process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const out = process.env.SHOT_DIR ?? path.join(os.tmpdir(), 'cdpc-shots');
await fs.mkdir(out, { recursive: true });

const browser = await chromium.launch({
  executablePath,
  headless: true,
});

const pages = process.argv.slice(2);
const targets = pages.length ? pages : ['/', '/visit'];

for (const path of targets) {
  const name = path === '/' ? 'home' : path.replace(/^\//, '').replaceAll('/', '-');
  for (const [label, viewport] of [
    ['desktop', { width: 1440, height: 1000 }],
    ['mobile', { width: 390, height: 844 }],
  ]) {
    const page = await browser.newPage({ viewport: viewport });
    const errors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('response', (response) => {
      if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
    });
    await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    const height = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < height; y += viewport.height * 0.7) {
      await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
      await page.waitForTimeout(140);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${out}/${name}-${label}.png`, fullPage: true });
    console.log(`${name} ${label}: ${errors.length ? errors.join(' | ') : 'no console errors'}`);
    await page.close();
  }
}

await browser.close();
