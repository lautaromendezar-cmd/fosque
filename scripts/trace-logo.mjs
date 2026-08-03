// Vectoriza el logo de la tapa (raster 4x) trazando contornos:
// máscara binaria → Moore neighbor tracing → simplificación RDP → paths SVG.
// Separa isologo grande (izq), mini-iso y wordmark FOSQUE (der).
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const OUT = path.join(process.cwd(), 'scripts', 'tmp');
const b64 = fs.readFileSync(path.join(OUT, 'tapa.png')).toString('base64');

const browser = await chromium.launch();
const page = await browser.newPage();

const result = await page.evaluate(async (data64) => {
  const img = new Image();
  img.src = `data:image/png;base64,${data64}`;
  await img.decode();
  const W = img.width;
  const H = img.height;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  const { data } = ctx.getImageData(0, 0, W, H);

  const black = (x, y) => {
    if (x < 0 || y < 0 || x >= W || y >= H) return false;
    const i = (y * W + x) * 4;
    return data[i] < 128 && data[i + 3] > 128;
  };

  // Moore neighbor tracing con criterio de borde por dirección de entrada
  const dirs = [
    [1, 0], [1, 1], [0, 1], [-1, 1], [0, -1] /*placeholder*/,
  ];
  // 8 direcciones en orden horario empezando por la derecha
  const D = [
    [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1],
  ];

  const visited = new Uint8Array(W * H); // marca píxeles de borde ya usados
  const contours = [];

  const trace = (sx, sy) => {
    const pts = [];
    let cx = sx;
    let cy = sy;
    let dir = 6; // veníamos de abajo (entramos por arriba en el escaneo)
    do {
      pts.push([cx, cy]);
      visited[cy * W + cx] = 1;
      // buscar el siguiente pixel negro girando desde dir-2 (backtrack) en sentido horario
      let found = false;
      for (let k = 0; k < 8; k++) {
        const nd = (dir + 6 + k) % 8; // arrancar mirando "atrás-izquierda"
        const nx = cx + D[nd][0];
        const ny = cy + D[nd][1];
        if (black(nx, ny)) {
          cx = nx;
          cy = ny;
          dir = nd;
          found = true;
          break;
        }
      }
      if (!found) break; // pixel aislado
      if (pts.length > 200000) break; // safety
    } while (cx !== sx || cy !== sy);
    return pts;
  };

  const isBoundary = (x, y) =>
    black(x, y) &&
    (!black(x + 1, y) || !black(x - 1, y) || !black(x, y + 1) || !black(x, y - 1));

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (isBoundary(x, y) && !visited[y * W + x]) {
        const pts = trace(x, y);
        if (pts.length > 40) contours.push(pts);
        // marcar todo el contorno como visitado ya lo hace trace; además
        // marcar vecinos de borde del mismo blob para no duplicar trazas
        for (const [px, py] of pts) {
          for (const [dx, dy] of D) {
            const nx = px + dx;
            const ny = py + dy;
            if (nx >= 0 && ny >= 0 && nx < W && ny < H && isBoundary(nx, ny))
              visited[ny * W + nx] = 1;
          }
        }
      }
    }
  }

  // Simplificación Ramer–Douglas–Peucker
  const rdp = (pts, eps) => {
    if (pts.length < 3) return pts;
    const sqDist = (p, a, b) => {
      let [x, y] = p;
      let [x1, y1] = a;
      let [x2, y2] = b;
      const dx = x2 - x1;
      const dy = y2 - y1;
      const len2 = dx * dx + dy * dy;
      let t = len2 ? ((x - x1) * dx + (y - y1) * dy) / len2 : 0;
      t = Math.max(0, Math.min(1, t));
      const px = x1 + t * dx;
      const py = y1 + t * dy;
      return (x - px) ** 2 + (y - py) ** 2;
    };
    const keep = new Uint8Array(pts.length);
    keep[0] = keep[pts.length - 1] = 1;
    const stack = [[0, pts.length - 1]];
    while (stack.length) {
      const [a, b] = stack.pop();
      let maxD = 0;
      let idx = -1;
      for (let i = a + 1; i < b; i++) {
        const d = sqDist(pts[i], pts[a], pts[b]);
        if (d > maxD) {
          maxD = d;
          idx = i;
        }
      }
      if (maxD > eps * eps && idx !== -1) {
        keep[idx] = 1;
        stack.push([a, idx], [idx, b]);
      }
    }
    return pts.filter((_, i) => keep[i]);
  };

  return contours.map((pts) => {
    const simple = rdp(pts, 2.2);
    const xs = pts.map((p) => p[0]);
    const ys = pts.map((p) => p[1]);
    return {
      points: simple,
      bbox: [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)],
      len: pts.length,
    };
  });
}, b64);

await browser.close();
fs.writeFileSync(path.join(OUT, 'contours.json'), JSON.stringify(result));
console.log(
  result
    .map(
      (c, i) =>
        `#${i}: ${c.len}px → ${c.points.length}pts · bbox ${c.bbox.map(Math.round).join(',')}`,
    )
    .join('\n'),
);
