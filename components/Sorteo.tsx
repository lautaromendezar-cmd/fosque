'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useLenis } from 'lenis/react';
import { sedes } from '@/data/sedes';

/* ---------------------------------------------------------------------------
   SORTEO DE ESTRENO — pop-up con fecha de muerte horneada adentro

   SE APAGA SOLO, y acá eso no es un lujo: el sitio se publica arrastrando
   `deploy-ftp/` por FTP a mano, así que un pop-up que dependiera de una subida
   para desaparecer obligaría a alguien a acordarse el 11/09 de rebuildear y
   volver a subir 16 MB. Pasada la fecha este componente no devuelve NADA y el
   sorteo deja de existir para todo el mundo sin tocar el hosting.

   El corte: "hasta el 10/09" se lee como que el 10 participa completo, así que
   muere el 11/09 a las 00:00 de Argentina = 03:00 UTC (UTC-3). Se compara
   contra el reloj del visitante, que es lo único que hay sin backend: si
   alguien tiene la fecha mal en la máquina lo ve un día de más o de menos.
   Para un pop-up de sorteo alcanza; la alternativa sería pedirle la hora a un
   servicio ajeno y sumar una dependencia que puede fallar.

   Para verlo fuera de fecha —mostrárselo al cliente, screenshots, el smoke
   test— alcanza con `?sorteo=ver` en la URL: saltea la fecha y el "ya lo
   cerré".
--------------------------------------------------------------------------- */
const FIN = Date.parse('2026-09-11T03:00:00Z');

/* Clave versionada a propósito: si el año que viene hay otro sorteo se cambia
   el sufijo y el pop-up vuelve a aparecerle a todos, incluso a quien cerró
   este. */
const VISTO = 'fosque-sorteo-estreno-2026-09';

/* Cuánto espera antes de aparecer, por página. En la home no hay número fijo:
   espera el aviso de HomeFx, porque el preloader + el trailer duran unos 6s y
   un pop-up encima le arruina la película a la primera visita. El timeout de
   la home es sólo la red de seguridad por si el aviso nunca llega. */
const ESPERA_OTRAS = 2200;
const TOPE_HOME = 12000;

const FOCABLES = 'a[href], button:not([disabled])';

export default function Sorteo() {
  const pathname = usePathname();
  const lenis = useLenis();
  const [abierto, setAbierto] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const focoPrevio = useRef<HTMLElement | null>(null);

  const cerrar = useCallback(() => {
    setAbierto(false);
    // "cerré" es lo único que cuenta como visto: si se fue de la página sin
    // cerrarlo, vuelve a aparecer. Entrar a un Instagram también cuenta.
    try {
      localStorage.setItem(VISTO, '1');
    } catch {
      /* modo privado o storage bloqueado: que no aparezca dos veces es un lujo,
         que el pop-up explote no es una opción */
    }
  }, []);

  /* ---- ¿toca mostrarlo, y cuándo? -------------------------------------
     `abierto` arranca en false SIEMPRE, así el HTML estático que se sube por
     FTP no lleva ni la palabra "sorteo" adentro: Google está justo ahora
     decidiendo qué indexar de fosque.com y no queremos que el snippet hable de
     un sorteo terminado, ni que quede texto muerto en las 9 páginas cuando
     pase la fecha. Si el JS no corre no aparece nada y el sitio queda intacto:
     el pop-up falla del lado seguro. */
  useEffect(() => {
    const forzar = new URLSearchParams(window.location.search).get('sorteo') === 'ver';
    if (!forzar) {
      if (!Number.isFinite(FIN) || Date.now() >= FIN) return;
      try {
        if (localStorage.getItem(VISTO)) return;
      } catch {
        /* si no se puede leer, se muestra: es lo que menos molesta */
      }
    }

    // la foto se pide ANTES de abrir, así el panel no entra con un hueco. Son
    // dos recortes de la misma placa y se precarga el que va a tocar.
    new Image().src = matchMedia('(max-width: 720px)').matches
      ? '/media/sorteo-premio-ancho.jpg'
      : '/media/sorteo-premio.jpg';

    let t = 0;
    const abrir = () => {
      window.clearTimeout(t);
      setAbierto(true);
    };

    if (pathname === '/') {
      window.addEventListener('fosque:intro-lista', abrir, { once: true });
      t = window.setTimeout(abrir, TOPE_HOME);
    } else {
      t = window.setTimeout(abrir, ESPERA_OTRAS);
    }

    return () => {
      window.clearTimeout(t);
      window.removeEventListener('fosque:intro-lista', abrir);
    };
  }, [pathname]);

  /* ---- mientras está abierto ------------------------------------------ */
  useEffect(() => {
    if (!abierto) return;
    focoPrevio.current = document.activeElement as HTMLElement | null;

    // el fondo no scrollea detrás del panel. `overflow: hidden` en el body no
    // alcanza: el scroll del root lo maneja Lenis, hay que frenarlo a él.
    lenis?.stop();
    document.documentElement.classList.add('sorteo-abierto');

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        cerrar();
        return;
      }
      if (e.key !== 'Tab' || !panel.current) return;
      // el foco queda atrapado adentro: mientras el pop-up está abierto, el
      // resto de la página no existe para el teclado
      const focos = Array.from(panel.current.querySelectorAll<HTMLElement>(FOCABLES));
      if (!focos.length) return;
      const primero = focos[0];
      const ultimo = focos[focos.length - 1];
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    };
    document.addEventListener('keydown', onKey);

    // el foco entra en el panel y no en el primer botón: así un lector de
    // pantalla lee de qué se trata antes de ofrecer los Instagram
    panel.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.classList.remove('sorteo-abierto');
      lenis?.start();
      focoPrevio.current?.focus();
    };
  }, [abierto, lenis, cerrar]);

  if (!abierto) return null;

  return (
    <div
      id="sorteo"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) cerrar();
      }}
    >
      <div
        className="sorteo-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sorteo-t"
        tabIndex={-1}
        ref={panel}
        /* el panel scrollea por dentro en pantallas bajas, y Lenis tiene que
           dejarlo en paz (mismo recurso que los raíles de la home) */
        data-lenis-prevent
      >
        <button type="button" className="sorteo-x" onClick={cerrar} aria-label="Cerrar">
          <span aria-hidden="true">&times;</span>
        </button>

        <div className="sorteo-foto">
          {/* Dos recortes de la placa que salió en redes. El vertical llega
              hasta el manuscrito y trae adentro el sello "TERMO + MATE
              STANLEY" de la placa; la banda de mobile toma el mate y el cuerpo
              del termo, y ahí el sello no entra (queda arriba, pegado al
              mate), así que en mobile lo pone el CSS con tipografía. Ninguno de
              los dos incluye el "¡3 FORMAS DE PARTICIPAR!", que contradice los
              dos pasos de este pop-up. */}
          <picture>
            <source media="(max-width: 720px)" srcSet="/media/sorteo-premio-ancho.jpg" />
            <img
              src="/media/sorteo-premio.jpg"
              alt="Termo y mate Stanley en rosa, el premio del sorteo"
              width="560"
              height="920"
              decoding="async"
            />
          </picture>
          <p className="sorteo-premio">
            Termo + mate
            <br />
            Stanley
          </p>
        </div>

        <div className="sorteo-txt">
          <p className="sorteo-kicker">Sorteo de estreno</p>
          <h2 id="sorteo-t">¡Estrenamos Web y lo queremos celebrar con vos!</h2>
          <p className="sorteo-intro">
            Te damos la bienvenida a nuestra nueva casa digital. Queremos que conozcas todo lo
            que Fosque tiene para vos y, de paso, te llevás un Combo Stanley.
          </p>

          <p className="sorteo-como">¿Cómo participar del sorteo?</p>
          <ol className="sorteo-pasos">
            <li>Explorá nuestra web y viví la experiencia Fosque.</li>
            <li>Seguinos en Instagram en la cuenta de tu sede más cercana.</li>
          </ol>

          <div className="sorteo-igs">
            {sedes
              .filter((s) => s.instagram)
              .map((s) => (
                <a
                  key={s.slug}
                  className="sorteo-ig"
                  href={s.instagram as string}
                  target="_blank"
                  rel="noopener"
                  onClick={cerrar}
                >
                  <span className="ig-sede">{s.nombre}</span>
                  <span className="ig-arroba">
                    @{new URL(s.instagram as string).pathname.replaceAll('/', '')}
                  </span>
                  <span className="ig-flecha" aria-hidden="true">
                    &rarr;
                  </span>
                </a>
              ))}
          </div>

          <p className="sorteo-hasta">
            Tenés tiempo de participar hasta el <strong>10/09</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
