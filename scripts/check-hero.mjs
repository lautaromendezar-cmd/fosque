/**
 * Chequeo del hero — cubre los tres reclamos del doc del cliente 2026-08-17:
 *
 *   1. LUMINANCIA: en ningún instante de la intro la pantalla puede irse a
 *      negro ni pegar un salto de luz de golpe.
 *   2. CONTRASTE: el copy sobre el video tiene que llegar a AA (4,5:1) contra
 *      el frame MÁS CLARO del clip, no contra un promedio.
 *   3. CAMINOS: carga fresca / recarga / volver navegando / reduced-motion.
 *
 * Correr SIEMPRE después de reemplazar hero.mp4 por el del rodaje: un video
 * más claro que el actual tira abajo el contraste sin que se note a ojo.
 *
 *   npm run build && node scripts/check-hero.mjs
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const OUT = path.join(process.cwd(), 'out');
const PORT = Number(process.env.HERO_PORT ?? 4194);
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain',
};

if (!fs.existsSync(OUT)) {
  console.error('Falta out/. Corré primero: npm run build');
  process.exit(1);
}

const server = http.createServer((req, res) => {
  const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let f = path.join(OUT, p);
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!fs.existsSync(f)) f = path.join(OUT, '404.html');
  res.setHeader('Content-Type', MIME[path.extname(f)] ?? 'application/octet-stream');
  res.end(fs.readFileSync(f));
});
await new Promise((r) => server.listen(PORT, r));
const base = `http://localhost:${PORT}`;

const browser = await chromium.launch();
let fallos = 0;
const ok = (cond, texto, extra = '') => {
  if (!cond) fallos++;
  console.log(`  ${cond ? '✓' : '✗'} ${texto}${extra ? ` — ${extra}` : ''}`);
};

/* Luminancia media (0-255) de un PNG, decodificado por el propio browser. */
const lumaDe = (page, buf) =>
  page.evaluate(async (d) => {
    const img = new Image();
    img.src = 'data:image/png;base64,' + d;
    await img.decode();
    const c = document.createElement('canvas');
    c.width = 160;
    c.height = 100;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0, 160, 100);
    const px = ctx.getImageData(0, 0, 160, 100).data;
    let s = 0;
    for (let i = 0; i < px.length; i += 4) {
      s += 0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2];
    }
    return s / (px.length / 4);
  }, buf.toString('base64'));

/* ---------- 1. LUMINANCIA A LO LARGO DE LA INTRO ---------- */
console.log('\n1) Luminancia durante la intro (nunca negro, sin escalones)');
let page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(base, { waitUntil: 'networkidle' });
const serie = [];
for (let i = 0; i < 26; i++) {
  serie.push(await lumaDe(page, await page.screenshot()));
  await page.waitForTimeout(300);
}
const min = Math.min(...serie);
ok(min >= 40, 'nunca cae a zona negra', `mínimo ${Math.round(min)}/255`);
// escalón = caída brusca entre dos muestras consecutivas (~300ms)
let peorSalto = 0;
for (let i = 1; i < serie.length; i++) {
  peorSalto = Math.max(peorSalto, Math.abs(serie[i] - serie[i - 1]));
}
ok(peorSalto <= 110, 'sin cortes de luz entre frames', `peor salto ${Math.round(peorSalto)}/255 en 300ms`);
await page.close();

/* ---------- 2. CONTRASTE DEL COPY CONTRA EL FRAME MÁS CLARO ---------- */
console.log('\n2) Contraste del copy sobre el video (AA = 4,5:1)');
const rel = (v) => {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const L_CREMA = 0.2126 * rel(240) + 0.7152 * rel(233) + 0.0722 * rel(216);

for (const sel of ['.cine-content h1', '.cine-content .sub']) {
  page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.waitForTimeout(11000); // que termine la intro
  const caja = await page.evaluate((s) => {
    const r = document.querySelector(s).getBoundingClientRect();
    return {
      x: Math.round(r.x),
      y: Math.round(r.y),
      width: Math.round(r.width),
      height: Math.round(r.height),
    };
  }, sel);
  // se oculta el texto para medir SOLO el fondo bajo su caja
  await page.evaluate((s) => {
    document.querySelector(s).style.visibility = 'hidden';
  }, sel);

  let peor = 99;
  for (let i = 0; i < 22; i++) {
    const b64 = (await page.screenshot({ clip: caja })).toString('base64');
    const maxL = await page.evaluate(async (d) => {
      const img = new Image();
      img.src = 'data:image/png;base64,' + d;
      await img.decode();
      const c = document.createElement('canvas');
      c.width = 120;
      c.height = 40;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0, 120, 40);
      const px = ctx.getImageData(0, 0, 120, 40).data;
      const r = (v) => {
        const s = v / 255;
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
      };
      let max = 0;
      for (let j = 0; j < px.length; j += 4) {
        const l = 0.2126 * r(px[j]) + 0.7152 * r(px[j + 1]) + 0.0722 * r(px[j + 2]);
        if (l > max) max = l;
      }
      return max;
    }, b64);
    peor = Math.min(peor, (L_CREMA + 0.05) / (maxL + 0.05));
  }
  ok(peor >= 4.5, `${sel} contra el fondo más claro`, `${peor.toFixed(2)}:1`);
  await page.close();
}

/* ---------- 3. LOS 4 CAMINOS DE ENTRADA ---------- */
console.log('\n3) Caminos de entrada al hero');
const visible = (pg, sel) =>
  pg.evaluate((s) => {
    const el = document.querySelector(s);
    if (!el) return 'no existe';
    const cs = getComputedStyle(el);
    const padre = getComputedStyle(el.closest('.cine-content') ?? el);
    const op = parseFloat(cs.opacity) * parseFloat(padre.opacity || '1');
    return cs.visibility === 'hidden' || op < 0.05 ? 'oculto' : 'visible';
  }, sel);

// carga fresca: el copy se suma por tiempos
let ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
page = await ctx.newPage();
await page.goto(base, { waitUntil: 'networkidle' });
await page.waitForTimeout(3800);
ok((await visible(page, '.cine-content h1')) === 'visible', 'fresca: la pregunta ya está a los ~4s');
ok((await visible(page, '.cine-content .sub')) === 'oculto', 'fresca: la frase central todavía no');
ok((await visible(page, 'nav')) === 'oculto', 'fresca: el nav no interrumpe la intro');
await page.waitForTimeout(7000);
ok((await visible(page, '.cine-content .ctas')) === 'visible', 'fresca: los botones al cierre');
ok((await visible(page, 'nav')) === 'visible', 'fresca: el nav al cierre');

// recargar repite la intro
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(3200);
ok((await visible(page, '.cine-content .ctas')) === 'oculto', 'recargar: repite la intro');
await ctx.close();

// volver navegando: sin intro
ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
page = await ctx.newPage();
await page.goto(base, { waitUntil: 'networkidle' });
await page.waitForTimeout(11000);
await page.click('nav a[href="/novedades/"]');
await page.waitForTimeout(1500);
await page.click('nav a[href="/"]');
await page.waitForTimeout(1200);
ok((await visible(page, '.cine-content .ctas')) === 'visible', 'volver navegando: va directo al final');
ok((await visible(page, '#preloader')) === 'no existe', 'volver navegando: sin preloader');
await ctx.close();

// reduced-motion: todo visible de una
ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
page = await ctx.newPage();
await page.goto(base, { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
for (const sel of ['.cine-content h1', '.cine-content .sub', '.cine-content .ctas', 'nav']) {
  ok((await visible(page, sel)) === 'visible', `reduced-motion: ${sel} visible`);
}
ok((await visible(page, '#preloader')) === 'no existe', 'reduced-motion: sin preloader');
await ctx.close();

await browser.close();
server.close();
console.log(fallos ? `\n✗ ${fallos} chequeo(s) fallaron` : '\n✓ Hero OK');
process.exit(fallos ? 1 : 0);
