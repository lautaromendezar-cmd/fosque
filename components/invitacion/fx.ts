import gsap from 'gsap';

/** Reveals del cuerpo de la página de aterrizaje (`<InvitacionCuerpo />`).
 *
 *  Vive suelto porque desde el 26-09 el cuerpo se renderiza en dos páginas
 *  con motores distintos: InvitacionFx en /invitacion/ y HomeFx en el index.
 *  Los dos llaman a esto con su propio `q` (el selector scopeado de GSAP), así
 *  las animaciones quedan atadas al scope de cada página y no se pisan.
 *
 *  Nada de esto es imprescindible para leer la página: todos los tweens son
 *  `from` con `clearProps`, así que si el JS no corre el contenido igual se ve.
 *  Quien llama ya descartó `prefers-reduced-motion`. */
export function cuerpoReveals(q: (sel: string) => Element[]) {
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

  /* Las dos tarjetas de sucursales, en cascada */
  if (q('.inv-sedes')[0]) {
    gsap.from(q('.inv-sedes > *'), {
      y: 60,
      opacity: 0,
      stagger: 0.12,
      duration: 0.8,
      ease: 'power2.out',
      clearProps: 'transform,opacity',
      scrollTrigger: { trigger: q('.inv-sedes')[0], start: 'top 80%' },
    });
  }

  /* Botones finales, uno por sucursal */
  if (q('.inv-botones')[0]) {
    gsap.from(q('.inv-botones > *'), {
      y: 24,
      opacity: 0,
      stagger: 0.08,
      duration: 0.6,
      ease: 'power2.out',
      clearProps: 'transform,opacity',
      scrollTrigger: { trigger: q('.inv-botones')[0], start: 'top 90%' },
    });
  }
}
