import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'src', 'assets', 'images');
await mkdir(outDir, { recursive: true });

const grain = async (width, height, alpha = 12) => {
  const pixels = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i += 1) {
    const value = 118 + Math.round((Math.random() * 2 - 1) * 48);
    pixels[i * 4] = value;
    pixels[i * 4 + 1] = value;
    pixels[i * 4 + 2] = value;
    pixels[i * 4 + 3] = alpha;
  }
  return { input: pixels, raw: { width, height, channels: 4 }, blend: 'overlay' };
};

const render = async ({ name, width, height, svg, alpha = 12 }) => {
  const image = sharp(Buffer.from(svg))
    .composite([await grain(width, height, alpha)])
    .jpeg({ quality: 91, chromaSubsampling: '4:4:4', mozjpeg: true });
  await image.toFile(path.join(outDir, `${name}.jpg`));
  console.log(`created ${name}.jpg`);
};

const hero = `
<svg xmlns="http://www.w3.org/2000/svg" width="2400" height="1600" viewBox="0 0 2400 1600">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#08100c"/>
      <stop offset=".48" stop-color="#102018"/>
      <stop offset="1" stop-color="#1d2d22"/>
    </linearGradient>
    <radialGradient id="glow" cx=".73" cy=".29" r=".68">
      <stop offset="0" stop-color="#f4b978" stop-opacity=".48"/>
      <stop offset=".38" stop-color="#c3693b" stop-opacity=".2"/>
      <stop offset="1" stop-color="#08100c" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffe0b4" stop-opacity=".68"/>
      <stop offset=".42" stop-color="#d78b4e" stop-opacity=".38"/>
      <stop offset="1" stop-color="#562f20" stop-opacity=".1"/>
    </linearGradient>
    <linearGradient id="glassTwo" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f4c994" stop-opacity=".34"/>
      <stop offset="1" stop-color="#7b432c" stop-opacity=".06"/>
    </linearGradient>
    <radialGradient id="sun" cx=".5" cy=".5" r=".5">
      <stop offset="0" stop-color="#ffe1b2" stop-opacity=".8"/>
      <stop offset=".55" stop-color="#f2b677" stop-opacity=".22"/>
      <stop offset="1" stop-color="#f2b677" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#07100b" stop-opacity="0"/>
      <stop offset="1" stop-color="#050c08" stop-opacity=".96"/>
    </linearGradient>
    <linearGradient id="beam" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffe2b6" stop-opacity=".1"/>
      <stop offset="1" stop-color="#ffe2b6" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="vignette" cx=".5" cy=".48" r=".75">
      <stop offset=".45" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity=".55"/>
    </radialGradient>
  </defs>

  <rect width="2400" height="1600" fill="url(#bg)"/>
  <rect width="2400" height="1600" fill="url(#glow)"/>

  <g opacity=".16" fill="none" stroke="#dfc9a3">
    <path d="M-420 1600V660A520 520 0 0 1 620 660v940" stroke-width="1.5"/>
    <path d="M-280 1600V690A380 380 0 0 1 480 690v910" stroke-width="1.5"/>
    <path d="M1140 1600V270" stroke-width="1"/>
    <path d="M1100 1600V270" stroke-width="1"/>
  </g>

  <g>
    <path d="M1270 1600V760a190 190 0 0 1 380 0v840Z" fill="url(#glass)" stroke="#e7c79b" stroke-opacity=".19" stroke-width="2"/>
    <path d="M1310 1600V775a150 150 0 0 1 300 0v825Z" fill="none" stroke="#1a2a20" stroke-opacity=".45" stroke-width="12"/>
    <path d="M1330 1600V780a130 130 0 0 1 260 0v820Z" fill="none" stroke="#f7d6a8" stroke-opacity=".13" stroke-width="1.5"/>
    <line x1="1460" y1="600" x2="1460" y2="1600" stroke="#132218" stroke-opacity=".48" stroke-width="13"/>
    <line x1="1370" y1="630" x2="1370" y2="1600" stroke="#132218" stroke-opacity=".26" stroke-width="4"/>
    <line x1="1550" y1="630" x2="1550" y2="1600" stroke="#132218" stroke-opacity=".26" stroke-width="4"/>
    <line x1="1270" y1="1010" x2="1650" y2="1010" stroke="#132218" stroke-opacity=".35" stroke-width="10"/>
  </g>

  <g>
    <path d="M1715 1600V740a190 190 0 0 1 380 0v860Z" fill="url(#glassTwo)" stroke="#e7c79b" stroke-opacity=".14" stroke-width="2"/>
    <path d="M1755 1600V755a150 150 0 0 1 300 0v845Z" fill="none" stroke="#15251b" stroke-opacity=".44" stroke-width="12"/>
    <line x1="1905" y1="580" x2="1905" y2="1600" stroke="#132218" stroke-opacity=".45" stroke-width="13"/>
    <line x1="1815" y1="620" x2="1815" y2="1600" stroke="#132218" stroke-opacity=".24" stroke-width="4"/>
    <line x1="1995" y1="620" x2="1995" y2="1600" stroke="#132218" stroke-opacity=".24" stroke-width="4"/>
    <line x1="1715" y1="1010" x2="2095" y2="1010" stroke="#132218" stroke-opacity=".32" stroke-width="10"/>
  </g>

  <g>
    <path d="M2160 1600V795a165 165 0 0 1 330 0v805Z" fill="url(#glassTwo)" stroke="#e7c79b" stroke-opacity=".09" stroke-width="2"/>
    <line x1="2325" y1="650" x2="2325" y2="1600" stroke="#132218" stroke-opacity=".4" stroke-width="12"/>
    <line x1="2160" y1="1030" x2="2490" y2="1030" stroke="#132218" stroke-opacity=".28" stroke-width="10"/>
  </g>

  <circle cx="1900" cy="560" r="430" fill="url(#sun)"/>

  <path d="M1010 1600 1820 0h300L1580 1600Z" fill="url(#beam)"/>
  <path d="M2040 0 1550 1600h50L2090 0Z" fill="#ffe1b6" opacity=".045"/>

  <g opacity=".5">
    <path d="M1640 1600V1450c0-14 10-24 24-24h860v174Z" fill="#0c1711" opacity=".3"/>
    <line x1="1200" y1="1418" x2="2400" y2="1418" stroke="#e8cba0" stroke-opacity=".08"/>
    <line x1="1150" y1="1470" x2="2400" y2="1470" stroke="#e8cba0" stroke-opacity=".06"/>
    <line x1="1100" y1="1524" x2="2400" y2="1524" stroke="#e8cba0" stroke-opacity=".04"/>
  </g>

  <rect y="1020" width="2400" height="580" fill="url(#floor)"/>
  <rect width="2400" height="1600" fill="url(#vignette)"/>
</svg>`;

const who = `
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1200" viewBox="0 0 1600 1200">
  <defs>
    <linearGradient id="paper" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f3e9d7"/>
      <stop offset=".6" stop-color="#ead9bd"/>
      <stop offset="1" stop-color="#dfc7a2"/>
    </linearGradient>
    <radialGradient id="sun" cx=".5" cy=".5" r=".5">
      <stop offset="0" stop-color="#fff0cd"/>
      <stop offset=".5" stop-color="#e8a263"/>
      <stop offset="1" stop-color="#ca7243" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f7d7a4"/>
      <stop offset=".55" stop-color="#d99058"/>
      <stop offset="1" stop-color="#8f4b32"/>
    </linearGradient>
    <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#b86b45"/>
      <stop offset="1" stop-color="#783f2c"/>
    </linearGradient>
    <linearGradient id="beam" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fff3d7" stop-opacity=".42"/>
      <stop offset="1" stop-color="#fff3d7" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <rect width="1600" height="1200" fill="url(#paper)"/>
  <circle cx="1030" cy="430" r="505" fill="url(#sun)"/>

  <g opacity=".22" fill="none" stroke="#30473a">
    <path d="M90 1140V440a290 290 0 0 1 580 0v700" stroke-width="1.5"/>
    <path d="M150 1140V455a230 230 0 0 1 460 0v685" stroke-width="1.5"/>
    <path d="M1380 1140V330" stroke-width="1"/>
    <path d="M1420 1140V330" stroke-width="1"/>
  </g>

  <path d="M590 1140V480a370 370 0 0 1 740 0v660Z" fill="#25392d"/>
  <path d="M628 1140V490a332 332 0 0 1 664 0v650Z" fill="url(#sky)"/>
  <path d="M628 1140V490a332 332 0 0 1 664 0v650Z" fill="none" stroke="#f1d2a3" stroke-opacity=".4" stroke-width="2"/>
  <line x1="960" y1="220" x2="960" y2="1140" stroke="#303f31" stroke-opacity=".42" stroke-width="16"/>
  <line x1="780" y1="330" x2="780" y2="1140" stroke="#303f31" stroke-opacity=".2" stroke-width="5"/>
  <line x1="1140" y1="330" x2="1140" y2="1140" stroke="#303f31" stroke-opacity=".2" stroke-width="5"/>
  <line x1="628" y1="810" x2="1292" y2="810" stroke="#303f31" stroke-opacity=".3" stroke-width="12"/>

  <path d="M590 1140V480a370 370 0 0 1 740 0v660Z" fill="none" stroke="#e3c291" stroke-opacity=".48" stroke-width="4"/>
  <path d="M548 1200V1140h570v60Z" fill="url(#floor)"/>
  <path d="M0 1140h1600v60H0Z" fill="#243a2e"/>
  <path d="M0 1080c380-70 730-70 1080 0s420 55 520 20v100H0Z" fill="#c2744c" opacity=".22"/>

  <path d="M0 0h1600v1200H0Z" fill="url(#beam)" opacity=".18"/>
  <path d="M1120 200 700 1140h130L1300 200Z" fill="#fff1d4" opacity=".06"/>
</svg>`;

const library = `
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1200" viewBox="0 0 1600 1200">
  <defs>
    <linearGradient id="wall" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#e9dfcc"/>
      <stop offset="1" stop-color="#d9c7a9"/>
    </linearGradient>
    <linearGradient id="niche" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#b98250"/>
      <stop offset=".55" stop-color="#8f593a"/>
      <stop offset="1" stop-color="#4d3428"/>
    </linearGradient>
    <linearGradient id="light" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fff2d4" stop-opacity=".4"/>
      <stop offset="1" stop-color="#fff2d4" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="shelf" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f1ddba"/>
      <stop offset="1" stop-color="#c49869"/>
    </linearGradient>
    <linearGradient id="table" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#314938"/>
      <stop offset="1" stop-color="#16271d"/>
    </linearGradient>
  </defs>

  <rect width="1600" height="1200" fill="url(#wall)"/>
  <path d="M210 1200V410a470 470 0 0 1 940 0v790Z" fill="#2a3f31"/>
  <path d="M250 1200V420a430 430 0 0 1 860 0v780Z" fill="url(#niche)"/>
  <path d="M250 1200V420a430 430 0 0 1 860 0v780Z" fill="none" stroke="#efd7b0" stroke-opacity=".3" stroke-width="3"/>

  <g fill="url(#shelf)">
    <rect x="300" y="470" width="760" height="10" rx="3"/>
    <rect x="300" y="680" width="760" height="10" rx="3"/>
    <rect x="300" y="890" width="760" height="10" rx="3"/>
    <rect x="300" y="1100" width="760" height="10" rx="3"/>
  </g>

  <g>
    <rect x="345" y="350" width="45" height="120" rx="4" fill="#203228"/>
    <rect x="397" y="328" width="34" height="142" rx="4" fill="#b65634"/>
    <rect x="438" y="365" width="56" height="105" rx="4" fill="#d4af79"/>
    <rect x="502" y="300" width="42" height="170" rx="4" fill="#798c78"/>
    <rect x="551" y="355" width="30" height="115" rx="4" fill="#e7d4b2"/>
    <rect x="588" y="320" width="49" height="150" rx="4" fill="#8d4a31"/>
    <rect x="644" y="370" width="37" height="100" rx="4" fill="#243a2e"/>
    <rect x="688" y="340" width="52" height="130" rx="4" fill="#c9955f"/>
    <rect x="747" y="300" width="38" height="170" rx="4" fill="#e3d3b7"/>
    <rect x="792" y="362" width="60" height="108" rx="4" fill="#5f735f"/>
    <rect x="859" y="330" width="36" height="140" rx="4" fill="#a94f31"/>
    <rect x="902" y="375" width="48" height="95" rx="4" fill="#2b4535"/>
    <rect x="957" y="320" width="42" height="150" rx="4" fill="#d8b57f"/>
  </g>
  <g transform="translate(0 210)">
    <rect x="345" y="350" width="45" height="120" rx="4" fill="#2b4535"/>
    <rect x="397" y="328" width="34" height="142" rx="4" fill="#d4af79"/>
    <rect x="438" y="365" width="56" height="105" rx="4" fill="#8d4a31"/>
    <rect x="502" y="300" width="42" height="170" rx="4" fill="#e7d4b2"/>
    <rect x="551" y="355" width="30" height="115" rx="4" fill="#617663"/>
    <rect x="588" y="320" width="49" height="150" rx="4" fill="#c9955f"/>
    <rect x="644" y="370" width="37" height="100" rx="4" fill="#203228"/>
    <rect x="688" y="340" width="52" height="130" rx="4" fill="#b65634"/>
    <rect x="747" y="300" width="38" height="170" rx="4" fill="#758a76"/>
    <rect x="792" y="362" width="60" height="108" rx="4" fill="#e3d3b7"/>
    <rect x="859" y="330" width="36" height="140" rx="4" fill="#5f735f"/>
    <rect x="902" y="375" width="48" height="95" rx="4" fill="#c9955f"/>
    <rect x="957" y="320" width="42" height="150" rx="4" fill="#2b4535"/>
  </g>
  <g transform="translate(0 420)">
    <rect x="345" y="350" width="45" height="120" rx="4" fill="#d8b57f"/>
    <rect x="397" y="328" width="34" height="142" rx="4" fill="#2b4535"/>
    <rect x="438" y="365" width="56" height="105" rx="4" fill="#a94f31"/>
    <rect x="502" y="300" width="42" height="170" rx="4" fill="#e7d4b2"/>
    <rect x="551" y="355" width="30" height="115" rx="4" fill="#8d4a31"/>
    <rect x="588" y="320" width="49" height="150" rx="4" fill="#617663"/>
    <rect x="644" y="370" width="37" height="100" rx="4" fill="#c9955f"/>
    <rect x="688" y="340" width="52" height="130" rx="4" fill="#203228"/>
    <rect x="747" y="300" width="38" height="170" rx="4" fill="#b65634"/>
    <rect x="792" y="362" width="60" height="108" rx="4" fill="#d4af79"/>
    <rect x="859" y="330" width="36" height="140" rx="4" fill="#2b4535"/>
    <rect x="902" y="375" width="48" height="95" rx="4" fill="#e3d3b7"/>
    <rect x="957" y="320" width="42" height="150" rx="4" fill="#798c78"/>
  </g>
  <g transform="translate(0 630)">
    <rect x="345" y="350" width="45" height="120" rx="4" fill="#5f735f"/>
    <rect x="397" y="328" width="34" height="142" rx="4" fill="#e7d4b2"/>
    <rect x="438" y="365" width="56" height="105" rx="4" fill="#203228"/>
    <rect x="502" y="300" width="42" height="170" rx="4" fill="#c9955f"/>
    <rect x="551" y="355" width="30" height="115" rx="4" fill="#a94f31"/>
    <rect x="588" y="320" width="49" height="150" rx="4" fill="#e3d3b7"/>
    <rect x="644" y="370" width="37" height="100" rx="4" fill="#2b4535"/>
    <rect x="688" y="340" width="52" height="130" rx="4" fill="#d4af79"/>
    <rect x="747" y="300" width="38" height="170" rx="4" fill="#8d4a31"/>
    <rect x="792" y="362" width="60" height="108" rx="4" fill="#e7d4b2"/>
    <rect x="859" y="330" width="36" height="140" rx="4" fill="#617663"/>
    <rect x="902" y="375" width="48" height="95" rx="4" fill="#b65634"/>
    <rect x="957" y="320" width="42" height="150" rx="4" fill="#203228"/>
  </g>

  <path d="M160 1200V0h300c-90 330-90 780 0 1200Z" fill="url(#light)" opacity=".5"/>
  <path d="M0 1040h1600v160H0Z" fill="url(#table)"/>
  <path d="M0 1040h1600v10H0Z" fill="#d2ae79" opacity=".5"/>
  <g transform="translate(880 970) rotate(-4)">
    <path d="M0 30c80-48 160-48 240 0v90c-80-35-160-35-240 0Z" fill="#e8d8ba"/>
    <path d="M240 30c80-48 160-48 240 0v90c-80-35-160-35-240 0Z" fill="#f2e4c8"/>
    <path d="M240 30v90" stroke="#a98254" stroke-width="2" opacity=".5"/>
  </g>
</svg>`;

const worship = `
<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="1200" viewBox="0 0 1800 1200">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0a130e"/>
      <stop offset=".55" stop-color="#14261c"/>
      <stop offset="1" stop-color="#233326"/>
    </linearGradient>
    <radialGradient id="glow" cx=".52" cy=".42" r=".5">
      <stop offset="0" stop-color="#ffd9a1" stop-opacity=".55"/>
      <stop offset=".5" stop-color="#d0834c" stop-opacity=".18"/>
      <stop offset="1" stop-color="#0a130e" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="page" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f7ecd6"/>
      <stop offset="1" stop-color="#d8bd93"/>
    </linearGradient>
    <linearGradient id="pageShade" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fff7e8"/>
      <stop offset="1" stop-color="#c5a575"/>
    </linearGradient>
    <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffe1b2" stop-opacity=".26"/>
      <stop offset="1" stop-color="#ffe1b2" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="vig" cx=".5" cy=".48" r=".78">
      <stop offset=".48" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity=".5"/>
    </radialGradient>
  </defs>
  <rect width="1800" height="1200" fill="url(#bg)"/>
  <rect width="1800" height="1200" fill="url(#glow)"/>
  <path d="M380 1200V490a520 520 0 0 1 1040 0v710Z" fill="none" stroke="#dfc59a" stroke-opacity=".14" stroke-width="2"/>
  <path d="M440 1200V510a460 460 0 0 1 920 0v690Z" fill="none" stroke="#dfc59a" stroke-opacity=".08" stroke-width="1.5"/>
  <path d="M900 170 690 1200h120l270-970Z" fill="url(#beam)"/>
  <path d="M1080 180 930 1200h40l190-1010Z" fill="#ffe6c0" opacity=".05"/>
  <g opacity=".3">
    <line x1="120" y1="260" x2="120" y2="1200" stroke="#dcc49b" stroke-width="1"/>
    <line x1="168" y1="310" x2="168" y2="1200" stroke="#dcc49b" stroke-width="1"/>
    <line x1="1640" y1="200" x2="1640" y2="1200" stroke="#dcc49b" stroke-width="1"/>
  </g>
  <g transform="translate(410 910)">
    <path d="M0 70c135-95 320-110 490-20v170c-170-78-355-64-490 20Z" fill="url(#page)"/>
    <path d="M490 50c170-90 355-75 490 20v170c-135-84-320-98-490-20Z" fill="url(#pageShade)"/>
    <path d="M490 50v170" stroke="#8a653e" stroke-width="3" opacity=".55"/>
    <g stroke="#69513a" stroke-width="2" opacity=".3">
      <path d="M80 150c120-48 250-52 360-8"/>
      <path d="M80 188c120-48 250-52 360-8"/>
      <path d="M80 226c120-48 250-52 360-8"/>
      <path d="M545 130c110-30 230-24 345 16"/>
      <path d="M545 168c110-30 230-24 345 16"/>
      <path d="M545 206c110-30 230-24 345 16"/>
    </g>
    <path d="M490 50c-130-70-295-80-490-10v30c190-65 350-55 490 10Z" fill="#f9efd9" opacity=".35"/>
  </g>
  <rect y="1080" width="1800" height="120" fill="#0b1510" opacity=".8"/>
  <rect width="1800" height="1200" fill="url(#vig)"/>
</svg>`;

await render({ name: 'hero-placeholder', width: 2400, height: 1600, svg: hero, alpha: 13 });
await render({ name: 'who-we-are-placeholder', width: 1600, height: 1200, svg: who, alpha: 14 });
await render({ name: 'library-placeholder', width: 1600, height: 1200, svg: library, alpha: 14 });
await render({ name: 'worship-placeholder', width: 1800, height: 1200, svg: worship, alpha: 13 });
