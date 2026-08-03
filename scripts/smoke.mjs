// Smoke test: sirve out/ estático, navega las páginas con Chromium,
// junta errores de consola/página y saca screenshots.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const OUT = path.join(process.cwd(), 'out');
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
  res.end(fs.readFileSync(file));
});

await new Promise((r) => server.listen(4173, r));

const pages = ['/', '/jose-hernandez/', '/emilio-castro/', '/nunez/', '/novedades/'];
const browser = await chromium.launch();
const shotsDir = path.join(process.cwd(), 'scripts', 'shots');
fs.mkdirSync(shotsDir, { recursive: true });
let failures = 0;

for (const route of pages) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(`http://localhost:4173${route}`, { waitUntil: 'networkidle' });
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
