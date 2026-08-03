import fs from 'node:fs';
import path from 'node:path';
import Vph from './Vph';

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
  return (
    <div className={`vph media ${className}`.trim()}>
      {file.endsWith('.mp4') || file.endsWith('.webm') ? (
        <video src={src} autoPlay muted loop playsInline aria-label={alt} />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} loading="lazy" />
      )}
    </div>
  );
}
