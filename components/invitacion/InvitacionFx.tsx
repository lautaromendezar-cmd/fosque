'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Motor de animación de /invitacion (landing de campaña): fondo vivo,
 *  entrada del hero línea por línea, parallax de la foto, marquee y reveals. */
export default function InvitacionFx({ children }: { children: React.ReactNode }) {
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

      /* Entrada del hero: la pregunta baja línea por línea, la foto abre */
      gsap.from(q('.inv-hero h1 .l'), {
        y: 60,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.out',
      });
      gsap.from(q('.inv-hero .inv-media'), {
        scale: 0.94,
        opacity: 0,
        duration: 1.1,
        ease: 'power2.out',
        delay: 0.25,
      });
      gsap.from(q('.inv-hero .sub, .inv-hero .ctas'), {
        y: 24,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        delay: 0.55,
      });

      /* Parallax de la foto del hero contra el título (propiedad distinta a
         la de la entrada, así no se pisan) */
      gsap.fromTo(
        q('.inv-hero .inv-media'),
        { y: 0 },
        {
          y: -50,
          ease: 'none',
          immediateRender: false,
          scrollTrigger: {
            trigger: q('.inv-hero')[0],
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        },
      );

      /* Marquee infinito */
      gsap.to(q('.marquee .track'), { xPercent: -50, duration: 18, ease: 'none', repeat: -1 });

      /* Reveals genéricos */
      q('.inv-reveal').forEach((el) => {
        gsap.from(el, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        });
      });

      /* Las dos tarjetas de sedes, en cascada */
      gsap.from(q('.inv-sedes > *'), {
        y: 60,
        opacity: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: q('.inv-sedes')[0], start: 'top 80%' },
      });

      /* Botones finales, uno por sede */
      gsap.from(q('.inv-botones > *'), {
        y: 24,
        opacity: 0,
        stagger: 0.08,
        duration: 0.6,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: q('.inv-botones')[0], start: 'top 90%' },
      });
    },
    { scope },
  );

  return <div ref={scope}>{children}</div>;
}
