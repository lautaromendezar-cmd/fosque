export type Horario = { dias: string; horas: string };

export type Sede = {
  slug: string;
  /** Nombre comercial (⚠️ confirmar con cliente vs dirección real) */
  nombre: string;
  /** Palabra corta para el hero sandwich (detrás/delante del video) */
  heroBack: string;
  heroFront: string;
  barrio: string;
  /** Código oficial de la sede (doc del cliente 2026-08: FJH / FEC / FNN) */
  codigo: string;
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
  /** Membresía F: el modelo de la sede (Reformer, o integral en José Hernández) */
  membresia: Membresia;
  /** Video de la sala de fuerza, para la mitad derecha del díptico del hero
   *  (26-09). Solo en sucursales con sala propia. */
  videoFuerzaFile?: string;
  shotFuerza?: string;
  /** Sala de fuerza y cardio propia (hoy solo José Hernández): sección extra en la landing */
  fuerza?: Fuerza;
};

/**
 * Sección "Fuerza y Cardio" de una sede con sala propia. Pedido del cliente
 * (16-sep-2026): presentarla como COMPLEMENTO de Fosque Reformer, no como un
 * gimnasio (la home dice "Fosque no es un gimnasio"). TODO el copy es del
 * cliente (WhatsApp y PDF del 21-sep-2026), tal cual lo mandó: su título
 * "Fuerza, Cardio + Pilates Reformer: Único en Fosque José Hernández" se
 * partió en `eyebrow` + `titulo`; en puntos y ventajas, `lead`/`t` es lo que
 * puso antes de los dos puntos y `d` lo que sigue.
 * Sigue sin confirmar si la sala entra en la membresía de Reformer.
 */
export type Fuerza = {
  eyebrow: string;
  titulo: string;
  /** "Promesa" del cliente: una línea grande debajo del video */
  promesa: string;
  /** "Ventajas" del cliente: qué te da la combinación */
  ventajas: { t: string; d: string }[];
  /** Tarjetas: qué hay en la sala */
  puntos: { t: string; lead?: string; d: string }[];
  cta: string;
  ctaNota: string;
  waTexto: string;
  /** Díptico del hero: Fuerza y Cardio + Reformer una al lado de la otra
   * ("vendemos la combinación, no por separado" — PDF del cliente 21-sep).
   * heroFuerza reemplazó al video sede-jh-fuerza.mp4 (sigue en public/media/
   * sin usar, por si vuelve); heroReformer reusa una foto ya en vivo. */
  heroFuerza: { file: string; shot: string };
  heroReformer: { file: string; shot: string };
  fotos: { file: string; shot: string }[];
};

/**
 * "Membresía F" (PDF del cliente, 21-sep-2026). Son DOS modelos distintos y
 * él pidió mostrarlos como tales: Reformer (Emilio Castro y Núñez) y
 * entrenamiento integral (José Hernández, que suma Fuerza y Cardio). Texto
 * suyo palabra por palabra; en `beneficios`, `t` es lo que puso antes de los
 * dos puntos y `d` lo que sigue.
 */
export type Membresia = {
  titulo: string;
  texto: string[];
  beneficios: { t: string; d: string }[];
};

/**
 * Acceso a la plataforma de socios (el botón "Ingresá a tu Perfil" del nav y
 * del footer, y "Ingresar a mi Membresía F" en la sección Membresía).
 * ⚠️ PENDIENTE DEL CLIENTE desde agosto: nunca mandó la URL real del login
 * de EVO. En el PDF del 21-sep puso https://socios.fosquereformer.com, pero
 * ese dominio NO EXISTE (ni siquiera está registrado fosquereformer.com).
 * Hasta que llegue la URL real, queda en '#'.
 */
export const PLATAFORMA_URL = '#';

const MEMBRESIA_BASE = {
  titulo: 'Tu pasaporte a un nuevo estilo de vida para sentirte mejor todos los días.',
  acompanamiento: {
    t: 'Acompañamiento Personalizado',
    d: 'Profes y Ejecutivas Fosque guiándote con amabilidad y profesionalismo día a día, semana a semana.',
  },
  reserva: {
    t: 'Reserva Inteligente',
    d: 'Gestión rápida y simple de tus horarios a través de nuestra App y plataforma digital.',
  },
  garantia: {
    t: 'Garantía de Clases',
    d: 'Agendá y administrá tus sesiones dentro del mes con total flexibilidad.',
  },
};

/** Emilio Castro y Núñez: Pilates Reformer */
const MEMBRESIA_REFORMER: Membresia = {
  titulo: MEMBRESIA_BASE.titulo,
  texto: [
    'Ser parte de la comunidad Fosque es elegir transformar tu vida. La combinación de ejercicio físico, motivación y acompañamiento constante genera resultados reales y duraderos.',
    'Diseñamos nuestras membresías garantizando la disponibilidad de clases para que accedas a la máxima calidad en Pilates Reformer al mejor precio del mercado, asegurando siempre tu lugar reservado y guiado por un profesional F.',
  ],
  beneficios: [
    MEMBRESIA_BASE.acompanamiento,
    MEMBRESIA_BASE.reserva,
    MEMBRESIA_BASE.garantia,
    {
      t: 'Acceso Boutique',
      d: 'Disfrutá de un ambiente agradable, salones climatizados, aromaterapia y equipamiento exclusivo de Pilates Reformer.',
    },
  ],
};

/** José Hernández: Fuerza, Cardio + Reformer */
const MEMBRESIA_INTEGRAL: Membresia = {
  titulo: MEMBRESIA_BASE.titulo,
  texto: [
    'Ser parte de la comunidad Fosque es elegir transformar tu vida. La combinación perfecta de Pilates Reformer, Fuerza y Cardio, junto a la motivación y el acompañamiento constante, genera resultados reales y duraderos.',
    'Diseñamos nuestras membresías garantizando la disponibilidad de clases para que accedas a la máxima calidad de entrenamiento integral al mejor precio del mercado, asegurando siempre tu lugar reservado y guiado por un profesional F.',
  ],
  beneficios: [
    {
      t: 'Entrenamiento Integral (Fuerza, Cardio + Reformer)',
      d: 'Acceso al método completo que combina la fluidez del Pilates Reformer con zonas equipadas de Fuerza y Cardio para potenciar tu vitalidad.',
    },
    MEMBRESIA_BASE.acompanamiento,
    MEMBRESIA_BASE.reserva,
    MEMBRESIA_BASE.garantia,
    {
      t: 'Acceso Boutique',
      d: 'Disfrutá de un ambiente agradable, salones climatizados, aromaterapia y equipamiento exclusivo de Pilates Reformer, peso libre y cintas de cardio.',
    },
  ],
};

export const WA_GENERAL = '5491137719572';

export const sedes: Sede[] = [
  {
    slug: 'jose-hernandez',
    nombre: 'José Hernández',
    heroBack: 'Fosque',
    /* 26-09: decía 'Mataderos' (el barrio) y el cliente lo marcó: el hero
       tiene que decir la sucursal. El barrio pasa a la bajada de abajo. */
    heroFront: 'José Hernández',
    barrio: 'Mataderos',
    codigo: 'FJH',
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
    instagram: 'https://www.instagram.com/fosque.josehernandez/',
    descripcion:
      'La sucursal más completa de la red: Fosque Reformer + Fuerza y Cardio, con sala de musculación propia. Abierta de lunes a lunes para que el tiempo nunca sea excusa.',
    claim: 'La más potente',
    colorFondo: '#F5E3CB',
    videoFile: 'sede-jose-hernandez.mp4',
    /* 26-09: vuelve sede-jh-fuerza.mp4, que había quedado huérfano el 21-sep
       cuando el hero de la sección Fuerza pasó a ser un díptico de fotos.
       Acá es la mitad de Fuerza y Cardio del hero de la sucursal, y así el
       hero no repite las dos fotos de la sección que viene justo abajo. */
    videoFuerzaFile: 'sede-jh-fuerza.mp4',
    shotFuerza: '🎬 VIDEO SALA DE FUERZA · Recorrido por la sala de musculación y la zona cardio',
    shotHero:
      '🎬 VIDEO SEDE · Travelling de entrada: puerta → recepción → sala Reformer → sala de fuerza · Un solo plano, gimbal, hora dorada',
    shotHome: '🎬 Fachada + travelling de entrada · Hora dorada',
    galeria: [
      { file: 'galeria-jh-reformer.jpg', shot: '📷 Sala Reformer en clase · plano fijo lateral' },
      { file: 'galeria-jh-fuerza.jpg', shot: '📷 Detalle sala de fuerza · discos y barra' },
      { file: 'galeria-jh-recepcion.jpg', shot: '📷 Recepción con ejecutiva sonriendo' },
      { file: 'galeria-jh-detalle.jpg', shot: '📷 Detalle equipamiento Método Fosque' },
      { file: 'galeria-jh-salida.jpg', shot: '📷 Alumnas saliendo felices · slow motion' },
    ],
    membresia: MEMBRESIA_INTEGRAL,
    fuerza: {
      eyebrow: 'Único en Fosque José Hernández',
      /* 26-09: el cliente lo pidió al revés — Reformer primero. */
      titulo: 'Pilates Reformer + Fuerza y Cardio.',
      promesa: 'La combinación perfecta para mejorar tu vida.',
      ventajas: [
        {
          t: 'Energía y Movilidad',
          d: 'Ganá movilidad corporal y activá más energía para tu día a día.',
        },
        {
          t: 'Salud y Bienestar',
          d: 'Descontracturá el cuerpo, comenzá a respirar profundo y disfrutá de dormir mejor.',
        },
        {
          t: 'Vitalidad Emocional',
          d: 'Aumentá la alegría, mejorá tu estado de ánimo y reencontrate con una actitud positiva.',
        },
        {
          t: 'Transformación Integral',
          d: 'Despertá la fuerza física e interior y conectá con tu mejor versión.',
        },
      ],
      cta: '¡Anotate ahora!',
      ctaNota: 'Semana de invitación a la experiencia',
      puntos: [
        {
          t: 'SALA DE FUERZA',
          lead: 'Equipamiento de fuerza y peso libre',
          d: 'Diseñado para ganar fuerza de forma progresiva. Hoy está comprobado que aumentar la fuerza y la masa muscular es clave para elevar la calidad de vida y favorecer la longevidad.',
        },
        {
          t: 'CARDIO',
          lead: 'Cintas (con y sin motor), bicicletas fijas y elípticos',
          d: 'Equipamiento ideal para fortalecer el corazón, renovar la vitalidad y activar más energía para disfrutar tu día a día.',
        },
        {
          t: 'SIEMPRE CON INSTRUCTOR',
          lead: 'Acompañamiento personalizado',
          d: 'Nunca entrenás sola; siempre hay un profesional del equipo guiándote, corrigiendo tu técnica y acompañándote en cada sesión.',
        },
      ],
      waTexto:
        'Hola! Quiero anotarme a la Semana de invitación de Fuerza y Cardio en José Hernández',
      heroFuerza: {
        file: 'fuerza-jh-grupo.jpg',
        shot: '📷 Sala de fuerza · alumnas entrenando, la mayoría en movimiento, una sonriendo a cámara',
      },
      heroReformer: {
        file: 'galeria-jh-reformer.jpg',
        shot: '📷 Sala Reformer en clase · la otra mitad de la combinación',
      },
      fotos: [
        { file: 'fuerza-jh-cardio.jpg', shot: '📷 Zona cardio · alumna en la cinta, de espaldas' },
        { file: 'fuerza-jh-profe.jpg', shot: '📷 Instructor guiando en la polea' },
        { file: 'fuerza-jh-maquinas.jpg', shot: '📷 Sala de máquinas en profundidad' },
      ],
    },
  },
  {
    slug: 'emilio-castro',
    nombre: 'Emilio Castro',
    heroBack: 'Fosque',
    heroFront: 'E. Castro',
    barrio: 'Mataderos',
    codigo: 'FEC',
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
    marquee: ['FOSQUE REFORMER', 'NIVELES 1 · 2 · 3', 'EVALUACIÓN SIN CARGO', 'AMBIENTE CÁLIDO'],
    placeId: 'ChIJAT7pAFfIvJURJROxKVu3WyU',
    instagram: 'https://www.instagram.com/fosque.emiliocastro/',
    descripcion:
      'Un espacio íntimo y cálido dedicado por completo a Fosque Reformer, la evolución de Pilates. Clases siempre con instructor y una ejecutiva que te acompaña.',
    claim: 'Íntima y cálida',
    colorFondo: '#F8DDE0',
    videoFile: 'sede-emilio-castro.mp4',
    shotHero:
      '🎬 VIDEO SEDE · Steadicam entre camas Reformer en clase · Luz natural, ritmo suave',
    shotHome: '🎬 Interior sala Reformer · Steadicam entre camas',
    galeria: [
      { file: 'galeria-ec-reformer.jpg', shot: '📷 Sala Reformer en clase · plano fijo lateral' },
      { file: 'galeria-ec-recepcion.jpg', shot: '📷 Recepción con ejecutiva sonriendo' },
      { file: 'galeria-ec-detalle.jpg', shot: '📷 Detalle resortes y carro Reformer' },
      { file: 'galeria-ec-salida.jpg', shot: '📷 Alumnas saliendo felices · slow motion' },
    ],
    membresia: MEMBRESIA_REFORMER,
  },
  {
    slug: 'nunez',
    nombre: 'Núñez',
    heroBack: 'Fosque',
    heroFront: 'Núñez',
    barrio: 'Núñez',
    codigo: 'FNN',
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
    marquee: ['FOSQUE REFORMER', 'NIVELES 1 · 2 · 3', 'EVALUACIÓN SIN CARGO', 'ZONA NORTE'],
    placeId: 'ChIJgxgtyCC0vJURBp2OL0nQzA0',
    instagram: 'https://www.instagram.com/fosque_nunez/',
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
    membresia: MEMBRESIA_REFORMER,
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
