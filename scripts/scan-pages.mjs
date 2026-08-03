// Escanea las 14 páginas del manual: cuenta operadores vectoriales y
// renderiza miniaturas para ubicar el logo en vector.
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const PDF = 'C:/Users/Lautaro/Desktop/Claude/fosque/material-cliente/MANUAL FOSQUE ARG.pdf';
const OUT = path.join(process.cwd(), 'scripts', 'tmp');

const b64 = fs.readFileSync(PDF).toString('base64');
const browser = await chromium.launch();
const page = await browser.newPage();
await page.addScriptTag({
  url: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
});

const res = await page.evaluate(async (data64) => {
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  const data = Uint8Array.from(atob(data64), (c) => c.charCodeAt(0));
  const doc = await pdfjsLib.getDocument({ data }).promise;
  const out = [];
  for (let n = 1; n <= doc.numPages; n++) {
    const p = await doc.getPage(n);
    const opList = await p.getOperatorList();
    let paths = 0;
    let images = 0;
    for (const fn of opList.fnArray) {
      if (fn === pdfjsLib.OPS.constructPath) paths++;
      if (
        fn === pdfjsLib.OPS.paintImageXObject ||
        fn === pdfjsLib.OPS.paintInlineImageXObject
      )
        images++;
    }
    const vp = p.getViewport({ scale: 0.6 });
    const canvas = document.createElement('canvas');
    canvas.width = vp.width;
    canvas.height = vp.height;
    await p.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise;
    out.push({ n, paths, images, png: canvas.toDataURL('image/png').split(',')[1] });
  }
  return out;
}, b64);

for (const r of res) {
  fs.writeFileSync(path.join(OUT, `p${String(r.n).padStart(2, '0')}.png`), Buffer.from(r.png, 'base64'));
  console.log(`p${r.n}: ${r.paths} paths, ${r.images} imágenes`);
}
await browser.close();
