import { chromium } from 'playwright-core';

const base = (process.env.SITE_URL ?? 'http://127.0.0.1:4321/cdpcexample').replace(/\/$/, '');
const executablePath =
  process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const browser = await chromium.launch({
  executablePath,
  headless: true,
});

const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto(`${base}/404`, { waitUntil: 'domcontentloaded' });

await page.setContent(
  `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <style>
        @font-face {
          font-family: "Fraunces Variable";
          src: url("${base}/fonts/fraunces-latin-var.woff2") format("woff2-variations");
          font-weight: 100 900;
          font-style: normal;
        }
        @font-face {
          font-family: "Fraunces Variable";
          src: url("${base}/fonts/fraunces-latin-italic-var.woff2") format("woff2-variations");
          font-weight: 100 900;
          font-style: italic;
        }
        @font-face {
          font-family: "Instrument Sans Variable";
          src: url("${base}/fonts/instrument-sans-latin-var.woff2") format("woff2-variations");
          font-weight: 400 700;
          font-style: normal;
        }
        * { box-sizing: border-box; }
        html, body { margin: 0; width: 1200px; height: 630px; }
        body {
          overflow: hidden;
          background: #14231b;
          color: #f7f1e6;
          font-family: "Instrument Sans Variable", sans-serif;
        }
        .stage {
          position: relative;
          width: 1200px;
          height: 630px;
          overflow: hidden;
          padding: 62px 76px 54px;
          isolation: isolate;
          background:
            radial-gradient(90% 120% at 100% 20%, rgba(213, 162, 96, 0.19), transparent 55%),
            radial-gradient(70% 100% at 85% 100%, rgba(162, 75, 43, 0.29), transparent 65%),
            #14231b;
        }
        .grain {
          position: absolute;
          inset: 0;
          z-index: -1;
          opacity: 0.18;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E");
        }
        .arches {
          position: absolute;
          right: -92px;
          bottom: -172px;
          width: 610px;
          height: 690px;
          color: #d5a260;
          opacity: 0.36;
        }
        .glow {
          position: absolute;
          right: 94px;
          bottom: 44px;
          width: 286px;
          height: 286px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(236, 180, 126, 0.34), rgba(236, 180, 126, 0) 68%);
        }
        .frame {
          position: absolute;
          inset: 24px;
          border: 1px solid rgba(247, 241, 230, 0.17);
          border-radius: 4px;
          pointer-events: none;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .brand svg {
          width: 34px;
          height: 41px;
          color: #ecb47e;
        }
        .brand__name {
          font-family: "Fraunces Variable", serif;
          font-size: 31px;
          font-weight: 460;
          letter-spacing: -0.035em;
          line-height: 1;
        }
        .brand__place {
          margin-top: 4px;
          color: rgba(247, 241, 230, 0.66);
          font-size: 9.5px;
          font-weight: 600;
          letter-spacing: 0.25em;
          line-height: 1;
          text-transform: uppercase;
        }
        .topline {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .topline__right {
          color: rgba(247, 241, 230, 0.62);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }
        .main {
          position: absolute;
          left: 76px;
          top: 178px;
          width: 955px;
        }
        .eyebrow {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #d6a267;
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
        }
        .eyebrow::before {
          width: 31px;
          height: 1px;
          background: currentColor;
          content: "";
        }
        h1 {
          margin: 21px 0 0;
          font-family: "Fraunces Variable", serif;
          font-size: 98px;
          font-weight: 380;
          letter-spacing: -0.055em;
          line-height: 0.93;
        }
        h1 em {
          color: #ecb47e;
          font-weight: 330;
        }
        .sub {
          margin: 25px 0 0;
          color: rgba(247, 241, 230, 0.72);
          font-size: 19px;
          font-weight: 400;
          letter-spacing: 0.005em;
        }
        .foot {
          position: absolute;
          left: 76px;
          right: 76px;
          bottom: 49px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          border-top: 1px solid rgba(247, 241, 230, 0.18);
          padding-top: 20px;
        }
        .foot__service {
          display: flex;
          align-items: baseline;
          gap: 18px;
          font-size: 15px;
        }
        .foot__label {
          color: #d6a267;
          font-size: 9.5px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        .foot__time {
          font-family: "Fraunces Variable", serif;
          font-size: 26px;
          letter-spacing: -0.025em;
        }
        .foot__address {
          color: rgba(247, 241, 230, 0.62);
          font-size: 12px;
          line-height: 1.6;
          text-align: right;
        }
      </style>
    </head>
    <body>
      <div class="stage">
        <div class="grain"></div>
        <div class="glow"></div>
        <svg class="arches" viewBox="0 0 620 700" fill="none" aria-hidden="true">
          <path d="M70 700V282a205 205 0 0 1 410 0v418" stroke="currentColor" stroke-width="1.6"/>
          <path d="M152 700V282a123 123 0 0 1 246 0v418" stroke="currentColor" stroke-width="1.1" opacity=".7"/>
          <path d="M234 700V282a41 41 0 0 1 82 0v418" stroke="currentColor" stroke-width=".9" opacity=".5"/>
          <circle cx="275" cy="254" r="6" fill="currentColor" opacity=".8"/>
        </svg>
        <div class="frame"></div>

        <div class="topline">
          <div class="brand">
            <svg viewBox="0 0 40 48" fill="none" aria-hidden="true">
              <path d="M5 46V22a15 15 0 0 1 30 0v24" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
              <path d="M13 46V22a7 7 0 0 1 14 0v24" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity=".55"/>
              <circle cx="20" cy="19" r="2.3" fill="currentColor"/>
            </svg>
            <div>
              <div class="brand__name">CDPC Puchong</div>
              <div class="brand__place">City Discipleship Presbyterian Church</div>
            </div>
          </div>
          <div class="topline__right">Puchong · Selangor</div>
        </div>

        <div class="main">
          <div class="eyebrow">A church in Puchong</div>
          <h1>Grace for the <em>weary.</em><br />Room for the seeking.</h1>
          <p class="sub">Christ-centred worship, Scripture-based preaching and grace-enabled spirituality.</p>
        </div>

        <div class="foot">
          <div class="foot__service">
            <span class="foot__label">Sundays</span>
            <span class="foot__time">9:00AM</span>
          </div>
          <div class="foot__address">
            7th Floor, IOI Boulevard, Unit B, 01<br />
            Bandar Puchong Jaya, Selangor
          </div>
        </div>
      </div>
    </body>
  </html>`,
  { waitUntil: 'networkidle' },
);

await page.evaluate(async () => {
  await document.fonts.ready;
  await Promise.all([
    document.fonts.load('380 98px "Fraunces Variable"'),
    document.fonts.load('italic 380 98px "Fraunces Variable"'),
    document.fonts.load('400 19px "Instrument Sans Variable"'),
  ]);
});
await page.waitForTimeout(300);

await page.screenshot({
  path: 'public/og.jpg',
  type: 'jpeg',
  quality: 92,
  clip: { x: 0, y: 0, width: 1200, height: 630 },
});

console.log('Wrote public/og.jpg');
await browser.close();
