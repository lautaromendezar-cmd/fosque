'use client';

import { useEffect } from 'react';
import { ReactLenis, useLenis } from 'lenis/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * useLenis entrega la instancia recién cuando existe (el effect depende de
 * ella). Antes corríamos el effect una sola vez al montar, cuando la
 * instancia todavía no estaba: Lenis capturaba la rueda sin loop de raf y
 * la página no scrolleaba.
 */
function LenisGsapSync() {
  const lenis = useLenis(ScrollTrigger.update);

  useEffect(() => {
    if (!lenis) return;

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      lenis.destroy(); // scroll nativo para reduced-motion
      return;
    }

    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    // Anclas internas (#sedes, #info) con scroll suave de Lenis
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const target = document.querySelector(a.hash);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -60 });
    };
    document.addEventListener('click', onClick);

    return () => {
      gsap.ticker.remove(update);
      document.removeEventListener('click', onClick);
    };
  }, [lenis]);

  return null;
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ autoRaf: false }}>
      <LenisGsapSync />
      {children}
    </ReactLenis>
  );
}
