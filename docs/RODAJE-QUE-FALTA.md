# Qué exportar del rodaje y con qué nombre — Mataderos (FJH + FEC)

Material en bruto: `Desktop/Fosque` (99 ARW + 296 clips, 1080p a **119,88 fps**
con audio). Todo lo que se exporte va a `public/media/` **con el nombre exacto
de la primera columna**: el sitio los busca por nombre. Después:

```bash
node scripts/gen-posters.mjs   # primer frame de cada video (evita el frame negro)
npm run build
node scripts/smoke.mjs && node scripts/check-hero.mjs
```

`components/Media.tsx` cae solo al placeholder si un archivo no existe, así que
se puede ir reemplazando de a uno sin romper nada.

---

## 🎬 VIDEOS (6) — todos mudos salvo el hero

Formato: **MP4 H.264, yuv420p, 1920×1080, 24 o 30 fps, ~3-5 Mbps** (3-6 MB).
Loop invisible: que el primer y el último plano se parezcan.

| Archivo | Dónde se ve | Encuadre | Duración | Qué tiene que mostrar |
| --- | --- | --- | --- | --- |
| `hero.mp4` | Home, pantalla completa | **16:9, acción al CENTRO** (en celular se recorta a vertical y se pierden los bordes) | **20-30 s** ⚠️ | Relato continuo sin cortes bruscos: rutina y cansancio → llegada a Fosque → transformación, risas, abrazo. Luz cálida. **ÚNICO CON AUDIO** |
| `sede-jose-hernandez.mp4` | Tarjeta de sede en home + hero de `/jose-hernandez/` | 16:9 horizontal | 8-15 s | Travelling de entrada en un solo plano: puerta → recepción → sala Reformer → sala de fuerza |
| `sede-emilio-castro.mp4` | Tarjeta de sede en home + hero de `/emilio-castro/` | 16:9 horizontal | 8-15 s | Steadicam entre las camas Reformer en clase, luz natural, ritmo suave |
| `historia.mp4` | Sección "Nuestra historia" (home) | **Casi cuadrado**, algo vertical | 10-20 s | Equipo, comunidad, caras conocidas. Es el bloque de los 24 años |
| `metodo.mp4` | Sección "El Programa Fosque" (home) | **Casi cuadrado** | 8-15 s | Detalle de manos, resortes, deslizamiento del carro. Macro + plano general de clase |
| `franquicia.mp4` | Hero de `/franquicia/` | 16:9 horizontal | 8-15 s | Sede en hora pico: clase llena, recepción en movimiento, sonrisas. Cierre en fachada |

**Sobre `hero.mp4`**: hoy el clip de IA dura 8 s y se reproduce a 0,55x para que
el loop no se vea durante la intro. Cuando traiga audio hay que dejarlo a
velocidad normal (si no, la pista se deforma), y ahí la intro dura ~9 s: por eso
el clip real tiene que durar **20 s o más**. Avisame cuando esté y toco las dos
constantes (`HERO_RATE` y `HERO_CON_AUDIO`).

`sede-nunez.mp4` NO está en la lista: esa sede no se filmó y sigue con IA.

---

## 📷 FOTOS DEL EQUIPO (5) — verticales

Formato: **JPG, vertical 3:4, ~1200×1600, calidad 80** (200-400 KB).
Se ven recortadas a 3:4 y a 4:5, así que dejá aire arriba y abajo.

| Archivo | Dónde se ve | Qué tiene que mostrar |
| --- | --- | --- |
| `equipo-1.jpg` | `/equipo` + landings de sede | Retrato de instructora, fondo limpio |
| `equipo-2.jpg` | Home, `/equipo`, landings | **Ejecutiva en recepción**, atendiendo o sonriendo |
| `equipo-3.jpg` | Home, `/equipo`, landings | **Instructor corrigiendo postura** a una alumna |
| `equipo-4.jpg` | `/equipo` + landings | Profes de sala juntos, plano de grupo |
| `equipo-mantenimiento.jpg` | `/equipo`, grupo "Personal de Mantenimiento" | **HOY NO EXISTE**: hoy muestra un placeholder. Persona de mantenimiento trabajando, sala impecable |

---

## 📷 FOTOS DE GALERÍA (11) — verticales/cuadradas

Formato: **JPG, ~1200×1300, calidad 80** (200-400 KB). Se ven en un carrusel
horizontal, cada una casi cuadrada tirando a vertical.

### José Hernández — `/jose-hernandez/`

| Archivo | Qué tiene que mostrar |
| --- | --- |
| `galeria-jh-reformer.jpg` | Sala Reformer en clase, plano fijo lateral |
| `galeria-jh-fuerza.jpg` | **Sala de fuerza** (solo la tiene esta sede) |
| `galeria-jh-recepcion.jpg` | Recepción con la ejecutiva |
| `galeria-jh-detalle.jpg` | Detalle del equipamiento |
| `galeria-jh-salida.jpg` | Alumnas saliendo felices |

### Emilio Castro — `/emilio-castro/`

| Archivo | Qué tiene que mostrar |
| --- | --- |
| `galeria-ec-reformer.jpg` | Sala Reformer en clase, plano fijo lateral |
| `galeria-ec-recepcion.jpg` | Recepción con la ejecutiva |
| `galeria-ec-detalle.jpg` | Detalle de resortes y carro del Reformer |
| `galeria-ec-salida.jpg` | Alumnas saliendo felices |

### Genéricas (home y `/equipo`, no son de ninguna sede en particular)

| Archivo | Qué tiene que mostrar |
| --- | --- |
| `galeria-recepcion.jpg` | La mejor recepción de las dos sedes |
| `galeria-detalle.jpg` | El mejor detalle de sala impecable |

⚠️ Antes, las tres sedes compartían las mismas fotos de galería. Se separaron por
sede (17-ago) porque con material real se vería la sala de una sede en la página
de la otra. **Núñez sigue usando las genéricas de IA hasta que se filme.**

---

## Dos cosas del material en bruto

1. **Está filmado a 119,88 fps**: interpretado a 24 fps da **cámara lenta 5x** sin
   perder fluidez. Ideal para las tomas de "alumnas saliendo felices" y para el
   detalle de resortes.
2. **Los clips largos** (C0177, C0178, C0184, C0295, C0296 y compañía, de 2 a 4
   minutos) son los únicos candidatos a tener a alguien hablando: de ahí sale el
   audio del `hero.mp4` si el relato lleva voz.

## Total

**6 videos + 16 fotos.** Si hay que priorizar: `hero.mp4` primero (es lo primero
que se ve y lo único con audio), después los dos `sede-*.mp4` y las 4 fotos de
equipo, que son las que hoy son IA de personas y conviene que dejen de serlo
antes del lanzamiento.
