'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Video de fondo que autoplaya también en iOS. React no serializa `muted`
 * en el HTML del server (bug conocido), así que Safari bloquea el autoplay
 * y muestra el botón de play. Acá se fuerza muted por JS antes de play(),
 * se reintenta en el primer toque (modo de bajo consumo) y se re-dispara
 * cuando el video entra al viewport (iOS pausa los que salen de pantalla).
 *
 * La descarga es diferida: el `src` recién se asigna cuando el video está a
 * menos de una pantalla de entrar al viewport (hasta entonces se ve el
 * poster). Sin esto, cada visita a la home bajaba los ~10 MB de los 5 videos
 * de una, aunque el visitante nunca scrolleara — era el grueso del Fast Data
 * Transfer del proyecto en Vercel.
 */
export default function AutoVideo({
  src,
  label,
  poster,
}: {
  src: string;
  label: string;
  poster?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [cargar, setCargar] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setCargar(true);
          io.disconnect();
        }
      },
      { rootMargin: '100% 0px' },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!cargar) return;
    const v = ref.current;
    if (!v) return;

    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute('muted', '');
    const tryPlay = () => {
      if (v.paused) v.play().catch(() => {});
    };
    tryPlay();

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) tryPlay();
        }
      },
      { threshold: 0.05 },
    );
    io.observe(v);

    window.addEventListener('touchstart', tryPlay, { once: true, passive: true });
    document.addEventListener('visibilitychange', tryPlay);
    return () => {
      io.disconnect();
      window.removeEventListener('touchstart', tryPlay);
      document.removeEventListener('visibilitychange', tryPlay);
    };
  }, [cargar]);

  return (
    <video
      ref={ref}
      src={cargar ? src : undefined}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload={cargar ? 'auto' : 'none'}
      aria-label={label}
    />
  );
}
