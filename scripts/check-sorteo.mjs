/* Verificador del pop-up del sorteo de estreno.
   TEMPORAL: se borra junto con el pop-up cuando pase el 10/09.

   Prueba lo que falla SIN VERSE, que es casi todo lo de un modal: que se apague
   solo cuando pase la fecha (la promesa central: nadie va a subir nada por FTP
   para apagarlo), que el fondo no scrollee detrás, que el teclado no se escape
   del panel, que Esc y el click afuera cierren, que no vuelva a aparecer
   después de cerrado, y que el contraste dé AA de verdad y no "a ojo".

   Uso:  node scripts/check-sorteo.mjs          (necesita npm run build antes)
         SORTEO_PORT=4300 node scripts/check-sorteo.mjs
*/
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { CLAVE_SORTEO } from './sorteo-off.mjs';

const OUT = path.join(process.cwd(), 'out');
const PORT = Number(process.env.SORTEO_PORT ?? 4211);
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain',
  // el smoke no los declara y no le hace falta; acá sí, porque justamente se
  // verifica que la foto del premio cargue
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
};

const server = http.createServer((req, res) => {
  const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let file = path.join(OUT, p);
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) {
    file = path.join(OUT, '404.html');
    res.statusCode = 404;
  }
  res.setHeader('Content-Type', MIME[path.extname(file)] ?? 'application/octet-stream');
  res.end(fs.readFileSync(file));
});
await new Promise((r) => server.listen(PORT, r));
const base = `http://localhost:${PORT}`;

const shots = path.join(process.cwd(), 'scripts', 'shots');
fs.mkdirSync(shots, { recursive: true });

const fallos = [];
const ok = (msg) => console.log(`  ok    ${msg}`);
const fail = (msg) => {
  fallos.push(msg);
  console.log(`  FALLA ${msg}`);
};
const chequear = (cond, msg) => (cond ? ok(msg) : fail(msg));

const browser = await chromium.launch();

/* ---------- contraste: se calcula, no se mira -------------------------------
   Todo el texto del pop-up cae sobre un fondo sólido (el panel crema, el rosa
   del badge, el rosa claro de la fecha), así que alcanza con componer el color
   del texto —arrastrando el opacity heredado— sobre el primer fondo opaco que
   aparezca subiendo por los ancestros. */
const mideContraste = (sel) => {
  const el = document.querySelector(sel);
  if (!el) return null;
  const px = (c) => c.match(/[\d.]+/g).map(Number);
  const mezcla = (fg, bg, a) => fg.map((c, i) => c * a + bg[i] * (1 - a));
  const lum = ([r, g, b]) => {
    const f = (v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  // primer fondo opaco hacia arriba
  let bg = [255, 255, 255];
  for (let n = el; n; n = n.parentElement) {
    const c = px(getComputedStyle(n).backgroundColor);
    if ((c[3] ?? 1) > 0.95) {
      bg = c.slice(0, 3);
      break;
    }
  }
  // opacity acumulada del texto
  let a = 1;
  for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
    a *= Number(getComputedStyle(n).opacity);
  }
  const cs = getComputedStyle(el);
  const fg = mezcla(px(cs.color).slice(0, 3), bg, a);
  const [l1, l2] = [lum(fg), lum(bg)].sort((x, y) => y - x);
  return {
    ratio: (l1 + 0.05) / (l2 + 0.05),
    px: parseFloat(cs.fontSize),
    peso: Number(cs.fontWeight),
  };
};

/* Abre el pop-up y espera a que la animación de entrada TERMINE.
   Importa más de lo que parece: el panel entra con opacity 0→1 y
   scale(.98)→1, así que medir apenas se hace visible devuelve contrastes más
   bajos y cajas más chicas que las reales. Un botón de 44px medido a mitad de
   camino da 43,2 y el chequeo falla sin que nada esté mal. */
const abrirPanel = async (page, url) => {
  await page.goto(url, { waitUntil: 'networkidle' });
  const panel = page.locator('.sorteo-panel');
  await panel.waitFor({ state: 'visible', timeout: 15000 });
  await page.waitForFunction(
    () => {
      const s = getComputedStyle(document.querySelector('.sorteo-panel'));
      const t = s.transform;
      return (
        Number(s.opacity) === 1 && (t === 'none' || t === 'matrix(1, 0, 0, 1, 0, 0)')
      );
    },
    null,
    { timeout: 6000 },
  );
  return panel;
};

/* =========================================================================
   1) Aparece, y se ve como tiene que verse
   ========================================================================= */
console.log('\n1) Aparece en una sede (?sorteo=ver) y se ve');
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const roto = [];
  page.on('response', (r) => {
    if (r.status() >= 400) roto.push(`${r.status()} ${r.url()}`);
  });
  await abrirPanel(page, `${base}/nunez/?sorteo=ver`);
  ok('el panel abre');

  chequear(roto.length === 0, `sin recursos rotos${roto.length ? ': ' + roto.join(', ') : ''}`);

  // la foto del premio existe y tiene píxeles de verdad
  const foto = await page.evaluate(() => {
    const i = document.querySelector('.sorteo-foto img');
    return i ? { c: i.complete, w: i.naturalWidth } : null;
  });
  chequear(foto?.c && foto.w > 0, `la foto del premio carga (${foto?.w ?? 0}px de ancho natural)`);

  // los 3 Instagram, con las URLs que están en data/sedes.ts
  const igs = await page.$$eval('.sorteo-ig', (as) =>
    as.map((a) => ({ href: a.getAttribute('href'), txt: a.textContent.trim() })),
  );
  chequear(igs.length === 3, `los 3 Instagram están (hay ${igs.length})`);
  const esperados = [
    'fosque.josehernandez',
    'fosque.emiliocastro',
    'fosque_nunez',
  ];
  esperados.forEach((h) => {
    chequear(
      igs.some((i) => i.href?.includes(h)),
      `link a @${h}`,
    );
  });
  chequear(
    igs.every((i) => i.href?.startsWith('https://www.instagram.com/')),
    'los 3 links salen a instagram.com',
  );

  // contraste AA: 4.5 normal, 3.0 si es grande (>=24px, o >=18.66px y bold)
  console.log('  --- contraste ---');
  for (const sel of [
    '#sorteo h2',
    '.sorteo-intro',
    '.sorteo-kicker',
    '.sorteo-como',
    '.sorteo-pasos li',
    '.sorteo-ig .ig-sede',
    '.sorteo-ig .ig-arroba',
    '.sorteo-hasta',
    '.sorteo-premio',
  ]) {
    const m = await page.evaluate(mideContraste, sel);
    if (!m) {
      fail(`${sel} no existe`);
      continue;
    }
    const grande = m.px >= 24 || (m.px >= 18.66 && m.peso >= 700);
    const min = grande ? 3 : 4.5;
    chequear(
      m.ratio >= min,
      `${sel} → ${m.ratio.toFixed(2)}:1 (${m.px.toFixed(0)}px, mínimo ${min})`,
    );
  }

  // el pop-up tiene que estar por encima del nav y del WhatsApp flotante
  const encima = await page.evaluate(() => {
    const z = (s) => {
      const el = document.querySelector(s);
      return el ? Number(getComputedStyle(el).zIndex) || 0 : -1;
    };
    return { sorteo: z('#sorteo'), nav: z('nav'), wa: z('#wa-box') || z('#wa') };
  });
  chequear(
    encima.sorteo > encima.nav && encima.sorteo > encima.wa,
    `por encima del nav (${encima.nav}) y del WhatsApp (${encima.wa}): z-index ${encima.sorteo}`,
  );

  await page.screenshot({ path: path.join(shots, 'sorteo-desktop.png') });
  await ctx.close();
}

/* =========================================================================
   2) Mobile
   ========================================================================= */
console.log('\n2) Mobile 390x844');
{
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();
  await abrirPanel(page, `${base}/nunez/?sorteo=ver`);

  const caja = await page.evaluate(() => {
    const p = document.querySelector('.sorteo-panel');
    const r = p.getBoundingClientRect();
    return {
      alto: r.height,
      ancho: r.width,
      vh: innerHeight,
      vw: innerWidth,
      desborda: p.scrollHeight > p.clientHeight + 1,
      // ¿se sale de la pantalla algo del panel?
      fuera: r.top < -1 || r.bottom > innerHeight + 1 || r.left < -1 || r.right > innerWidth + 1,
    };
  });
  chequear(!caja.fuera, `el panel entra en la pantalla (${Math.round(caja.ancho)}x${Math.round(caja.alto)} en ${caja.vw}x${caja.vh})`);

  /* Lo que de verdad importa en mobile: que el CTA no quede abajo del pliegue.
     Si hay que scrollear dentro del modal para ver el tercer Instagram o la
     fecha, se los pierde el que no descubra que el panel scrollea. */
  const abajo = await page.evaluate(() => {
    const p = document.querySelector('.sorteo-panel');
    const pr = p.getBoundingClientRect();
    const mira = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { visible: r.bottom <= pr.bottom + 1, sobra: Math.round(r.bottom - pr.bottom) };
    };
    return {
      desborde: Math.round(p.scrollHeight - p.clientHeight),
      ultimoIg: mira('.sorteo-ig:last-of-type'),
      fecha: mira('.sorteo-hasta'),
    };
  });
  chequear(
    abajo.ultimoIg?.visible,
    `el 3er Instagram se ve sin scrollear el panel${abajo.ultimoIg?.visible ? '' : ` (${abajo.ultimoIg?.sobra}px abajo del pliegue)`}`,
  );
  chequear(
    abajo.fecha?.visible,
    `la fecha límite se ve sin scrollear el panel${abajo.fecha?.visible ? '' : ` (${abajo.fecha?.sobra}px abajo del pliegue)`}`,
  );
  ok(`desborde interno del panel: ${abajo.desborde}px`);

  // el nombre de la sede no se puede partir en dos líneas: descuadra el botón
  const lineas = await page.evaluate(() => {
    const el = document.querySelector('.sorteo-ig .ig-sede');
    const alto = el.getBoundingClientRect().height;
    const lh = parseFloat(getComputedStyle(el).lineHeight) || parseFloat(getComputedStyle(el).fontSize) * 1.2;
    return Math.round(alto / lh);
  });
  chequear(lineas === 1, `"José Hernández" entra en una línea en el botón (${lineas})`);

  // el botón de cerrar tiene que ser tocable: 44px es el mínimo de la guía
  const x = await page.locator('.sorteo-x').boundingBox();
  // tolerancia de medio píxel: el motor devuelve 43,99 para un botón de 44px
  // exactos, y redondear para mostrar deja el mensaje diciendo "44px falla 44"
  chequear(
    x && x.width >= 43.5 && x.height >= 43.5,
    `la X es tocable, mínimo 44px (${(x?.width ?? 0).toFixed(2)}x${(x?.height ?? 0).toFixed(2)}px)`,
  );

  await page.screenshot({ path: path.join(shots, 'sorteo-mobile.png') });
  await ctx.close();
}

/* =========================================================================
   3) LO IMPORTANTE: se apaga solo cuando pasa la fecha
   ========================================================================= */
console.log('\n3) Se apaga solo (sin ?sorteo=ver, fingiendo el reloj)');
for (const caso of [
  { cuando: '2026-09-04T15:00:00Z', dia: '4/09, sorteo abierto', debe: true },
  { cuando: '2026-09-11T02:00:00Z', dia: '10/09 23:00 ART, último momento', debe: true },
  { cuando: '2026-09-11T03:30:00Z', dia: '11/09 00:30 ART, ya terminó', debe: false },
  { cuando: '2026-10-01T12:00:00Z', dia: '1/10, tres semanas después', debe: false },
]) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  await page.clock.setFixedTime(new Date(caso.cuando));
  await page.goto(`${base}/nunez/`, { waitUntil: 'networkidle' });
  // el pop-up de una sede espera 2,2s: se le da margen de sobra
  await page.waitForTimeout(4500);
  const visible = await page.locator('.sorteo-panel').isVisible().catch(() => false);
  chequear(visible === caso.debe, `${caso.dia} → ${caso.debe ? 'aparece' : 'NO aparece'}`);
  await ctx.close();
}

/* =========================================================================
   4) Cerrar de las tres formas, y que no vuelva
   ========================================================================= */
console.log('\n4) Cerrar y no volver');
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });

  for (const [modo, cerrar] of [
    ['Escape', async (p) => p.keyboard.press('Escape')],
    ['click afuera', async (p) => p.locator('#sorteo').click({ position: { x: 8, y: 8 } })],
    ['botón X', async (p) => p.locator('.sorteo-x').click()],
  ]) {
    const page = await ctx.newPage();
    await abrirPanel(page, `${base}/nunez/?sorteo=ver`);
    await cerrar(page);
    await page.waitForTimeout(300);
    const sigue = await page.locator('.sorteo-panel').isVisible().catch(() => false);
    chequear(!sigue, `cierra con ${modo}`);
    // y el scroll de la página vuelve a funcionar
    const scrolla = await page.evaluate(async () => {
      const antes = scrollY;
      window.scrollTo(0, 400);
      await new Promise((r) => setTimeout(r, 150));
      return scrollY !== antes || scrollY > 0;
    });
    chequear(scrolla, `después de cerrar con ${modo}, la página vuelve a scrollear`);
    await page.close();
  }

  // ya cerrado: recargar sin ?sorteo=ver no lo trae de vuelta (localStorage)
  const page = await ctx.newPage();
  await page.goto(`${base}/nunez/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(4000);
  const volvio = await page.locator('.sorteo-panel').isVisible().catch(() => false);
  chequear(!volvio, 'una vez cerrado no vuelve a aparecer (misma máquina)');
  await ctx.close();
}

/* =========================================================================
   5) Con el pop-up abierto: el fondo quieto y el teclado adentro
   ========================================================================= */
console.log('\n5) Fondo quieto y foco atrapado');
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  await abrirPanel(page, `${base}/nunez/?sorteo=ver`);

  // rueda del mouse sobre el fondo: la página no se tiene que mover
  const antes = await page.evaluate(() => scrollY);
  await page.mouse.move(30, 400);
  await page.mouse.wheel(0, 900);
  await page.waitForTimeout(500);
  const despues = await page.evaluate(() => scrollY);
  chequear(Math.abs(despues - antes) < 3, `el fondo no scrollea detrás (${antes} → ${despues})`);

  // el foco arranca en el panel
  const arranca = await page.evaluate(() =>
    document.activeElement?.classList.contains('sorteo-panel'),
  );
  chequear(arranca, 'el foco arranca en el panel (el lector lee el título primero)');

  // tabulando muchas veces nunca se sale del pop-up
  let escapo = null;
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press('Tab');
    const dentro = await page.evaluate(() => !!document.activeElement?.closest('#sorteo'));
    if (!dentro) {
      escapo = i + 1;
      break;
    }
  }
  chequear(escapo === null, `el foco no se escapa en 12 tabs${escapo ? ` (se fue en el ${escapo})` : ''}`);

  // y al cerrar vuelve a donde estaba
  await page.keyboard.press('Escape');
  await page.waitForTimeout(250);
  const volvio = await page.evaluate(() => !document.activeElement?.closest('#sorteo'));
  chequear(volvio, 'al cerrar el foco vuelve a la página');
  await ctx.close();
}

/* =========================================================================
   6) La home: el pop-up no pisa el preloader ni el trailer
   ========================================================================= */
console.log('\n6) En la home espera a que termine la intro');
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  await page.goto(`${base}/?sorteo=ver`);
  // a los 2,5s la película recién va por la mitad: el pop-up NO puede estar
  await page.waitForTimeout(2500);
  const temprano = await page.locator('.sorteo-panel').isVisible().catch(() => false);
  chequear(!temprano, 'a los 2,5s todavía no aparece (la intro sigue corriendo)');

  const t0 = Date.now();
  await page.locator('.sorteo-panel').waitFor({ state: 'visible', timeout: 15000 });
  const espero = ((Date.now() - t0) / 1000).toFixed(1);
  ok(`aparece cuando la intro termina (${espero}s después del chequeo)`);

  // y el preloader ya no está: no se superponen
  const pre = await page.locator('#preloader').count();
  chequear(pre === 0, 'el preloader ya se fue cuando el pop-up entra');
  await page.screenshot({ path: path.join(shots, 'sorteo-home.png') });
  await ctx.close();
}

/* =========================================================================
   7) reduced-motion: sin animación, y el fondo igual queda quieto
   ========================================================================= */
console.log('\n7) prefers-reduced-motion');
{
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    reducedMotion: 'reduce',
  });
  const page = await ctx.newPage();
  await abrirPanel(page, `${base}/nunez/?sorteo=ver`);
  ok('abre igual con reduced-motion');

  const anim = await page.evaluate(() => {
    const s = getComputedStyle(document.querySelector('.sorteo-panel'));
    return s.animationName;
  });
  chequear(anim === 'none', `el panel entra sin animación (animation-name: ${anim})`);

  // acá Lenis está destruido: el freno del fondo lo tiene que hacer el CSS
  const antes = await page.evaluate(() => scrollY);
  await page.mouse.move(30, 400);
  await page.mouse.wheel(0, 900);
  await page.waitForTimeout(400);
  const despues = await page.evaluate(() => scrollY);
  chequear(
    Math.abs(despues - antes) < 3,
    `sin Lenis el fondo tampoco scrollea (${antes} → ${despues})`,
  );
  await ctx.close();
}

/* =========================================================================
   8) La clave del "ya lo cerré" no se puede desincronizar
   ========================================================================= */
console.log('\n8) Coherencia con los otros verificadores');
{
  // smoke.mjs y check-hero.mjs apagan el pop-up escribiendo esta clave. Si el
  // componente cambia la suya y nadie actualiza sorteo-off.mjs, el pop-up
  // vuelve a taparles los screenshots y las mediciones SIN QUE FALLE NADA:
  // ya pasó una vez y se descubrió de casualidad.
  const src = fs.readFileSync(path.join(process.cwd(), 'components', 'Sorteo.tsx'), 'utf8');
  const m = src.match(/const VISTO = '([^']+)'/);
  chequear(
    m?.[1] === CLAVE_SORTEO,
    `la clave de sorteo-off.mjs es la del componente (${m?.[1] ?? '?'} vs ${CLAVE_SORTEO})`,
  );
}

await browser.close();
server.close();

console.log(
  `\n${fallos.length ? `✗ ${fallos.length} falla(s)` : '✓ todo bien'} — screenshots en scripts/shots/`,
);
if (fallos.length) {
  fallos.forEach((f) => console.log(`  · ${f}`));
  process.exit(1);
}
