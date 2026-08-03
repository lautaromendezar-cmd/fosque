// Genera app/opengraph-image.png (1200x630) para WhatsApp/redes:
// logo vectorizado + claim + tiles de fotos, con la paleta del manual.
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const P = (...s) => path.join(process.cwd(), ...s);
const b64 = (f) => fs.readFileSync(f).toString('base64');

const momo = b64(P('app', 'fonts', 'momo-trust-display-400.woff2'));

// paths.ts es TS puro con exports const string — lo leo con regex para no transpilar
const src = fs.readFileSync(P('components', 'logo', 'paths.ts'), 'utf8');
const grab = (name) => src.match(new RegExp(`${name} = '([^']+)'`))[1];
const isoD = grab('ISO_D');
const isoVB = grab('ISO_VB');
const wordD = grab('WORD_D');
const wordVB = grab('WORD_VB');

const img1 = b64(P('public', 'media', 'galeria-reformer.jpg'));
const img2 = b64(P('public', 'media', 'galeria-salida.jpg'));
const img3 = b64(P('public', 'media', 'equipo-4.jpg'));

const html = `<!doctype html><html><head><style>
@font-face{font-family:Momo;src:url(data:font/woff2;base64,${momo}) format('woff2')}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#F0E9D8;font-family:Momo,sans-serif;color:#1A1815;position:relative;overflow:hidden;display:flex}
.left{flex:1;padding:70px 0 70px 70px;display:flex;flex-direction:column;justify-content:space-between;position:relative;z-index:2}
.lockup{display:flex;align-items:center;gap:22px}
.claim{font-size:64px;line-height:1.02;letter-spacing:-0.02em;max-width:9ch}
.claim em{font-style:normal;color:#E8927C}
.bar{display:flex;gap:10px}
.bar i{display:block;width:64px;height:12px;border-radius:99px}
.tiles{width:430px;height:100%;position:relative;z-index:2;padding:46px 46px 46px 0;display:flex;flex-direction:column;gap:16px}
.tiles div{flex:1;border-radius:28px;background-size:cover;background-position:center;box-shadow:0 18px 40px rgba(26,24,21,.16)}
.rings{position:absolute;right:-140px;bottom:-140px;width:520px;height:520px;opacity:.5;z-index:1}
</style></head><body>
  <div class="left">
    <div class="lockup">
      <svg viewBox="${isoVB}" style="height:84px"><path d="${isoD}" fill="#1A1815" fill-rule="evenodd"/></svg>
      <svg viewBox="${wordVB}" style="height:36px"><path d="${wordD}" fill="#1A1815" fill-rule="evenodd"/></svg>
    </div>
    <div class="claim">Mejora<br>la <em>Vida</em>.</div>
    <div class="bar">
      <i style="background:#E8927C"></i><i style="background:#F2B778"></i>
      <i style="background:#93A48D"></i><i style="background:#BFD8DF"></i>
    </div>
  </div>
  <div class="tiles">
    <div style="background-image:url(data:image/jpeg;base64,${img1})"></div>
    <div style="background-image:url(data:image/jpeg;base64,${img2})"></div>
    <div style="background-image:url(data:image/jpeg;base64,${img3})"></div>
  </div>
  <svg class="rings" viewBox="0 0 220 220">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#F2B778"/><stop offset="1" stop-color="#E8927C"/>
    </linearGradient></defs>
    ${[30, 60, 90, 120, 150, 180].map((r) => `<circle cx="220" cy="220" r="${r}" fill="none" stroke="url(#g)" stroke-width="9"/>`).join('')}
  </svg>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html);
await page.waitForTimeout(600);
await page.screenshot({ path: P('app', 'opengraph-image.png') });
await browser.close();
const kb = (fs.statSync(P('app', 'opengraph-image.png')).size / 1024).toFixed(0);
console.log(`app/opengraph-image.png · 1200x630 · ${kb}KB`);
