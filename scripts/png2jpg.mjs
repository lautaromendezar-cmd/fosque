// Convierte los PNG de scripts/tmp a JPG comprimido en public/media
// usando el canvas de Chromium (no hay sharp/ffmpeg confiable en esta máquina).
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const SRC = path.join(process.cwd(), 'scripts', 'tmp');
const DST = path.join(process.cwd(), 'public', 'media');
fs.mkdirSync(DST, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();

for (const f of fs.readdirSync(SRC).filter((f) => f.endsWith('.png'))) {
  const b64 = fs.readFileSync(path.join(SRC, f)).toString('base64');
  const jpgB64 = await page.evaluate(async (data) => {
    const img = new Image();
    img.src = `data:image/png;base64,${data}`;
    await img.decode();
    // ancho máx 1200: suficiente para los marcos del sitio
    const scale = Math.min(1, 1200 / img.width);
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.82).split(',')[1];
  }, b64);
  const out = path.join(DST, f.replace(/\.png$/, '.jpg'));
  fs.writeFileSync(out, Buffer.from(jpgB64, 'base64'));
  console.log(`${f} → ${path.basename(out)} (${(fs.statSync(out).size / 1024).toFixed(0)} KB)`);
}

await browser.close();
