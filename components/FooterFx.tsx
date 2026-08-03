'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Entrada animada del footer: el bloque sube y las columnas caen en cascada. */
export default function FooterFx({ children }: { children: React.ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const q = gsap.utils.selector(scope);
      const foot = q('footer')[0];
      if (!foot) return;

      gsap.from(foot, {
        y: 90,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: foot, start: 'top 96%' },
      });
      gsap.from(q('.cols > div'), {
        y: 50,
        opacity: 0,
        stagger: 0.12,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: { trigger: foot, start: 'top 82%' },
      });
      const rings = q('.rings')[0];
      if (rings) {
        gsap.fromTo(
          rings,
          { rotate: -14, scale: 0.9 },
          {
            rotate: 0,
            scale: 1,
            ease: 'none',
            scrollTrigger: { trigger: foot, start: 'top bottom', end: 'bottom bottom', scrub: 1 },
          },
        );
      }
    },
    { scope },
  );

  return <div ref={scope}>{children}</div>;
}
