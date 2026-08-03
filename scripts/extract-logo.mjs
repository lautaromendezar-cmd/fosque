// Extrae la página 1 del manual (tapa con el logo) como SVG vectorial y PNG
// de referencia, usando pdf.js dentro de Chromium.
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const PDF = 'C:/Users/Lautaro/Desktop/Claude/fosque/material-cliente/MANUAL FOSQUE ARG.pdf';
const OUT = path.join(process.cwd(), 'scripts', 'tmp');
fs.mkdirSync(OUT, { recursive: true });

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
  const p = await doc.getPage(1);
  const viewport = p.getViewport({ scale: 1 });

  // PNG de referencia a 4x
  const vp4 = p.getViewport({ scale: 4 });
  const canvas = document.createElement('canvas');
  canvas.width = vp4.width;
  canvas.height = vp4.height;
  await p.render({ canvasContext: canvas.getContext('2d'), viewport: vp4 }).promise;
  const png = canvas.toDataURL('image/png').split(',')[1];

  // SVG vectorial (sin las imágenes raster, que rompen SVGGraphics)
  const opList = await p.getOperatorList();
  const skip = new Set([
    pdfjsLib.OPS.paintImageXObject,
    pdfjsLib.OPS.paintInlineImageXObject,
    pdfjsLib.OPS.paintImageMaskXObject,
    pdfjsLib.OPS.paintImageXObjectRepeat,
  ]);
  const fnArray = [];
  const argsArray = [];
  for (let k = 0; k < opList.fnArray.length; k++) {
    if (skip.has(opList.fnArray[k])) continue;
    fnArray.push(opList.fnArray[k]);
    argsArray.push(opList.argsArray[k]);
  }
  opList.fnArray = fnArray;
  opList.argsArray = argsArray;
  const svgGfx = new pdfjsLib.SVGGraphics(p.commonObjs, p.objs);
  svgGfx.embedFonts = true;
  const svg = await svgGfx.getSVG(opList, viewport);
  return { svg: svg.outerHTML, png, w: viewport.width, h: viewport.height, pages: doc.numPages };
}, b64);

fs.writeFileSync(path.join(OUT, 'tapa.svg'), res.svg);
fs.writeFileSync(path.join(OUT, 'tapa.png'), Buffer.from(res.png, 'base64'));
console.log(`página 1 de ${res.pages} · ${res.w}x${res.h}pt · svg ${(res.svg.length / 1024).toFixed(0)}KB`);
await browser.close();
