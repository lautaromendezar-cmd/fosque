'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

/** Motor de animación de /experiencia/: una sola pantalla, así que solo la
 *  entrada — el copy sube en cascada y el formulario aparece al lado. */
export default function ExperienciaFx({ children }: { children: React.ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const q = gsap.utils.selector(scope);

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
      gsap.from(q('.exp-form'), {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
        delay: 0.3,
        clearProps: 'transform,opacity',
      });
    },
    { scope },
  );

  return <div ref={scope}>{children}</div>;
}
