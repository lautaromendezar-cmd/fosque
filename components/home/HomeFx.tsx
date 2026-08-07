'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Motor de animación de la home. El contenido llega server-rendered como
 * children; acá solo se anima (regla de oro: "use client" solo donde se anima).
 */
export default function HomeFx({ children }: { children: React.ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const q = gsap.utils.selector(scope);

      /* Estado final del hero: la pregunta + botones, queda fijo. */
      const reveal = () => {
        gsap.to(q('.cine-content'), { opacity: 1, duration: 0.5 });
        gsap.to(q('.cine-content h1 .w > span'), {
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.07,
          delay: 0.1,
        });
        gsap.from(q('.cine-content .ctas'), {
          y: 22,
          opacity: 0,
          duration: 0.7,
          ease: 'power2.out',
          delay: 0.6,
        });
      };

      /* Trailer en 3 actos: la pregunta sola sobre telón negro → el video
         "abre la escena" junto con la 2ª frase → al cierre entra el estado
         final con los botones. */
      const film = () => {
        const frases = q('.cine-frases .frase');
        const escena = q('#cine .cine-bg, #cine .cine-veil, #cine .cine-audio');
        const hold = [1.4, 0.9, 1.4]; // la pregunta y el cierre respiran más
        const tl = gsap.timeline({ delay: 0.25, onComplete: reveal });
        frases.forEach((f, i) => {
          tl.fromTo(
            f,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out' },
          );
          if (i === 1) {
            // el video entra con la 2ª frase (leve anticipo, tipo apertura de escena)
            tl.to(escena, { opacity: 1, duration: 1.3, ease: 'power2.inOut' }, '<-0.35');
          }
          tl.to(f, { opacity: 0, y: -26, duration: 0.5, ease: 'power2.in' }, `+=${hold[i]}`);
        });
      };

      /* ---- PRELOADER (solo primera visita por sesión) ---- */
      const pre = q('#preloader')[0];
      const counter = q('#counter')[0];
      const kill = () => {
        pre?.remove();
        counter?.remove();
      };
      if (reduced || sessionStorage.getItem('fosque-seen')) {
        kill();
        if (reduced) {
          gsap.set(q('.cine-content h1 .w > span'), { y: 0 });
        } else {
          // visita repetida en la sesión: directo al estado final, sin trailer
          reveal();
        }
      } else {
        sessionStorage.setItem('fosque-seen', '1');
        // telón negro listo ANTES de que el preloader se desvanezca (si no,
        // el video se ve un instante detrás y se apaga de golpe)
        gsap.set(q('#cine .cine-bg, #cine .cine-veil, #cine .cine-audio'), { opacity: 0 });
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
          .to(pre, { opacity: 0, duration: 0.4 }, 1.8);
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

      /* ---- Hero cine: zoom lentísimo del video, respiración de película ---- */
      const cineVideo = q('#cine video')[0];
      if (cineVideo) {
        gsap.fromTo(
          cineVideo,
          { scale: 1 },
          { scale: 1.07, duration: 16, ease: 'sine.inOut', yoyo: true, repeat: -1 },
        );
      }

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
