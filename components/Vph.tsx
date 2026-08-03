/**
 * Placeholder de video/foto con el guion de rodaje anotado.
 * Cuando exista el material real, este componente se reemplaza por
 * <video> (MP4 H.265 + WebM, poster, preload="metadata") manteniendo la clase.
 */
export default function Vph({
  shot,
  play = true,
  className = '',
}: {
  shot: string;
  play?: boolean;
  className?: string;
}) {
  return (
    <div className={`vph ${className}`.trim()}>
      {play && <div className="play" />}
      <div className="shot">{shot}</div>
    </div>
  );
}
