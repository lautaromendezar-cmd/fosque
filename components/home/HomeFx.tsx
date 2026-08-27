'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ¿La home ya montó en ESTE documento? (variable de módulo: sobrevive a la
   navegación client-side, se resetea con cada carga/recarga de página) */
let homeMontoEnEsteDoc = false;

/* Segundos que la pregunta queda SOLA en pantalla antes de que se sume la
   frase central. El doc del cliente pide "0s–3s la pregunta, a los 3s el
   texto": es la pausa para procesar, así que se toca acá y en ningún otro lado. */
const HOLD_PREGUNTA = 3;

/**
 * Motor de animación de la home. El contenido llega server-rendered como
 * children; acá solo se anima (regla de oro: "use client" solo donde se anima).
 */
/* Parte un elemento en un <span> por palabra. Se hace DESDE JS y no desde el
   HTML/CSS a propósito: si el script no corre, el texto queda tal cual y se lee
   igual. Nunca ocultar con CSS algo que revela el JS.
   `mascara` envuelve cada palabra en un marco con overflow hidden, para que
   suban desde abajo como el título del hero. */
const partirEnPalabras = (el: HTMLElement, mascara: boolean) => {
  if (el.dataset.partido) return Array.from(el.querySelectorAll<HTMLElement>('.pal'));
  const palabras = (el.textContent ?? '').trim().split(/\s+/);
  el.textContent = '';
  const salida: HTMLElement[] = [];
  palabras.forEach((palabra, i) => {
    const marco = document.createElement('span');
    marco.style.display = 'inline-block';
    if (mascara) {
      marco.style.overflow = 'hidden';
      marco.style.verticalAlign = 'top';
      /* los display van con line-height 0.95: sin este aire el marco le corta
         la cola a la "g" de "gimnasio" y a la "q" de "Fosque" */
      marco.style.paddingBottom = '0.16em';
      marco.style.marginBottom = '-0.16em';
    }
    const pal = document.createElement('span');
    pal.className = 'pal';
    pal.style.display = 'inline-block';
    pal.textContent = palabra;
    marco.appendChild(pal);
    el.appendChild(marco);
    if (i < palabras.length - 1) el.appendChild(document.createTextNode(' '));
    salida.push(pal);
  });
  el.dataset.partido = '1';
  return salida;
};

export default function HomeFx({ children }: { children: React.ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const q = gsap.utils.selector(scope);

      /* Nav + WhatsApp flotante: ocultos durante la intro (autoAlpha también
         corta los clicks mientras tanto), entran con los botones del hero. */
      const mostrarNav = (delay = 0) =>
        gsap.to(q('nav, #wa-box, #wa'), {
          autoAlpha: 1,
          duration: 0.8,
          ease: 'power2.out',
          delay,
          clearProps: 'opacity,visibility',
        });

      /* Estado final del hero, sin intro: visita repetida dentro de la misma
         sesión (volver a la home navegando). Todo visible de una. */
      const reveal = () => {
        gsap.set(q('.cine-content'), { opacity: 1 });
        gsap.set(q('.cine-content h1 .w > span'), { y: 0 });
        gsap.set(q('.cine-content .sub, .cine-content .ctas'), { autoAlpha: 1, y: 0 });
        mostrarNav(0.2);
      };

      /* Intro del hero: la pregunta queda sola en pantalla el tiempo de leerla
         y el resto del copy se SUMA encima en capas, sin reemplazarla (doc del
         cliente 2026-08-17). Desde el 27-ago corre sobre el fondo crema con los
         arcos, no sobre el video. */
      const film = () => {
        // el bloque de copy entra fundido, no de golpe
        const tl = gsap.timeline({ delay: 0.15 });
        tl.to(q('.cine-content'), { opacity: 1, duration: 0.9, ease: 'sine.out' }, 0)
          // la pregunta sube palabra por palabra dentro de ese mismo fundido
          .to(
            q('.cine-content h1 .w > span'),
            { y: 0, duration: 0.95, ease: 'power3.out', stagger: 0.07 },
            0,
          )
          // 2º tiempo: la pregunta ya asentada, se suma la frase central
          .to(
            q('.cine-content .sub'),
            { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power2.out' },
            `+=${HOLD_PREGUNTA}`,
          )
          // 3º tiempo: emergen los botones (y con ellos el nav y el WhatsApp)
          .to(
            q('.cine-content .ctas'),
            { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out' },
            '+=0.9',
          )
          .add(() => mostrarNav(), '<');
      };

      /* ---- PRELOADER + TRAILER ----
         La intro corre en la primera visita de la sesión y también al
         RECARGAR la página (recargar = querés verla de nuevo). Volver a la
         home navegando dentro del sitio va directo al estado final. */
      const pre = q('#preloader')[0];
      const counter = q('#counter')[0];
      const kill = () => {
        pre?.remove();
        counter?.remove();
      };
      const navType = (
        performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
      )?.type;
      const replay = navType === 'reload' && !homeMontoEnEsteDoc;
      homeMontoEnEsteDoc = true;
      if (reduced || (sessionStorage.getItem('fosque-seen') && !replay)) {
        kill();
        if (reduced) {
          gsap.set(q('.cine-content h1 .w > span'), { y: 0 });
        } else {
          // vuelta a la home sin recargar: directo al estado final
          reveal();
        }
      } else {
        sessionStorage.setItem('fosque-seen', '1');
        // el fondo NO se oculta: cuando el preloader se desvanece la escena ya
        // está ahí, en paleta, y no hay salto de fondo. Lo que arranca oculto
        // es el copy que se suma después, más el nav y el WhatsApp.
        gsap.set(q('.cine-content .sub, .cine-content .ctas'), { autoAlpha: 0, y: 20 });
        gsap.set(q('nav, #wa-box, #wa'), { autoAlpha: 0 });
        // dibujo del contorno del isologo real → relleno → devora la pantalla
        const fpath = q('#preloader .fmark path')[0] as unknown as SVGPathElement;
        const len = fpath.getTotalLength();
        fpath.style.strokeDasharray = `${len}`;
        fpath.style.strokeDashoffset = `${len}`;
        const tl = gsap.timeline({
          onComplete() {
            kill();
            film();
          },
        });
        tl.to(fpath, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' }, 0)
          .to(counter, { innerText: 100, duration: 1.2, snap: 'innerText', ease: 'power1.inOut' }, 0)
          .to(fpath, { fillOpacity: 1, duration: 0.35, ease: 'power1.in' }, 0.95)
          .to(q('#preloader .fmark'), { scale: 22, opacity: 0, duration: 0.9, ease: 'power3.in' }, 1.35)
          // disolvencia larga: el preloader crema se funde con la escena que ya
          // está debajo, así el paso es un fundido y no un corte de luminancia
          // (medido: sin este tramo el salto era de golpe)
          .to(pre, { opacity: 0, duration: 0.9, ease: 'sine.inOut' }, 1.7);
      }

      /* ---- FONDO VIVO: el body muta de color por capítulo ---- */
      q('section[data-bg]').forEach((sec) => {
        const el = sec as HTMLElement;
        ScrollTrigger.create({
          trigger: el,
          start: 'top 55%',
          end: 'bottom 55%',
          onEnter: () =>
            gsap.to('body', { backgroundColor: el.dataset.bg, duration: 0.8, overwrite: 'auto' }),
          onEnterBack: () =>
            gsap.to('body', { backgroundColor: el.dataset.bg, duration: 0.8, overwrite: 'auto' }),
        });
      });

      if (reduced) {
        // sin animación, los counters muestran el valor final directo
        q('[data-count]').forEach((el) => {
          (el as HTMLElement).innerText = Number(
            (el as HTMLElement).dataset.count,
          ).toLocaleString('es-AR');
        });
        return;
      }

      /* ---- Manifiesto: la 2ª pantalla del hero, se descubre al scrollear ----
         El fade-up genérico que había acá no se notaba: desde que el hero es
         crema plano, se pasa de una pantalla quieta a otra igual. Ahora el
         título sube palabra por palabra (mismo idioma que el hero) y el párrafo
         se ENCIENDE atado al scroll, así el que lo lee es el propio scroll. */
      const mfTitulo = q('#manifiesto .mf-titulo')[0] as HTMLElement | undefined;
      if (mfTitulo) {
        gsap.fromTo(
          partirEnPalabras(mfTitulo, true),
          { yPercent: 115 },
          {
            yPercent: 0,
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.08,
            scrollTrigger: { trigger: '#manifiesto', start: 'top 72%', once: true },
          },
        );
      }
      const mfTexto = q('#manifiesto .mf-texto')[0] as HTMLElement | undefined;
      if (mfTexto) {
        gsap.fromTo(
          partirEnPalabras(mfTexto, false),
          { opacity: 0.22 },
          {
            opacity: 1,
            ease: 'none',
            stagger: 0.08,
            scrollTrigger: {
              trigger: '#manifiesto',
              start: 'top 62%',
              /* termina cuando el bloque queda bien encuadrado, no cuando ya se
                 está yendo: con 'top 8%' las últimas palabras seguían apagadas
                 con la sección centrada en pantalla */
              end: 'top 20%',
              scrub: 0.6,
            },
          },
        );
      }

      /* ---- Counters historia ---- */
      q('[data-count]').forEach((el) => {
        gsap.fromTo(
          el,
          { innerText: 0 },
          {
            innerText: +(el as HTMLElement).dataset.count!,
            duration: 1.6,
            snap: 'innerText',
            ease: 'power1.out',
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
            onUpdate() {
              (el as HTMLElement).innerText = Number(
                (el as HTMLElement).innerText,
              ).toLocaleString('es-AR');
            },
          },
        );
      });

      /* ---- Beneficios: entrada con leve 3D ---- */
      q('.beneficio').forEach((card) => {
        gsap.from(card, {
          y: 70,
          opacity: 0,
          rotateX: 8,
          transformOrigin: 'top center',
          duration: 0.8,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
          scrollTrigger: { trigger: card, start: 'top 88%' },
        });
      });

      /* ---- Hero: respiración lentísima de los arcos ----
         Ocupa el lugar del zoom que tenía el video. Ciclo largo y amplitud
         corta: tiene que notarse solo si mirás fijo, si no vuelve a ser
         invasivo, que es justo lo que el cliente rechazó.
         La rotación va EXPLÍCITA en el fromTo: el CSS ya rota .rings.tl 180° y
         un tween que tocara solo scale reescribe el transform entero y se la
         comería. Y el origen se deja en el centro: anclarlo en la esquina de
         los círculos parecía más prolijo, pero con rotate(180deg) el pivote
         corrido tira el elemento entero fuera de cuadro (verificado con
         captura: los arcos rosas se iban al otro extremo de la pantalla). */
      (
        [
          ['#cine .rings.tl', 180, 3.5],
          ['#cine .rings.br', 0, -3],
        ] as const
      ).forEach(([sel, rot, giro], i) => {
        const el = q(sel)[0];
        if (!el) return;
        gsap.fromTo(
          el,
          { rotation: rot, scale: 1 },
          {
            rotation: rot + giro,
            scale: 1.06,
            duration: 24,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
            delay: i * 3,
          },
        );
      });

      /* ---- Sedes: carrusel horizontal con pin (solo desktop) ---- */
      const mm = gsap.matchMedia();
      mm.add('(min-width: 901px)', () => {
        const track = q('.sedes-track')[0];
        if (!track) return;
        const dist = () => track.scrollWidth - window.innerWidth;
        gsap.to(track, {
          x: () => -dist(),
          ease: 'none',
          scrollTrigger: {
            trigger: '#sedes-pin',
            start: 'top top',
            end: () => `+=${dist()}`,
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
          },
        });
      });
      gsap.from(q('.sede-card'), {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: { trigger: '#sedes-pin', start: 'top 75%' },
      });

      /* ---- Mitos: filas en cascada ---- */
      gsap.from(q('.mito'), {
        y: 40,
        opacity: 0,
        stagger: 0.07,
        duration: 0.7,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: '#mitos', start: 'top 72%' },
      });

      /* ---- Equipo: cards en cascada ---- */
      q('#equipo .row').forEach((row) => {
        gsap.from(row.children, {
          y: 80,
          opacity: 0,
          rotate: 4,
          scale: 0.92,
          stagger: 0.12,
          duration: 0.85,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: { trigger: row, start: 'top 85%' },
        });
      });

      /* ---- Reveal genérico ---- */
      q('.sedes-head h2, #mitos h2, #equipo h2, #final h2').forEach((el) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
        });
      });
    },
    { scope },
  );

  return <div ref={scope}>{children}</div>;
}
