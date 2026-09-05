// Smoke test: sirve out/ estático, navega las páginas con Chromium,
// junta errores de consola/página y saca screenshots.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
// TEMPORAL (se va con el sorteo): que el pop-up no se le siente encima a los
// screenshots ni a los chequeos de consola
import { apagarSorteo, esHtml } from './sorteo-off.mjs';

const OUT = path.join(process.cwd(), 'out');
// puerto configurable: 4173 lo suele tener tomado otro proyecto en la misma PC
const PORT = Number(process.env.SMOKE_PORT ?? 4173);
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain',
};

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let file = path.join(OUT, p);
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) file = path.join(OUT, '404.html');
  res.setHeader('Content-Type', MIME[path.extname(file)] ?? 'application/octet-stream');
  if (esHtml(file)) {
    res.end(apagarSorteo(fs.readFileSync(file, 'utf8')));
    return;
  }
  res.end(fs.readFileSync(file));
});

await new Promise((r) => server.listen(PORT, r));

// /nunez/home/ no es una ruta inventada: es una URL REAL del sitio viejo de
// Bitrix24 que Google todavia tiene indexada. Sirve para probar el 404 con el
// caso que de verdad recibe trafico.
const pages = ['/', '/jose-hernandez/', '/emilio-castro/', '/nunez/', '/novedades/', '/nunez/home/'];
const browser = await chromium.launch();
const shotsDir = path.join(process.cwd(), 'scripts', 'shots');
fs.mkdirSync(shotsDir, { recursive: true });
let failures = 0;

for (const route of pages) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2600); // deja terminar el preloader
  await page.mouse.wheel(0, 2500);
  await page.waitForTimeout(1200);
  await page.mouse.wheel(0, 6000);
  await page.waitForTimeout(1200);
  const name = route === '/' ? 'home' : route.replaceAll('/', '');
  await page.screenshot({ path: path.join(shotsDir, `${name}.png`) });
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  const filtered = errors.filter(
    (e) => !e.includes('maps.google') && !e.includes('maps.gstatic') && !e.includes('ERR_'),
  );
  if (filtered.length) {
    failures++;
    console.log(`✗ ${route}\n  ${filtered.join('\n  ')}`);
  } else {
    console.log(`✓ ${route} (bg tras scroll: ${bg})`);
  }
  await page.close();
}

await browser.close();
server.close();
process.exit(failures ? 1 : 0);
