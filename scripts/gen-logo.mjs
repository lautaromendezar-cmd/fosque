// Convierte contours.json en:
//  - components/logo/paths.ts  (paths d + viewBox del iso y wordmark)
//  - app/icon.png              (favicon 512, iso en negro de marca)
//  - overlay de verificación   (vector rojo al 50% sobre el raster original)
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const OUT = path.join(process.cwd(), 'scripts', 'tmp');
const contours = JSON.parse(fs.readFileSync(path.join(OUT, 'contours.json'), 'utf8'));

const ISO_IDX = [2, 4, 5];
const WORD_IDX = [6, 8, 12, 9, 10, 13, 11, 7];

const buildPath = (idxs) => {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const i of idxs) {
    const [x0, y0, x1, y1] = contours[i].bbox;
    minX = Math.min(minX, x0);
    minY = Math.min(minY, y0);
    maxX = Math.max(maxX, x1);
    maxY = Math.max(maxY, y1);
  }
  const d = idxs
    .map((i) => {
      const pts = contours[i].points.map(
        ([x, y]) => `${(x - minX).toFixed(1)} ${(y - minY).toFixed(1)}`,
      );
      return `M${pts.join('L')}Z`;
    })
    .join('');
  return { d, w: Math.ceil(maxX - minX), h: Math.ceil(maxY - minY), minX, minY };
};

const iso = buildPath(ISO_IDX);
const word = buildPath(WORD_IDX);

fs.mkdirSync(path.join(process.cwd(), 'components', 'logo'), { recursive: true });
fs.writeFileSync(
  path.join(process.cwd(), 'components', 'logo', 'paths.ts'),
  `/**
 * Paths del logo oficial FOSQUE, vectorizados desde la tapa del manual de
 * marca (contour tracing sobre el render 4x del PDF). Generado por
 * scripts/gen-logo.mjs — no editar a mano.
 */
export const ISO_VB = '0 0 ${iso.w} ${iso.h}';
export const ISO_D = '${iso.d}';
export const WORD_VB = '0 0 ${word.w} ${word.h}';
export const WORD_D = '${word.d}';
`,
);
console.log(`iso ${iso.w}x${iso.h} (${(iso.d.length / 1024).toFixed(1)}KB) · word ${word.w}x${word.h} (${(word.d.length / 1024).toFixed(1)}KB)`);

// ---- verificación overlay + favicon ----
const b64 = fs.readFileSync(path.join(OUT, 'tapa.png')).toString('base64');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 700 } });

await page.setContent(`
  <style>body{margin:0;background:#fff}.stack{position:relative;width:1400px}
  .stack img,.stack svg{position:absolute;top:0;left:0;width:1400px}</style>
  <div class="stack">
    <img src="data:image/png;base64,${b64}">
    <svg viewBox="0 0 3367 2381">
      <path transform="translate(${iso.minX} ${iso.minY})" d="${iso.d}" fill="red" fill-opacity="0.5" fill-rule="evenodd"/>
      <path transform="translate(${word.minX} ${word.minY})" d="${word.d}" fill="red" fill-opacity="0.5" fill-rule="evenodd"/>
    </svg>
  </div>`);
await page.waitForTimeout(400);
await page.screenshot({ path: path.join(OUT, 'overlay.png') });

// favicon 512x512: iso centrado con padding, negro de marca
const pad = 60;
const scale = (512 - pad * 2) / Math.max(iso.w, iso.h);
await page.setContent(`
  <style>body{margin:0}</style>
  <svg id="icon" width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(${(512 - iso.w * scale) / 2} ${(512 - iso.h * scale) / 2}) scale(${scale})">
      <path d="${iso.d}" fill="#1A1815" fill-rule="evenodd"/>
    </g>
  </svg>`);
const el = await page.$('#icon');
await el.screenshot({ path: path.join(process.cwd(), 'app', 'icon.png'), omitBackground: true });
console.log('app/icon.png generado');
await browser.close();
