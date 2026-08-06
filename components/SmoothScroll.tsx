'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
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
  const pathname = usePathname();

  useEffect(() => {
    if (!lenis) return;

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      lenis.destroy(); // scroll nativo para reduced-motion
      return;
    }

    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    // Anclas dentro de la misma página (#sedes, /equipo/#profe estando en
    // /equipo) con scroll suave de Lenis. Las de otra página siguen su curso:
    // Next navega y el effect de ruta de abajo hace el scroll al montar.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href*="#"]') as HTMLAnchorElement | null;
      if (!a || !a.hash) return;
      const norm = (p: string) => p.replace(/\/$/, '');
      if (norm(a.pathname) !== norm(location.pathname)) return;
      const target = document.querySelector(a.hash);
      if (!target) return;
      e.preventDefault();
      history.pushState(null, '', a.hash);
      lenis.scrollTo(target as HTMLElement, { offset: -80 });
    };
    document.addEventListener('click', onClick);

    return () => {
      gsap.ticker.remove(update);
      document.removeEventListener('click', onClick);
    };
  }, [lenis]);

  // Ancla al llegar a una página nueva (ej. home → /equipo/#profe): el scroll
  // nativo de Next pelea con el raf de Lenis, así que lo hace Lenis cuando el
  // layout del route nuevo ya está montado.
  useEffect(() => {
    if (!lenis) return;
    // con reduced-motion Lenis está destruido: el scroll nativo ya se encarga
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.location.hash) return;
    const target = document.querySelector(window.location.hash);
    if (!target) return;
    const t = setTimeout(() => lenis.scrollTo(target as HTMLElement, { offset: -80 }), 120);
    return () => clearTimeout(t);
  }, [lenis, pathname]);

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
