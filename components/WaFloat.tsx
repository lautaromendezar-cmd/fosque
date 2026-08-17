'use client';

import { useEffect, useRef, useState } from 'react';
import { sedes, waLink } from '@/data/sedes';

function WaIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.4c1.4.8 3 1.2 4.8 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2zm5.6 14.2c-.2.7-1.2 1.2-2 1.4-.5.1-1.2.2-3.6-.8-3-1.2-4.9-4.3-5.1-4.5-.1-.2-1.2-1.6-1.2-3.1s.8-2.2 1-2.5c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .7.5.2.6.8 2.1.9 2.2.1.2.1.3 0 .5s-.2.4-.3.5l-.5.6c-.2.2-.3.4-.1.7.2.3.8 1.4 1.8 2.2 1.2 1.1 2.3 1.4 2.6 1.6.3.1.5.1.7-.1.2-.2.8-.9 1-1.2.2-.3.4-.3.7-.2l2.1 1c.3.1.5.2.6.4 0 .1 0 .7-.2 1.2z" />
    </svg>
  );
}

/**
 * WhatsApp flotante. Por defecto abre el selector de sede del brief
 * ("¿Con qué sede querés hablar?"); con `directo` va derecho al número
 * recibido (para las landings de sede, donde el contexto ya es la sede).
 */
export default function WaFloat({ numero, directo = false }: { numero: string; directo?: boolean }) {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (directo) {
    return (
      <a
        id="wa"
        href={`https://wa.me/${numero}`}
        target="_blank"
        rel="noopener"
        aria-label="WhatsApp"
      >
        <WaIcon />
      </a>
    );
  }

  return (
    <div id="wa-box" ref={box}>
      <div className={`wa-panel${open ? ' open' : ''}`} role="dialog" aria-label="Elegí tu sede">
        <p className="wa-q">¿Con qué sede querés hablar?</p>
        {sedes.map((s) => (
          <a
            key={s.slug}
            href={waLink(s.whatsapp, `Hola Fosque ${s.nombre}! Quiero más info`)}
            target="_blank"
            rel="noopener"
          >
            <b>{s.nombre}</b>
            <small>
              {s.codigo}
              {s.barrio !== s.nombre && ` · ${s.barrio}`}
            </small>
          </a>
        ))}
        <a
          className="wa-gral"
          href={waLink(numero, 'Hola Fosque! Quiero más info')}
          target="_blank"
          rel="noopener"
        >
          Consulta general
        </a>
      </div>
      <button id="wa" aria-label="WhatsApp" aria-expanded={open} onClick={() => setOpen(!open)}>
        <WaIcon />
      </button>
    </div>
  );
}
