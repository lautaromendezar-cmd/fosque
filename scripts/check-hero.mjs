/**
 * Chequeo del hero — cubre los tres reclamos del doc del cliente 2026-08-17:
 *
 *   1. LUMINANCIA: en ningún instante de la intro la pantalla puede irse a
 *      negro ni pegar un salto de luz de golpe.
 *   2. CONTRASTE: el copy tiene que llegar a AA (4,5:1) contra el píxel MÁS
 *      OSCURO que quede bajo cada renglón, no contra el fondo nominal.
 *   3. CAMINOS: carga fresca / recarga / volver navegando / reduced-motion.
 *
 * Desde el 27-ago-2026 el hero no tiene video: es crema con los arcos. El
 * chequeo 2 sigue existiendo porque los arcos SÍ pintan color bajo el texto si
 * alguien los agranda o los reposiciona.
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
ok(
  peorSalto <= 110,
  'sin cortes de luz entre frames',
  `peor salto ${Math.round(peorSalto)}/255 en 300ms`,
);
await page.close();

/* ---------- 2. CONTRASTE DEL COPY CONTRA LO QUE HAY DEBAJO ---------- */
console.log('\n2) Contraste del copy sobre el fondo del hero (AA = 4,5:1)');

/* Dos trampas que ya nos dieron números falsos antes y que este chequeo evita:
   - la caja del ELEMENTO no es la del texto (un h1 centrado de 16ch tiene aire
     a los costados que baja el peor caso): se miden los rects de un Range, o
     sea los renglones reales;
   - la opacidad del texto es parte del contraste. `.sub` va al 0,86, así que el
     color que se ve es la mezcla con el fondo. Se calcula PÍXEL A PÍXEL:
     mezcla = a·color + (1-a)·píxel, y se compara contra ese mismo píxel. */
for (const sel of ['.cine-content h1', '.cine-content .sub']) {
  page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.waitForTimeout(11000); // que termine la intro y el copy esté fijo

  // renglones reales + color y opacidad efectiva heredada
  const { lineas, color, alpha } = await page.evaluate((s) => {
    const el = document.querySelector(s);
    const r = document.createRange();
    r.selectNodeContents(el);
    const lineas = [...r.getClientRects()]
      .filter((b) => b.width > 4 && b.height > 4)
      .map((b) => ({
        x: Math.floor(b.x),
        y: Math.floor(b.y),
        width: Math.ceil(b.width),
        height: Math.ceil(b.height),
      }));
    const cs = getComputedStyle(el);
    // rgba(): el alfa del PROPIO color cuenta igual que el opacity heredado.
    // Parsear solo /\d+/ se comía el 0.82 de .sub y el chequeo daba de más.
    const canal = cs.color.match(/[\d.]+/g).map(Number);
    const [cr, cg, cb] = canal;
    let a = canal[3] ?? 1;
    for (let n = el; n && n !== document.body; n = n.parentElement) {
      a *= parseFloat(getComputedStyle(n).opacity || '1');
    }
    return { lineas, color: [cr, cg, cb], alpha: a };
  }, sel);

  // se oculta el texto para fotografiar SOLO lo que hay detrás
  await page.evaluate((s) => {
    document.querySelector(s).style.visibility = 'hidden';
  }, sel);

  /* Los arcos respiran (24s, scale 1→1.06 y ±3°), así que medir "cuando toque"
     da un número distinto en cada corrida: la primera vez que se corrió esto
     dio 14,64 y la siguiente 11,65. Se los CLAVA con !important en los dos
     extremos del ciclo —el inline que escribe GSAP pierde contra eso— y se
     toma el peor de los dos. Determinista y cubre el recorrido entero. */
  const ESTADOS = [
    ['rotate(180deg) scale(1)', 'rotate(0deg) scale(1)'],
    ['rotate(183.5deg) scale(1.06)', 'rotate(-3deg) scale(1.06)'],
  ];

  let peor = 99;
  for (const [tl, br] of ESTADOS) {
    await page.evaluate(
      ([tl, br]) => {
        let st = document.getElementById('pin-arcos');
        if (!st) {
          st = document.createElement('style');
          st.id = 'pin-arcos';
          document.head.appendChild(st);
        }
        st.textContent = `#cine .rings.tl{transform:${tl}!important}#cine .rings.br{transform:${br}!important}`;
      },
      [tl, br],
    );
    for (const caja of lineas) {
      const b64 = (await page.screenshot({ clip: caja })).toString('base64');
      const r = await page.evaluate(
        async ([d, color, alpha]) => {
          const img = new Image();
          img.src = 'data:image/png;base64,' + d;
          await img.decode();
          const c = document.createElement('canvas');
          c.width = Math.min(img.width, 240);
          c.height = Math.min(img.height, 60);
          const ctx = c.getContext('2d');
          ctx.drawImage(img, 0, 0, c.width, c.height);
          const px = ctx.getImageData(0, 0, c.width, c.height).data;
          const lin = (v) => {
            const x = v / 255;
            return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
          };
          const lum = (p) => 0.2126 * lin(p[0]) + 0.7152 * lin(p[1]) + 0.0722 * lin(p[2]);
          let peor = 99;
          for (let j = 0; j < px.length; j += 4) {
            const fondo = [px[j], px[j + 1], px[j + 2]];
            const texto = fondo.map((v, k) => alpha * color[k] + (1 - alpha) * v);
            const a = lum(texto) + 0.05;
            const b = lum(fondo) + 0.05;
            const ratio = a > b ? a / b : b / a;
            if (ratio < peor) peor = ratio;
          }
          return peor;
        },
        [b64, color, alpha],
      );
      if (r < peor) peor = r;
    }
  }
  ok(
    peor >= 4.5,
    `${sel} en el peor píxel de sus ${lineas.length} renglones`,
    `${peor.toFixed(2)}:1`,
  );
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

/* El cronómetro NO puede arrancar en 'networkidle': con los videos reales del
   rodaje la carga tarda mucho más y la intro ya viene corriendo. Se ancla en el
   momento en que el preloader desaparece, que es exactamente cuando arranca
   film() y cuando el video vuelve a su frame 1. */
const intro = async (pg) => {
  await pg.waitForSelector('#preloader', { state: 'detached', timeout: 30000 });
  return Date.now();
};
const enT = async (pg, t0, seg) => {
  const faltan = t0 + seg * 1000 - Date.now();
  if (faltan > 0) await pg.waitForTimeout(faltan);
};

// carga fresca: el copy se suma por tiempos
let ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
page = await ctx.newPage();
await page.goto(base, { waitUntil: 'domcontentloaded' });
let t0 = await intro(page);
await enT(page, t0, 2.5);
ok(
  (await visible(page, '.cine-content h1')) === 'visible',
  'fresca: la pregunta ya está a los 2,5s',
);
ok((await visible(page, '.cine-content .sub')) === 'oculto', 'fresca: la frase central todavía no');
ok((await visible(page, 'nav')) === 'oculto', 'fresca: el nav no interrumpe la intro');
await enT(page, t0, 5.8);
ok(
  (await visible(page, '.cine-content .sub')) === 'visible',
  'fresca: la frase central a los 5,8s',
);
await enT(page, t0, 9);
ok((await visible(page, '.cine-content .ctas')) === 'visible', 'fresca: los botones al cierre');
ok((await visible(page, 'nav')) === 'visible', 'fresca: el nav al cierre');

// recargar repite la intro
await page.reload({ waitUntil: 'domcontentloaded' });
t0 = await intro(page);
await enT(page, t0, 2.5);
ok((await visible(page, '.cine-content .ctas')) === 'oculto', 'recargar: repite la intro');
await ctx.close();

// volver navegando: sin intro
ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
page = await ctx.newPage();
await page.goto(base, { waitUntil: 'domcontentloaded' });
await enT(page, await intro(page), 10);
await page.click('nav a[href="/novedades/"]');
await page.waitForTimeout(1500);
await page.click('nav a[href="/"]');
await page.waitForTimeout(1200);
ok(
  (await visible(page, '.cine-content .ctas')) === 'visible',
  'volver navegando: va directo al final',
);
ok((await visible(page, '#preloader')) === 'no existe', 'volver navegando: sin preloader');
await ctx.close();

// reduced-motion: todo visible de una
ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: 'reduce',
});
page = await ctx.newPage();
await page.goto(base, { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
for (const sel of ['.cine-content h1', '.cine-content .sub', '.cine-content .ctas', 'nav']) {
  ok((await visible(page, sel)) === 'visible', `reduced-motion: ${sel} visible`);
}
ok((await visible(page, '#preloader')) === 'no existe', 'reduced-motion: sin preloader');
/* El manifiesto se parte en palabras desde JS para encenderlas con el scroll.
   Si el reveal no corre —reduced-motion, o el script que se cae— el texto tiene
   que quedar entero y legible igual: es la regla de no ocultar nada que dependa
   de que el JS llegue. Acá se comprueba que en reduced-motion NO se parta y que
   ninguna palabra quede apagada. */
const mf = await page.evaluate(() => {
  const t = document.querySelector('#manifiesto .mf-texto');
  if (!t) return { existe: false };
  const pal = [...t.querySelectorAll('.pal')];
  return {
    existe: true,
    partido: pal.length,
    largo: t.textContent.trim().length,
    minOpacidad: pal.length
      ? Math.min(...pal.map((s) => parseFloat(getComputedStyle(s).opacity)))
      : 1,
  };
});
ok(
  mf.existe && mf.largo > 100,
  'reduced-motion: el manifiesto conserva su texto',
  `${mf.largo} caracteres`,
);
ok(mf.partido === 0, 'reduced-motion: no se parte en palabras');
ok(
  mf.minOpacidad >= 0.99,
  'reduced-motion: ninguna palabra queda apagada',
  `mínima ${mf.minOpacidad}`,
);
await ctx.close();

/* Y con animación: al terminar el scrub, las palabras tienen que quedar TODAS
   encendidas. Un reveal que se queda a media luz es peor que no tenerlo. */
ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
page = await ctx.newPage();
await page.goto(base, { waitUntil: 'networkidle' });
await enT(page, await intro(page), 10);
await page.evaluate(() => {
  const s = document.querySelector('#manifiesto');
  window.scrollTo(0, s.getBoundingClientRect().top + window.scrollY - 60);
});
await page.waitForTimeout(2500);
const mfFin = await page.evaluate(() => {
  const pal = [...document.querySelectorAll('#manifiesto .mf-texto .pal')];
  return {
    partido: pal.length,
    min: pal.length ? Math.min(...pal.map((s) => parseFloat(getComputedStyle(s).opacity))) : 0,
  };
});
ok(mfFin.partido > 20, 'manifiesto: el texto se parte en palabras', `${mfFin.partido} palabras`);
ok(
  mfFin.min >= 0.99,
  'manifiesto: al final del scroll no queda ninguna apagada',
  `mínima ${mfFin.min.toFixed(2)}`,
);
await ctx.close();

await browser.close();
server.close();
console.log(fallos ? `\n✗ ${fallos} chequeo(s) fallaron` : '\n✓ Hero OK');
process.exit(fallos ? 1 : 0);
