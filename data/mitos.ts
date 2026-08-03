import type { Mito } from '@/components/Mitos';
import type { Sede } from './sedes';

/**
 * Copys del brief del cliente, tal cual — salvo la respuesta de "No tengo
 * tiempo": el horario completo (L-V 7 a 22, dom y feriados) solo es real en
 * Mataderos/Bragado, así que en cada landing se usa el horario de ESA sede.
 */
const base: Mito[] = [
  {
    q: '"No tengo tiempo"',
    a: '¿Tiempo para quién? ¿Tiempo para vos? Tenemos una de las grillas más completas: consultá el horario de tu sede — Mataderos abre de lunes a viernes de 7 a 22, sábados y domingos también.',
  },
  {
    q: '"No sé si Pilates es para mí"',
    a: 'Justamente: el método se adapta 100% a tus necesidades con niveles progresivos para que crezcas y te desafíes sin miedo.',
  },
  {
    q: '"No me gustan los gimnasios"',
    a: '¡A nosotros tampoco! Fosque no se parece en nada. Clases siempre con instructor capacitado y una ejecutiva que te cuida y te hace pasar un gran momento.',
  },
  {
    q: '"No me gusta hacer actividad física"',
    a: 'A nadie le gusta el esfuerzo previo, ¡lo hermoso es cómo te sentís después! Acá hacemos que todo sea llevadero para que disfrutes los beneficios por días.',
  },
  {
    q: '"¿Tengo que hacer 2 o 3 sesiones por semana?"',
    a: 'Si hiciste menos de 20 clases profesionales en los últimos años, empezar con 4 sesiones al mes por 1 a 3 meses ya te cambia la vida. Es un proceso: tu nuevo proyecto.',
  },
  {
    q: '"Tengo vergüenza"',
    a: 'Tranquila. Acá nadie juzga a nadie: somos todos personas normales en un ambiente cálido, familiar y de absoluta amabilidad.',
  },
  {
    q: '"¿Tengo que pagar un año por adelantado?"',
    a: 'Jamás. Invertís mes a mes en tu cuidado. El mes que no querés continuar, ponés en pausa tu membresía hablando personalmente con tu ejecutiva.',
  },
];

export const mitosHome = base;

export function mitosParaSede(sede: Sede): Mito[] {
  return base.map((m, i) =>
    i === 0
      ? {
          q: m.q,
          a: `¿Tiempo para quién? ¿Tiempo para vos? En ${sede.nombre} abrimos ${sede.horarioResumen}. Siempre hay un horario para vos.`,
        }
      : m,
  );
}
