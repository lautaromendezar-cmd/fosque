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

      const reveal = () => {
        gsap.to(q('#hero h1 .w > span'), {
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.06,
          delay: 0.1,
        });
        gsap.from(q('#hero > p, #hero .ctas'), {
          y: 24,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          delay: 0.35,
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
          gsap.set(q('#hero h1 .w > span'), { y: 0 });
        } else {
          reveal();
        }
      } else {
        sessionStorage.setItem('fosque-seen', '1');
        // dibujo del contorno del isologo real → relleno → devora la pantalla
        const fpath = q('#preloader .fmark path')[0] as unknown as SVGPathElement;
        const len = fpath.getTotalLength();
        fpath.style.strokeDasharray = `${len}`;
        fpath.style.strokeDashoffset = `${len}`;
        const tl = gsap.timeline({
          onComplete() {
            kill();
            reveal();
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

      if (reduced) return;

      /* ---- Arcos: dibujo con scrub ---- */
      q('.arcs path').forEach((el) => {
        const p = el as unknown as SVGPathElement;
        const len = p.getTotalLength();
        p.style.strokeDasharray = `${len}`;
        p.style.strokeDashoffset = `${len}`;
        gsap.to(p, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: { trigger: p.closest('.arcs'), start: 'top 90%', end: 'bottom 40%', scrub: 1 },
        });
      });

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

      /* ---- Bento hero: el video central devora la pantalla ---- */
      const bento = q('#bento')[0] as HTMLElement;
      const bentoCenter = q('.bento-center')[0] as HTMLElement;
      if (bento && bentoCenter) {
        const grid = q('.bento-grid')[0] as HTMLElement;
        const otros = q('.bento-grid .vph').filter((el) => el !== bentoCenter);

        /* entrada de las tiles */
        gsap.from(q('.bento-grid .vph'), {
          y: 60,
          opacity: 0,
          scale: 0.92,
          stagger: { each: 0.06, from: 'center' },
          duration: 0.8,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
          scrollTrigger: { trigger: bento, start: 'top 75%' },
        });

        /* geometría del tile central relativa a la sección (estable con pin) */
        const rect = () => {
          const w = bentoCenter.offsetWidth;
          const h = bentoCenter.offsetHeight;
          const cx = grid.offsetLeft + bentoCenter.offsetLeft + w / 2;
          const cy = grid.offsetTop + bentoCenter.offsetTop + h / 2;
          return { w, h, cx, cy };
        };

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: bento,
            start: 'top top',
            end: '+=200%',
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
          },
        });
        tl.to(otros, { opacity: 0, scale: 0.9, duration: 0.3, stagger: 0.02 }, 0)
          .to(
            bentoCenter,
            {
              x: () => window.innerWidth / 2 - rect().cx,
              y: () => window.innerHeight / 2 - rect().cy,
              scale: () => Math.max(window.innerWidth / rect().w, window.innerHeight / rect().h) * 1.01,
              borderRadius: 0,
              duration: 0.6,
              ease: 'power2.inOut',
            },
            0.08,
          )
          .to(q('.bento-quote'), { opacity: 1, duration: 0.22 }, 0.62)
          .from(q('.bento-quote blockquote'), { y: 46, duration: 0.24 }, 0.62)
          .from(q('.bento-quote p'), { y: 34, duration: 0.24 }, 0.68);
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
      gsap.from(q('#equipo .row > *'), {
        y: 80,
        opacity: 0,
        rotate: 4,
        scale: 0.92,
        stagger: 0.12,
        duration: 0.85,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: '#equipo .row', start: 'top 85%' },
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
