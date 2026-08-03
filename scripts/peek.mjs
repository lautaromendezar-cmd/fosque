// Capturas puntuales (hero, programa, sedes, hover del nav) sobre out/
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const OUT = path.join(process.cwd(), 'out');
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.mp4': 'video/mp4',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let file = path.join(OUT, p);
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) file = path.join(OUT, '404.html');
  res.setHeader('Content-Type', MIME[path.extname(file)] ?? 'application/octet-stream');
  res.end(fs.readFileSync(file));
});
await new Promise((r) => server.listen(4174, r));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const dir = path.join(process.cwd(), 'scripts', 'shots');

await page.goto('http://localhost:4174/', { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);
await page.screenshot({ path: path.join(dir, 'peek-hero.png') });

await page.hover('.has-sub');
await page.waitForTimeout(500);
await page.screenshot({ path: path.join(dir, 'peek-menu.png') });

await page.mouse.wheel(0, 3200);
await page.waitForTimeout(1500);
await page.screenshot({ path: path.join(dir, 'peek-programa.png') });

await page.mouse.wheel(0, 2200);
await page.waitForTimeout(1500);
await page.screenshot({ path: path.join(dir, 'peek-sedes.png') });

await page.goto('http://localhost:4174/jose-hernandez/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
await page.screenshot({ path: path.join(dir, 'peek-sede.png') });

await browser.close();
server.close();
console.log('ok');
