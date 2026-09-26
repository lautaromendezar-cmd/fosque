'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { cuerpoReveals } from './fx';

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

      /* Marquee y reveals del cuerpo: compartidos con el index (ver ./fx) */
      cuerpoReveals(q);
    },
    { scope },
  );

  return <div ref={scope}>{children}</div>;
}
