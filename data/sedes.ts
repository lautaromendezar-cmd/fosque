export type Horario = { dias: string; horas: string };

export type Sede = {
  slug: string;
  /** Nombre comercial (⚠️ confirmar con cliente vs dirección real) */
  nombre: string;
  /** Palabra corta para el hero sandwich (detrás/delante del video) */
  heroBack: string;
  heroFront: string;
  barrio: string;
  numero: string; // "01", "02", "03"
  direccion: string;
  direccionPendiente: boolean; // ⚠️ nombre comercial no coincide con calle del pin
  whatsapp: string; // solo dígitos, formato wa.me
  whatsappDisplay: string;
  rating: string;
  reviews: number;
  horarios: Horario[];
  horarioResumen: string;
  disciplinas: string[];
  /** Disciplinas extra para el marquee de la landing */
  marquee: string[];
  placeId: string;
  instagram: string | null; // pendiente de cliente
  descripcion: string;
  claim: string;
  colorFondo: string; // tinte de fondo de su capítulo en la home
  videoFile: string; // asset en public/media/ (cae a placeholder si no existe)
  shotHero: string; // guion de rodaje del video hero
  shotHome: string; // guion del plano en la home
  galeria: { file: string; shot: string }[];
};

export const WA_GENERAL = '5491137719572';

export const sedes: Sede[] = [
  {
    slug: 'jose-hernandez',
    nombre: 'José Hernández',
    heroBack: 'Fosque',
    heroFront: 'Mataderos',
    barrio: 'Mataderos',
    numero: '01',
    direccion: 'Bragado 5952, CABA',
    direccionPendiente: true,
    whatsapp: '5491137719572',
    whatsappDisplay: '+54 9 11 3771-9572',
    rating: '4.7',
    reviews: 620,
    horarios: [
      { dias: 'Lunes a Viernes', horas: '7:00 – 22:00' },
      { dias: 'Sábados', horas: '9:00 – 18:00' },
      { dias: 'Domingos', horas: 'hasta 17:00' },
      { dias: 'Feriados', horas: '¡Abrimos!' },
    ],
    horarioResumen: 'L a V 7:00–22:00 · Sáb 9:00–18:00 · Dom hasta 17:00',
    disciplinas: ['Fosque Reformer', 'Fuerza y Cardio'],
    marquee: ['FOSQUE REFORMER', 'FUERZA Y CARDIO', 'NIVELES 1 · 2 · 3', 'ABIERTO FERIADOS'],
    placeId: 'ChIJEXzKSQfJvJUR7XX8NQLpogI',
    instagram: null,
    descripcion:
      'La sede más completa de la red: Fosque Reformer + Fuerza y Cardio, con sala de musculación propia. Abierta de lunes a lunes para que el tiempo nunca sea excusa.',
    claim: 'La más potente',
    colorFondo: '#F5E3CB',
    videoFile: 'sede-jose-hernandez.mp4',
    shotHero:
      '🎬 VIDEO SEDE · Travelling de entrada: puerta → recepción → sala Reformer → sala de fuerza · Un solo plano, gimbal, hora dorada',
    shotHome: '🎬 Fachada + travelling de entrada · Hora dorada',
    galeria: [
      { file: 'galeria-reformer.jpg', shot: '📷 Sala Reformer en clase · plano fijo lateral' },
      { file: 'galeria-fuerza.jpg', shot: '📷 Sala de fuerza · paneo lento' },
      { file: 'galeria-recepcion.jpg', shot: '📷 Recepción con ejecutiva sonriendo' },
      { file: 'galeria-detalle.jpg', shot: '📷 Detalle equipamiento Método Fosque' },
      { file: 'galeria-salida.jpg', shot: '📷 Alumnas saliendo felices · slow motion' },
    ],
  },
  {
    slug: 'emilio-castro',
    nombre: 'Emilio Castro',
    heroBack: 'Fosque',
    heroFront: 'E. Castro',
    barrio: 'Mataderos',
    numero: '02',
    direccion: 'Andalgalá 1395, CABA',
    direccionPendiente: true,
    whatsapp: '5491121570202',
    whatsappDisplay: '+54 11 2157-0202',
    rating: '4.6',
    reviews: 395,
    horarios: [
      { dias: 'Lunes a Viernes', horas: '8:00 – 21:00' },
      { dias: 'Sábados', horas: '9:00 – 13:00' },
    ],
    horarioResumen: 'L a V 8:00–21:00 · Sáb 9:00–13:00',
    disciplinas: ['Fosque Reformer'],
    marquee: ['FOSQUE REFORMER', 'NIVELES 1 · 2 · 3', 'CLASE DE DIAGNÓSTICO', 'AMBIENTE CÁLIDO'],
    placeId: 'ChIJAT7pAFfIvJURJROxKVu3WyU',
    instagram: null,
    descripcion:
      'Un espacio íntimo y cálido dedicado por completo a Fosque Reformer, la evolución de Pilates. Clases siempre con instructor y una ejecutiva que te acompaña.',
    claim: 'Íntima y cálida',
    colorFondo: '#F8DDE0',
    videoFile: 'sede-emilio-castro.mp4',
    shotHero:
      '🎬 VIDEO SEDE · Steadicam entre camas Reformer en clase · Luz natural, ritmo suave',
    shotHome: '🎬 Interior sala Reformer · Steadicam entre camas',
    galeria: [
      { file: 'galeria-reformer.jpg', shot: '📷 Sala Reformer en clase · plano fijo lateral' },
      { file: 'galeria-recepcion.jpg', shot: '📷 Recepción con ejecutiva sonriendo' },
      { file: 'galeria-detalle.jpg', shot: '📷 Detalle resortes y carro Reformer' },
      { file: 'galeria-salida.jpg', shot: '📷 Alumnas saliendo felices · slow motion' },
    ],
  },
  {
    slug: 'nunez',
    nombre: 'Núñez',
    heroBack: 'Fosque',
    heroFront: 'Núñez',
    barrio: 'Núñez',
    numero: '03',
    direccion: '11 de Septiembre 3635, CABA',
    direccionPendiente: false,
    whatsapp: '5491121584266',
    whatsappDisplay: '+54 11 2158-4266',
    rating: '4.7',
    reviews: 186,
    horarios: [
      { dias: 'Lunes a Viernes', horas: '8:00 – 21:00' },
      { dias: 'Sábados', horas: '8:00 – 13:00' },
    ],
    horarioResumen: 'L a V 8:00–21:00 · Sáb 8:00–13:00',
    disciplinas: ['Fosque Reformer'],
    marquee: ['FOSQUE REFORMER', 'NIVELES 1 · 2 · 3', 'CLASE DE DIAGNÓSTICO', 'ZONA NORTE'],
    placeId: 'ChIJgxgtyCC0vJURBp2OL0nQzA0',
    instagram: null,
    descripcion:
      'Fosque llega a zona norte: Fosque Reformer en un espacio luminoso a metros del río, para que empieces el día moviéndote.',
    claim: 'Luminosa',
    colorFondo: '#DCEAEE',
    videoFile: 'sede-nunez.mp4',
    shotHero:
      '🎬 VIDEO SEDE · Amanecer en Núñez, llegada de alumnas · Drone corto opcional · Luz dorada',
    shotHome: '🎬 Amanecer en Núñez, llegada de alumnas · Drone corto opcional',
    galeria: [
      { file: 'galeria-reformer.jpg', shot: '📷 Sala Reformer en clase · plano fijo lateral' },
      { file: 'galeria-recepcion.jpg', shot: '📷 Recepción con ejecutiva sonriendo' },
      { file: 'galeria-detalle.jpg', shot: '📷 Detalle equipamiento Método Fosque' },
      { file: 'galeria-salida.jpg', shot: '📷 Alumnas saliendo felices · slow motion' },
    ],
  },
];

export function getSede(slug: string): Sede | undefined {
  return sedes.find((s) => s.slug === slug);
}

export function waLink(numero: string, texto: string): string {
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
}

export function mapsLink(placeId: string): string {
  return `https://www.google.com/maps/place/?q=place_id:${placeId}`;
}

/** Embed sin API key: consulta por dirección (place_id requiere key en el Embed API) */
export function mapsEmbed(direccion: string): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(direccion)}&output=embed`;
}
