/**
 * Genera el poster (primer frame en JPG) de cada video de public/media/.
 *
 * Por qué: un <video> sin `poster` pinta NEGRO mientras bufferea. Con el hero
 * a pantalla completa eso es exactamente el "corte técnico a fondo negro" que
 * el cliente pidió eliminar. El poster hace que lo primero que se vea sea ya
 * el frame 1 del video, en paleta.
 *
 * Uso:  node scripts/gen-posters.mjs          (solo los que faltan)
 *       node scripts/gen-posters.mjs --force  (rehace todos)
 *
 * Requiere ffmpeg en el PATH. Correr después de reemplazar cualquier video
 * del rodaje, y volver a buildear (Media.tsx resuelve el poster en build).
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const dir = path.join(process.cwd(), 'public', 'media');
const force = process.argv.includes('--force');

const videos = fs.readdirSync(dir).filter((f) => /\.(mp4|webm)$/.test(f));
if (!videos.length) {
  console.log('No hay videos en public/media/.');
  process.exit(0);
}

let hechos = 0;
for (const v of videos) {
  const poster = v.replace(/\.(mp4|webm)$/, '-poster.jpg');
  const destino = path.join(dir, poster);
  if (fs.existsSync(destino) && !force) {
    console.log(`· ${poster} ya existe`);
    continue;
  }
  execFileSync(
    'ffmpeg',
    [
      '-y',
      '-i', path.join(dir, v),
      '-frames:v', '1',
      // escala a 1280 de ancho: el poster solo tiene que tapar el hueco del
      // primer frame, no competir en calidad con el video
      '-vf', 'scale=1280:-2',
      '-q:v', '4',
      destino,
    ],
    { stdio: 'pipe' },
  );
  const kb = (fs.statSync(destino).size / 1024).toFixed(0);
  console.log(`✓ ${poster} (${kb} KB)`);
  hechos++;
}

console.log(`\n${hechos} poster(s) generados de ${videos.length} video(s).`);
