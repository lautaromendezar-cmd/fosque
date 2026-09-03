// Sirve deploy-ftp/ por HTTP para probarlo ANTES de subirlo por FTP.
//   npm run probar
// Imita a Apache: carpeta -> index.html, y 404.html si la ruta no existe.
// OJO: abrir index.html con doble clic (file://) NO sirve — el sitio usa rutas
// absolutas (/_next/, /media/) y se ve sin estilos.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { exec } from 'node:child_process';

const RAIZ = path.join(import.meta.dirname, '..', 'deploy-ftp');
const PORT = Number(process.env.PROBAR_PORT ?? 4180);
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.ico': 'image/x-icon',
};

if (!fs.existsSync(RAIZ)) {
  console.error('\n  No existe deploy-ftp/. Corre primero:  npm run ftp\n');
  process.exit(1);
}

http.createServer((req, res) => {
  const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let file = path.join(RAIZ, url);
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  let code = 200;
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    file = path.join(RAIZ, '404.html');
    code = 404;
  }
  res.writeHead(code, { 'Content-Type': MIME[path.extname(file)] ?? 'application/octet-stream' });
  res.end(fs.readFileSync(file));
}).listen(PORT, () => {
  const url = `http://localhost:${PORT}/`;
  console.log(`\n  Sitio Fosque sirviendose desde deploy-ftp/\n  ${url}\n`);
  console.log('  Revisar:');
  console.log(`   ${url}                 (colores, logo y arcos: si ves texto pelado falta _next/)`);
  console.log(`   ${url}equipo/          ${url}franquicia/    ${url}novedades/`);
  console.log(`   ${url}jose-hernandez/  ${url}emilio-castro/ ${url}nunez/`);
  console.log(`   ${url}no-existe        (tiene que dar el 404 propio)\n`);
  console.log('  Para cortar: Ctrl+C o cerra la ventana.\n');
  if (process.platform === 'win32') exec(`start "" "${url}"`, { shell: 'cmd.exe' });
});
