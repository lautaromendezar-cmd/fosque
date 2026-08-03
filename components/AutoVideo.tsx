'use client';

import { useEffect, useRef } from 'react';

/**
 * Video de fondo que autoplaya también en iOS. React no serializa `muted`
 * en el HTML del server (bug conocido), así que Safari bloquea el autoplay
 * y muestra el botón de play. Acá se fuerza muted por JS antes de play(),
 * se reintenta en el primer toque (modo de bajo consumo) y se re-dispara
 * cuando el video entra al viewport (iOS pausa los que salen de pantalla).
 */
export default function AutoVideo({ src, label }: { src: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
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
  }, []);

  return (
    <video ref={ref} src={src} autoPlay muted loop playsInline preload="auto" aria-label={label} />
  );
}
