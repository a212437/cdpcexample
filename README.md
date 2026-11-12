# CDPC Puchong website

The website of City Discipleship Presbyterian Church (CDPC Puchong): a fully static,
responsive site built with Astro, Tailwind CSS and self-hosted fonts. It has no database,
CMS, form backend or client-side framework.

## Stack

- Astro 5 static site generation
- Tailwind CSS 4 through the Vite plugin
- Fraunces and Instrument Sans, self-hosted in `public/fonts`
- Astro content collections for sermons and JSON for page copy
- Astro Assets for responsive AVIF/WebP/JPG images
- Minimal vanilla JavaScript for the mobile menu, reveals, parallax and active navigation
- No analytics, tracking, iframes or third-party runtime assets

## Local development

Node 20.19+ or 22 LTS is recommended. The project is verified with Node 20.15.1 using the
pinned development dependencies in `package-lock.json`.

```bash
npm install
npm run dev
```

The development server runs at `http://localhost:4321/cdpcexample/`. The `/cdpcexample/`
path is the GitHub Pages project base configured in `astro.config.mjs`.

### Useful commands

```bash
npm run check     # Astro + TypeScript diagnostics
npm run build     # static production build in dist/
npm run preview   # serve the built site at http://127.0.0.1:4321/cdpcexample/
npm run art       # regenerate the abstract artwork in src/assets/images
npm run og        # regenerate public/og.jpg
npm run audit     # multi-viewport QA against a running preview
npm run shots     # screenshots of selected routes against a running preview
```

`npm run og`, `npm run audit` and `npm run shots` use `playwright-core` with the installed
Google Chrome. Set `CHROME_PATH` if Chrome is elsewhere. The target URL defaults to
`http://127.0.0.1:4321/cdpcexample`; set `SITE_URL` to audit another deployment, including its
base path when applicable. `npm run shots` accepts
routes, for example `npm run shots -- / /contact /events`. Screenshots are written to
`SHOT_DIR` or the system temp directory under `cdpc-shots`.

`npm run og` needs the preview server running so it can load the self-hosted fonts. It writes
`public/og.jpg`, so run `npm run build` afterwards to copy the image into `dist/`.

The audit and screenshot scripts are development tools only. Chrome must be installed.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Home: welcome, service details, teaching, events, beliefs, library and location |
| `/about` | Who we are |
| `/leadership` | Pastor, elders and deacons |
| `/beliefs` | Five beliefs, Bible statement, Apostles' Creed and creed links |
| `/worship` | Worship, Word, prayer and sacraments, with placeholders where details are unconfirmed |
| `/sermons` | Sermon listing |
| `/sermons/[slug]` | Sermon detail generated from Markdown |
| `/events` | Weekly rhythm and a build-time current-month calendar |
| `/visit` | Plan a first visit, practical details and FAQs |
| `/where-we-gather` | Address, directions, illustrated map and travel links |
| `/childrens-library` | Library collection, Story Time and borrowing details |
| `/news` | Honest empty state until a notices workflow is confirmed |
| `/contact` | WhatsApp, address and service details |
| `/404` | Custom not-found page |

## Editing content

Most text is plain JSON, so no Astro knowledge is needed for routine edits.

- `src/content/site.json` — church name, service time, address, WhatsApp link, core wording
- `src/content/visit.json` — first-visit steps, practical details, FAQs and placeholders
- `src/content/beliefs.json` — five beliefs, Bible statement, Apostles' Creed and external links
- `src/content/events.json` — weekly service, special events and calendar note
- `src/content/worship.json` — worship page copy
- `src/content/library.json` — Children's Library copy
- `src/content/leadership.json` — pastor, elders, deacons and portrait note
- `src/content/news.json` — empty-state copy
- `src/content/sermons/*.md` — sermon entries

Content with unknown details is intentionally marked “Being confirmed” rather than guessed.
When a detail is confirmed, update the relevant JSON and remove the matching note where
appropriate. Search for `TODO` and `being confirmed` before publishing.

### Adding a sermon

Create a Markdown file in `src/content/sermons/`:

```md
---
title: "Sermon title"
speaker: "Speaker name"
date: 2026-11-01
scripture: "Bible reference" # optional
summary: "Short summary" # optional
audioUrl: "https://..." # optional; a listen button appears automatically
videoUrl: "https://..." # optional; a watch button appears automatically
---

Sermon notes or transcript go here.
```

The filename becomes the route slug. Delete `audioUrl`/`videoUrl` until a real recording is
available; the site never invents or links to an empty recording.

## Design and assets

The visual system is defined in `src/styles/global.css`:

- Warm paper, pine, terracotta, ochre and sage palette
- Light and dark themes via `prefers-color-scheme`
- Reduced-motion support
- Self-hosted fonts and no external font requests
- Decorative arch motifs drawn in SVG/CSS

The congregation and building images are deliberately abstract generated artwork, not stock
photos presented as the church. Replace them in `src/assets/images/` with approved photography
when available; keep meaningful alt text and preserve the aspect ratios or update the layout.

The social sharing image is `public/og.jpg` at 1200 × 630. The favicon and app icons live in
`public/`.

## Quality checks

Last verified locally with:

- `npm run check` — 0 errors, 0 warnings
- `npm run build` — 15 pages generated
- `npm run audit` — no page-level horizontal overflow, no runtime errors, no broken internal
  links across 15 routes and four viewports (360, 768, 1024 and 1440px)
- Lighthouse accessibility — 100 on all 15 routes (light theme, local preview)
- Lighthouse home page — 93 performance, 100 accessibility, 100 best practices, 100 SEO
  (mobile simulation against the local preview)
- Mobile menu — opens and scrolls at 360 × 640, Escape closes it, focus returns to the toggle
- About dropdown — keyboard focus reaches the submenu
- Visit FAQs — keyboard-operable native `<details>` elements

Performance varies by host, network and device. The local preview score is a baseline, not a
production guarantee. The strongest remaining LCP factor is the large hero image; serve the
static build from a host with HTTP/2/3, compression and a CDN.

## Deployment

The site deploys automatically to GitHub Pages on every push to `main` through
`.github/workflows/deploy.yml`.

- Public URL: `https://a212437.github.io/cdpcexample/`
- Repository: `https://github.com/a212437/cdpcexample`
- Build command: `npm run build`
- Output directory: `dist`
- Node version: 22 LTS in CI

The matching Astro configuration is:

```js
site: 'https://a212437.github.io',
base: '/cdpcexample',
```

`src/lib/paths.ts` prefixes internal links with the base path. Vite applies the same base to
generated assets and font URLs. The GitHub Actions workflow uses the official Pages actions
and can enable Pages for the repository on its first run.

If the church later uses a custom domain at the root of the domain, set `site` to that domain
and change `base` to `/`; update the sitemap URL in `public/robots.txt` at the same time. For a
different static host, keep `base` only if the site is served from a subdirectory.

GitHub Pages serves `dist/404.html` for missing pages. Verify the deployed WhatsApp link, the
Google Maps/Waze links, canonical URLs and the sitemap after each domain change.

There is no server-side code, environment variable or secrets file required.

## Open items to confirm with the church

- Exact unit/address: supplied copy says “7th Floor, IOI Boulevard, Unit B, 01”; the old
  website footer listed “B-7-1, IOI Boulevard”. Confirm before launch.
- Sunday service length, language, music style, order of service and response time.
- Parking, dress, arrival route from the lift lobby, greeters and follow-up.
- Step-free access, lift and accessibility details.
- Children's programme, check-in, Story Time day/time/age grouping/format, library opening
  hours, borrowing process and library location within the venue.
- Special event dates, shared meals and church-wide gatherings.
- Approved leadership portraits and short bios.
- Scripture, summaries, notes and audio/video links for each sermon.
- A simple notices workflow for `/news`.
- Whether to keep the homepage “Watch Latest Sermon” label once media is available; it
  currently links to the latest sermon page, which shows a recording placeholder if no media
  URL exists.
- Social profiles, if any, and whether to use a custom domain instead of the GitHub Pages URL.

## Known limitations

- The events calendar is generated from the current month at build time. It will become stale
  until the site is rebuilt; see `src/pages/events.astro` and `src/content/events.json` if a
  maintained events source is added.
- There is no contact form, CMS, newsletter, payments or booking system. Contact is via the
  supplied WhatsApp link.
- `/news` intentionally does not display invented or stale notices.
- `npm audit` reports advisories in the Astro 5 build toolchain that are only resolved by the
  Astro 7 major upgrade. This site is fully static, uses no server islands or hydrated islands,
  and only processes repository-owned images. Review the framework upgrade before adding SSR,
  user-uploaded media or other untrusted input.

## Project layout

```text
.github/workflows/       GitHub Pages deployment
public/                  fonts, favicon, icons, manifest, robots, og.jpg
scripts/                 artwork, OG image, screenshots and audit tools
src/assets/images/       generated artwork
src/components/          reusable Astro components
src/content/             JSON copy and Markdown sermons
src/layouts/             shared HTML shell and SEO/JSON-LD
src/lib/                 base-path helpers
src/pages/               routes
src/scripts/             small progressive-enhancement scripts
src/styles/global.css    design tokens and all page styles
dist/                    generated production output (ignored by git)
```

The old site at `C:\Users\User\cdpc-puchong` was preserved and not modified.
