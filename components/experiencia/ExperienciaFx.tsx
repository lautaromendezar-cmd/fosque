'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { cuerpoReveals } from '@/components/invitacion/fx';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Motor de animación de /experiencia/: fondo vivo, la entrada de la primera
 *  pantalla (copy en cascada + formulario) y, para el cuerpo de abajo, los
 *  mismos reveals que en /invitacion/ y el home (./invitacion/fx). */
export default function ExperienciaFx({ children }: { children: React.ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
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

      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      gsap.from(q('.exp-copy > *'), {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        // el badge late con una animación CSS de transform: sin clearProps
        // el transform inline de GSAP la pisaría para siempre
        clearProps: 'transform,opacity',
      });
      gsap.from(q('.exp-hero .exp-form'), {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
        delay: 0.3,
        clearProps: 'transform,opacity',
      });

      cuerpoReveals(q);
    },
    { scope },
  );

  return <div ref={scope}>{children}</div>;
}
