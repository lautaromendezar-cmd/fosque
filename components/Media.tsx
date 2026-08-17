import fs from 'node:fs';
import path from 'node:path';
import Vph from './Vph';
import AutoVideo from './AutoVideo';

/**
 * Renderiza el asset real desde public/media/ si existe (video loop mudo o
 * imagen); si no, cae al placeholder Vph con el guion de rodaje. Se resuelve
 * en build (export estático), así que agregar un archivo requiere rebuild.
 */
export default function Media({
  file,
  shot,
  className = '',
}: {
  file: string;
  shot: string;
  className?: string;
}) {
  const abs = path.join(process.cwd(), 'public', 'media', file);
  if (!fs.existsSync(abs)) {
    return <Vph shot={shot} className={className} />;
  }
  const src = `/media/${file}`;
  const alt = shot.replace(/[🎬📷]/gu, '').split('·')[0].trim();
  /* Poster del video: el primer frame en JPG (scripts/gen-posters.mjs). Sin
     esto el <video> pinta negro mientras bufferea, justo lo que el cliente
     marcó como corte técnico. Si no existe el archivo, no se pasa el atributo. */
  const posterFile = file.replace(/\.(mp4|webm)$/, '-poster.jpg');
  const poster = fs.existsSync(path.join(process.cwd(), 'public', 'media', posterFile))
    ? `/media/${posterFile}`
    : undefined;
  return (
    <div className={`vph media ${className}`.trim()}>
      {file.endsWith('.mp4') || file.endsWith('.webm') ? (
        <AutoVideo src={src} label={alt} poster={poster} />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} loading="lazy" />
      )}
    </div>
  );
}
