/* Verificador del nav a lo ancho de todos los tamaños.
   Nació el 4-sep, cuando el ícono de Instagram pasó de ser un link muerto a un
   desplegable con las tres cuentas de sede: ahí se descubrió que se ocultaba en
   1500px mientras el burger aparecía recién en 1100px, así que entre 1101 y
   1500 las cuentas no se alcanzaban desde el nav y nadie lo había notado.

   Chequea, en cada ancho: que el nav no desborde ni se le monten los bloques,
   que los 3 Instagram sean alcanzables (por el ícono o por el menú), y que las
   URLs sean las de data/sedes.ts. Y que no quede ningún link muerto a '#'.

   Uso:  node scripts/check-nav.mjs        (necesita npm run build antes)
         NAV_PORT=4300 node scripts/check-nav.mjs
*/
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const OUT = path.join(process.cwd(), 'out');
const PORT = Number(process.env.NAV_PORT ?? 4215);
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
};

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

const ESPERADOS = [
  'https://www.instagram.com/fosque.josehernandez/',
  'https://www.instagram.com/fosque.emiliocastro/',
  'https://www.instagram.com/fosque_nunez/',
];

const fallos = [];
const ok = (m) => console.log(`  ok    ${m}`);
const fail = (m) => {
  fallos.push(m);
  console.log(`  FALLA ${m}`);
};
const chequear = (c, m) => (c ? ok(m) : fail(m));

const browser = await chromium.launch();
const shots = path.join(process.cwd(), 'scripts', 'shots');
fs.mkdirSync(shots, { recursive: true });

/* Los anchos elegidos no son redondos por gusto: 1101 y 1099 rodean el
   breakpoint del burger, y 1501/1499 el que tenía el ícono de Instagram. */
const ANCHOS = [1920, 1600, 1501, 1499, 1450, 1400, 1360, 1200, 1150, 1101, 1099, 900, 768, 600, 390];

/* Alto de referencia: el que tiene el nav con espacio de sobra. Sirve para
   cazar el engorde silencioso — un botón que parte su texto en dos líneas
   estira el nav 22px sin desbordar nada, así que ningún chequeo de "se sale de
   la pantalla" lo agarra. Pasaba entre 1361 y 1500px desde antes del
   Instagram por sede, y se arregló con `nav .btn { white-space: nowrap }`. */
let altoRef = 0;

console.log('\n1) El nav no desborda y los 3 Instagram se alcanzan');
for (const w of ANCHOS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(`${base}/nunez/`, { waitUntil: 'networkidle' });

  const est = await page.evaluate(() => {
    const nav = document.querySelector('nav');
    const vis = (el) => {
      if (!el) return false;
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return s.display !== 'none' && s.visibility !== 'hidden' && r.width > 0;
    };
    const r = nav.getBoundingClientRect();
    const hijos = [...nav.children].filter((c) => vis(c)).map((c) => c.getBoundingClientRect());
    // ¿algún bloque del nav se sale, o se montan entre ellos?
    const sale = hijos.some((b) => b.left < -1 || b.right > innerWidth + 1);
    let monta = false;
    for (let i = 1; i < hijos.length; i++) {
      if (hijos[i].left < hijos[i - 1].right - 1) monta = true;
    }
    // ¿algún botón del nav acomodó su texto en dos líneas?
    const botonesEnUnaLinea = [...nav.querySelectorAll('.btn')].filter(vis).every((b) => {
      const cs = getComputedStyle(b);
      const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.2;
      const interior = b.getBoundingClientRect().height
        - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom)
        - parseFloat(cs.borderTopWidth) - parseFloat(cs.borderBottomWidth);
      return interior <= lh * 1.6;
    });

    return {
      alto: Math.round(r.height),
      botonesEnUnaLinea,
      sale,
      monta,
      scrollX: document.documentElement.scrollWidth > innerWidth + 1,
      igNav: vis(document.querySelector('.nav-social')),
      burger: vis(document.querySelector('.burger')),
      links: vis(document.querySelector('nav .links')),
    };
  });

  if (w === 1920) altoRef = est.alto;
  // sólo mientras el layout de escritorio está activo: más abajo el nav cambia
  // de forma a propósito
  if (est.links) {
    chequear(
      est.alto <= altoRef,
      `${w}px: el nav no engorda (${est.alto} vs ${altoRef} de referencia)`,
    );
  }
  chequear(
    est.botonesEnUnaLinea,
    `${w}px: ningún botón del nav parte su texto en dos líneas`,
  );

  const via = est.igNav ? 'ícono del nav' : est.burger ? 'menú del burger' : 'NINGUNA';
  chequear(!est.sale && !est.monta, `${w}px: el nav no desborda ni se monta (alto ${est.alto})`);
  chequear(!est.scrollX, `${w}px: la página no scrollea de costado`);
  chequear(via !== 'NINGUNA', `${w}px: los Instagram se alcanzan por ${via}`);

  // y de verdad están: se abre el camino que corresponda y se leen los hrefs
  let hrefs = [];
  if (est.igNav) {
    await page.hover('.nav-social');
    await page.waitForTimeout(400);
    hrefs = await page.$$eval('.nav-social .sub a', (as) => as.map((a) => a.href));
  } else if (est.burger) {
    await page.click('.burger');
    await page.waitForTimeout(400);
    hrefs = await page.$$eval('.mm-ig', (as) => as.map((a) => a.href));
  }
  const faltan = ESPERADOS.filter((u) => !hrefs.includes(u));
  chequear(
    faltan.length === 0,
    `${w}px: los 3 links correctos${faltan.length ? ' — faltan ' + faltan.join(', ') : ''}`,
  );

  /* En el menú mobile los 3 tienen que verse SIN scrollear: cuando estaban en
     una sección aparte al final, el tercero caía abajo del borde y había que
     descubrir que el menú scrollea por dentro. Y el ícono tiene que ser
     tocable. */
  if (est.burger) {
    const chips = await page.evaluate(() => {
      const as = [...document.querySelectorAll('.mm-ig')];
      return as.map((a) => {
        const r = a.getBoundingClientRect();
        return { visible: r.bottom <= innerHeight + 1 && r.top >= -1, w: r.width, h: r.height };
      });
    });
    chequear(
      chips.length === 3 && chips.every((c) => c.visible),
      `${w}px: los 3 Instagram se ven sin scrollear el menú (${chips.filter((c) => c.visible).length}/3)`,
    );
    chequear(
      chips.every((c) => c.w >= 43.5 && c.h >= 43.5),
      `${w}px: el ícono de Instagram es tocable (${(chips[0]?.w ?? 0).toFixed(1)}px)`,
    );
  }

  if (w === 1920 || w === 1200 || w === 390) {
    await page.screenshot({ path: path.join(shots, `nav-${w}.png`) });
  }
  await ctx.close();
}

/* =========================================================================
   2) No quedan links muertos a '#' en el nav ni en el footer
   ========================================================================= */
console.log('\n2) Links muertos');
{
  /* En 390px, porque acá hay que ABRIR el menú mobile y el burger sólo
     existe en pantallas chicas. El nav de escritorio igual está en el DOM
     (oculto por CSS) y sus href se leen lo mismo, así que un solo viewport
     alcanza para revisar nav, menú y footer. */
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(`${base}/nunez/`, { waitUntil: 'networkidle' });
  await page.click('.burger');
  await page.waitForTimeout(300);

  const muertos = await page.evaluate(() => {
    const salida = [];
    for (const a of document.querySelectorAll('nav a, .mobile-menu a, footer a')) {
      const h = a.getAttribute('href');
      if (h === '#' || h === '' || h === null) {
        salida.push((a.textContent || a.getAttribute('aria-label') || '?').trim().slice(0, 40));
      }
    }
    return salida;
  });
  // EVO sigue en '#' a propósito: falta que el cliente mande la URL del login.
  // 26-09: el botón se llamaba "Ingresá a tu Perfil" y pasó a "Membresía F"
  // por pedido del cliente. Lo que sigue pendiente es lo mismo: la URL real.
  const esEvo = (t) => /Perfil|Membresía F/i.test(t);
  const evo = muertos.filter(esEvo);
  const otros = muertos.filter((t) => !esEvo(t));
  chequear(
    otros.length === 0,
    `sin links a '#' fuera del EVO${otros.length ? ': ' + otros.join(' · ') : ''}`,
  );
  ok(`el botón de EVO sigue en '#' a propósito (${evo.length} apariciones, falta la URL del cliente)`);

  const fb = await page.evaluate(() =>
    /facebook/i.test(document.querySelector('nav')?.outerHTML ?? '') ||
    /facebook/i.test(document.querySelector('footer')?.outerHTML ?? ''),
  );
  chequear(!fb, 'no quedó ningún rastro de Facebook en el nav ni en el footer');
  await ctx.close();
}

/* =========================================================================
   3) El desplegable con teclado
   ========================================================================= */
console.log('\n3) Teclado');
{
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(`${base}/nunez/`, { waitUntil: 'networkidle' });

  /* 26-09: esto esperaba 350ms fijos y comparaba `visibility`, pero el panel
     tiene `transition: 0.3s` sobre esa misma propiedad: 50ms de margen. Con la
     máquina cargada fallaba ~1 de cada 10 corridas sin que nada estuviera mal.
     Ahora espera a que la transición TERMINE, con un techo generoso. */
  const esperarVisibilidad = (estado) =>
    page
      .waitForFunction(
        (e) => getComputedStyle(document.querySelector('.nav-social .sub')).visibility === e,
        estado,
        { timeout: 3000 },
      )
      .then(
        () => true,
        () => false,
      );

  await page.focus('.ig-trigger');
  chequear(await esperarVisibilidad('visible'), 'al enfocar el ícono con Tab, el desplegable abre');

  await page.keyboard.press('Escape');
  chequear(await esperarVisibilidad('hidden'), 'Escape lo cierra');

  // y el de "Tu Sucursal" tiene que seguir funcionando por separado
  await page.hover('.has-sub.nlink');
  await page.waitForTimeout(350);
  const dos = await page.evaluate(() => ({
    sedes: getComputedStyle(document.querySelector('.nlink.has-sub .sub')).visibility,
    ig: getComputedStyle(document.querySelector('.nav-social .sub')).visibility,
  }));
  chequear(
    dos.sedes === 'visible' && dos.ig === 'hidden',
    `pasar por "Tu Sucursal" no abre el de Instagram (sedes ${dos.sedes}, ig ${dos.ig})`,
  );
  await ctx.close();
}

await browser.close();
server.close();
console.log(`\n${fallos.length ? `✗ ${fallos.length} falla(s)` : '✓ todo bien'}`);
if (fallos.length) {
  fallos.forEach((f) => console.log(`  · ${f}`));
  process.exit(1);
}
