import { chromium } from 'playwright-core';

const base = (process.env.SITE_URL ?? 'http://127.0.0.1:4321').replace(/\/$/, '');
const executablePath =
  process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const routes = [
  '/',
  '/about',
  '/leadership',
  '/beliefs',
  '/worship',
  '/sermons',
  '/sermons/all-of-life-for-god',
  '/sermons/with-christ-in-the-storm',
  '/events',
  '/visit',
  '/where-we-gather',
  '/childrens-library',
  '/news',
  '/contact',
  '/404',
];
const viewports = [
  { label: '360', width: 360, height: 800 },
  { label: '768', width: 768, height: 900 },
  { label: '1024', width: 1024, height: 900 },
  { label: '1440', width: 1440, height: 1000 },
];

const browser = await chromium.launch({
  executablePath,
  headless: true,
});

const report = [];
for (const viewport of viewports) {
  const context = await browser.newContext({ viewport });
  for (const route of routes) {
    const page = await context.newPage();
    const errors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('response', (response) => {
      if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
    });

    const response = await page.goto(`${base}${route}`, { waitUntil: 'load' });
    await page.waitForTimeout(250);
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < height; y += viewport.height) {
      await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
      await page.waitForTimeout(40);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(150);

    const data = await page.evaluate(() => {
      const visible = (el) => {
        const style = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return (
          style.display !== 'none' &&
          style.visibility !== 'hidden' &&
          Number(style.opacity) !== 0 &&
          rect.width > 0 &&
          rect.height > 0
        );
      };
      const label = (el) => {
        const cls = typeof el.className === 'string' ? el.className.trim().split(/\s+/).slice(0, 3).join('.') : '';
        return `${el.tagName.toLowerCase()}${cls ? `.${cls}` : ''}`;
      };
      const overflowing = [...document.querySelectorAll('body *')]
        .filter(visible)
        .filter((el) => {
          const rect = el.getBoundingClientRect();
          return rect.right > window.innerWidth + 1 || rect.left < -1;
        })
        .slice(0, 8)
        .map((el) => {
          const rect = el.getBoundingClientRect();
          return `${label(el)} [${Math.round(rect.left)}..${Math.round(rect.right)}]`;
        });
      const brokenImages = [...document.images]
        .filter((img) => img.complete && img.naturalWidth === 0)
        .map((img) => img.currentSrc || img.src);
      const smallTargets = [...document.querySelectorAll('a[href], button, summary')]
        .filter(visible)
        .map((el) => ({ el, rect: el.getBoundingClientRect() }))
        .filter(({ rect }) => rect.width < 40 || rect.height < 40)
        .slice(0, 10)
        .map(({ el, rect }) => `${label(el)} ${Math.round(rect.width)}x${Math.round(rect.height)}`);
      return {
        h1: [...document.querySelectorAll('h1')].map((el) => el.textContent.trim()),
        docWidth: document.documentElement.scrollWidth,
        viewWidth: window.innerWidth,
        overflowing,
        brokenImages,
        smallTargets,
        title: document.title,
        mainHeight: Math.round(document.querySelector('main')?.getBoundingClientRect().height ?? 0),
      };
    });

    report.push({
      viewport: viewport.label,
      route,
      status: response?.status(),
      ...data,
      errors,
    });
    await page.close();
  }
  await context.close();
}

const internal = new Set();
for (const route of routes.slice(0, -1)) {
  const page = await browser.newPage();
  await page.goto(`${base}${route}`, { waitUntil: 'domcontentloaded' });
  const hrefs = await page.evaluate(() =>
    [...document.querySelectorAll('a[href]')]
      .map((a) => a.getAttribute('href'))
      .filter((href) => href && href.startsWith('/')),
  );
  hrefs.forEach((href) => internal.add(href));
  await page.close();
}
const linkResults = [];
for (const href of [...internal].sort()) {
  const url = new URL(href, base).toString();
  if (url.startsWith(base)) {
    const res = await fetch(url);
    if (res.status >= 400) linkResults.push(`${res.status} ${url}`);
  }
}

console.log(
  JSON.stringify(
    {
      pages: report.map((entry) => ({
        ...entry,
        errors: [...new Set(entry.errors)],
      })),
      brokenInternalLinks: linkResults,
      checkedLinks: internal.size,
    },
    null,
    2,
  ),
);

await browser.close();
