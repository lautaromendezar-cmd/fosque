import gsap from 'gsap';
import { partirEnPalabras } from '@/components/texto';

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

  /* CTA de cierre: "¡Activate! Te lo merecés." entra palabra por palabra desde
     abajo, con máscara. Mismo idioma que el título del manifiesto y que el
     hero, no un efecto nuevo: es el remate de la página y el cliente pidió
     que se moviera (26-09). `once` para que no se rearme al volver a pasar. */
  const cta = q('#anotate h2')[0] as HTMLElement | undefined;
  if (cta) {
    gsap.fromTo(
      partirEnPalabras(cta, true),
      { yPercent: 115 },
      {
        yPercent: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.09,
        scrollTrigger: { trigger: cta, start: 'top 85%', once: true },
      },
    );
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
