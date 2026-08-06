'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Motor de animación de /franquicia (hero sandwich + marquee + counters). */
export default function FranquiciaFx({ children }: { children: React.ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const q = gsap.utils.selector(scope);

      /* Fondo vivo */
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

      /* Entrada hero: los títulos "abren" el sandwich */
      gsap.from(q('.sede-hero .title-back'), { y: 60, opacity: 0, duration: 1, ease: 'power3.out' });
      gsap.from(q('.sede-hero .title-front'), {
        y: -40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.15,
      });
      gsap.from(q('.sede-hero .frame'), {
        scale: 0.9,
        opacity: 0,
        duration: 1.1,
        ease: 'power2.out',
        delay: 0.1,
      });
      gsap.from(q('.sede-hero .sub, .sede-hero .ctas'), {
        y: 24,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        delay: 0.5,
      });

      /* Parallax del video hero contra los títulos */
      gsap.to(q('.sede-hero .title-back'), {
        y: -60,
        ease: 'none',
        scrollTrigger: { trigger: q('.sede-hero')[0], start: 'top top', end: 'bottom top', scrub: 1 },
      });
      gsap.to(q('.sede-hero .title-front'), {
        y: 40,
        ease: 'none',
        scrollTrigger: { trigger: q('.sede-hero')[0], start: 'top top', end: 'bottom top', scrub: 1 },
      });

      /* Marquee infinito */
      gsap.to(q('.marquee .track'), { xPercent: -50, duration: 18, ease: 'none', repeat: -1 });

      /* Counters */
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

      /* Cards del modelo en cascada */
      gsap.from(q('.fr-card'), {
        y: 60,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: '.fr-grid', start: 'top 80%' },
      });

      /* Formulario */
      gsap.from(q('.fr-form'), {
        y: 50,
        opacity: 0,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: { trigger: '#contacto', start: 'top 70%' },
      });
    },
    { scope },
  );

  return <div ref={scope}>{children}</div>;
}
