import type { Mito } from '@/components/Mitos';
import type { Sede } from './sedes';

/**
 * Copys del brief del cliente (lineamientos 2026-08), tal cual — salvo la
 * respuesta de "No tengo tiempo": la grilla completa (L-V 7 a 22, dom y
 * feriados) solo es real en José Hernández, así que en cada landing se usa el
 * horario de ESA sede (mitosParaSede).
 */
const base: Mito[] = [
  {
    q: '"No tengo tiempo"',
    a: '¿Tiempo para quién? ¿Tiempo para vos? Tenemos la grilla más completa: lunes a viernes de 7:00 a 22:00 hs, sábados desde las 9:00 hs, domingos a la mañana ¡y abrimos feriados!',
  },
  {
    q: '"No sé si Pilates es para mí"',
    a: 'El método se adapta 100% a vos con niveles progresivos para que crezcas y te desafíes sin ningún tipo de miedo.',
  },
  {
    q: '"No me gustan los gimnasios"',
    a: '¡A nosotros tampoco! Fosque no se parece en nada a un gimnasio tradicional. Clases guiadas por instructores capacitados y una ejecutiva que te cuida en todo momento.',
  },
  {
    q: '"No me gusta hacer actividad física"',
    a: 'A nadie le gusta el esfuerzo previo; ¡lo hermoso es cómo te sentís después! Acá hacemos que todo sea llevadero para que lo disfrutes.',
  },
  {
    q: '"¿Tengo que ir muchas veces por semana?"',
    a: 'Si hiciste menos de 20 clases en los últimos años, empezar con 4 sesiones al mes por 1 a 3 meses ya te cambia la vida. Es tu nuevo proyecto.',
  },
  {
    q: '"Tengo vergüenza"',
    a: 'Tranquila. Acá no hay cuerpos para juzgar; somos personas reales en un ambiente cálido, familiar y de absoluta amabilidad.',
  },
  {
    q: '"¿Tengo que pagar un año por adelantado?"',
    a: 'Jamás. Invertís mes a mes en tu cuidado. El mes que no quieras continuar, ponés en pausa tu membresía hablando directamente con tu ejecutiva.',
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
