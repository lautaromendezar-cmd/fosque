'use client';

import { useState } from 'react';

/**
 * Activa/silencia el audio del video hero ("audio activable de forma
 * orgánica" del brief). El video arranca siempre muteado (requisito de
 * autoplay); esto solo tiene efecto audible cuando el MP4 real del rodaje
 * traiga pista de audio.
 */
export default function CineAudio() {
  const [on, setOn] = useState(false);

  const toggle = () => {
    const v = document.querySelector<HTMLVideoElement>('#cine video');
    if (!v) return;
    v.muted = on;
    if (!on) v.volume = 1;
    setOn(!on);
  };

  return (
    <button
      className="cine-audio"
      onClick={toggle}
      aria-label={on ? 'Silenciar video' : 'Activar sonido del video'}
      aria-pressed={on}
    >
      {on ? (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M4 9v6h4l5 5V4L8 9H4z" />
          <path
            d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M4 9v6h4l5 5V4L8 9H4z" />
          <path
            d="M16.5 9.5l5 5m0-5l-5 5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  );
}
