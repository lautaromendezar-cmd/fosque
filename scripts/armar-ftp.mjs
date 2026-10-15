// Arma el paquete listo para subir por FTP al hosting de Fosque.
//   npm run ftp
// Hace: build con el dominio correcto -> copia out/ a deploy-ftp/ -> suma el
// .htaccess -> saca lo que no va. Es reproducible: se puede correr en cualquier
// PC despues de un git pull.
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const RAIZ = path.join(import.meta.dirname, '..');
const OUT = path.join(RAIZ, 'out');
const DEST = path.join(RAIZ, 'deploy-ftp');

// Se hornea en el HTML (og:image y canonical). Si falta, el fallback es
// localhost:3000 y el preview de WhatsApp queda roto. Por eso va aca fijo y no
// se confia en que alguien se acuerde de exportar la variable.
const SITE_URL = 'https://fosque.com';

// El form de Experiencia manda el lead a EVO por este PHP (en el preview de
// Vercel lo hace api/lead.mjs). El token NO viaja en el paquete: evo-config.php
// va a mano a la raiz del FTP, fuera de htdocs (ver deploy/evo-config.ejemplo.php).
const LEAD_URL = '/api/lead.php';

// hero.mp4 quedo huerfano el 27-ago (el hero ya no usa video). Son 6,6 MB que
// no pide nadie: no se suben. Sigue en el repo por si el cliente lo repesca.
const NO_SUBIR = ['media/hero.mp4'];

console.log(`\n[1/3] Build con NEXT_PUBLIC_SITE_URL=${SITE_URL} ...\n`);
fs.rmSync(OUT, { recursive: true, force: true });
execSync('npx next build', {
  cwd: RAIZ,
  stdio: 'inherit',
  env: { ...process.env, NEXT_PUBLIC_SITE_URL: SITE_URL, NEXT_PUBLIC_LEAD_URL: LEAD_URL },
});

console.log('\n[2/3] Armando deploy-ftp/ ...');
fs.rmSync(DEST, { recursive: true, force: true });
fs.cpSync(OUT, DEST, { recursive: true });
fs.copyFileSync(path.join(RAIZ, 'deploy', '.htaccess'), path.join(DEST, '.htaccess'));
fs.cpSync(path.join(RAIZ, 'deploy', 'api'), path.join(DEST, 'api'), { recursive: true });
for (const f of NO_SUBIR) fs.rmSync(path.join(DEST, f), { force: true });

console.log('\n[3/3] Verificando ...');
const home = fs.readFileSync(path.join(DEST, 'index.html'), 'utf8');
const problemas = [];
if (!home.includes(SITE_URL)) problemas.push(`el HTML no contiene ${SITE_URL} (og:image mal)`);
if (home.includes('localhost')) problemas.push('quedo un localhost en el HTML');
for (const req of ['_next', 'media', 'equipo', '.htaccess', '404.html', 'api/lead.php']) {
  if (!fs.existsSync(path.join(DEST, req))) problemas.push(`falta ${req}`);
}
const buscar = (d, nombre) =>
  fs.readdirSync(d, { withFileTypes: true }).some((e) =>
    e.isDirectory() ? buscar(path.join(d, e.name), nombre) : e.name === nombre,
  );
if (buscar(DEST, 'evo-config.php')) problemas.push('hay un evo-config.php en el paquete (el token no se sube asi)');
const chunks = path.join(DEST, '_next', 'static', 'chunks');
const conLead = (d) =>
  fs.readdirSync(d, { withFileTypes: true }).some((e) =>
    e.isDirectory() ? conLead(path.join(d, e.name)) : fs.readFileSync(path.join(d, e.name), 'utf8').includes(LEAD_URL),
  );
if (!conLead(chunks)) problemas.push(`el form no apunta a ${LEAD_URL}`);
if (problemas.length) {
  console.error('\n  ✗ ' + problemas.join('\n  ✗ '));
  process.exit(1);
}

const peso = (d) =>
  fs.readdirSync(d, { withFileTypes: true }).reduce((t, e) => {
    const p = path.join(d, e.name);
    return t + (e.isDirectory() ? peso(p) : fs.statSync(p).size);
  }, 0);

console.log(`\n  ✓ Listo: ${DEST}`);
console.log(`    ${(peso(DEST) / 1024 / 1024).toFixed(1)} MB\n`);
console.log('  Probalo antes de subir:  npm run probar');
console.log('  Despues, con FileZilla: arrastra el CONTENIDO de deploy-ftp/');
console.log('  a la raiz web. NO subas LEEME-SUBIDA.txt (queda publico).\n');
