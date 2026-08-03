'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Motor de animación de las landings de sede (contenido server-rendered). */
export default function SedeFx({ children }: { children: React.ReactNode }) {
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

      if (reduced) return;

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

      /* Cards info + mapa */
      q('.card').forEach((c) => {
        gsap.from(c, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: c, start: 'top 88%' },
        });
      });
      gsap.from(q('.mapa'), {
        scale: 0.95,
        opacity: 0,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: { trigger: q('.mapa')[0], start: 'top 85%' },
      });

      /* Galería: carrusel horizontal con pin (solo desktop) */
      const mm = gsap.matchMedia();
      mm.add('(min-width: 901px)', () => {
        const rail = q('#galeria .rail')[0];
        if (!rail) return;
        const dist = () => rail.scrollWidth - window.innerWidth;
        gsap.to(rail, {
          x: () => -dist(),
          ease: 'none',
          scrollTrigger: {
            trigger: '#galeria',
            start: 'top top',
            end: () => `+=${dist()}`,
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
          },
        });
      });
      gsap.from(q('#galeria .vph'), {
        y: 60,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: '#galeria', start: 'top 70%' },
      });

      /* Equipo: cards en cascada */
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
    },
    { scope },
  );

  return <div ref={scope}>{children}</div>;
}
