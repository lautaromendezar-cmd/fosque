# FOSQUE — Estado del proyecto y cómo continuar

**EN VIVO: https://fosque.vercel.app/** · Repo: https://github.com/lautaromendezar-cmd/fosque (main = deploy automático a Vercel).

## 🖥️ Arrancar en una PC nueva

```bash
git clone https://github.com/lautaromendezar-cmd/fosque.git
cd fosque            # la raíz del repo ES la carpeta site del proyecto
npm install
npx playwright install chromium   # solo para el smoke test (una vez)
npm run dev                       # desarrollo en localhost:3000
```

Verificación antes de CADA push (cazó varios bugs reales):

```bash
npm run build                 # export estático a out/
node scripts/smoke.mjs        # Playwright: consola + screenshots de las 5 rutas
node scripts/check-hero.mjs   # luminancia + contraste + los 4 caminos del hero
```

`SMOKE_PORT` / `HERO_PORT` cambian el puerto si otro proyecto tiene tomado el
default (4173 / 4194).

Pushear a `main` deploya solo a Vercel. ⚠️ En Claude Code el cwd se resetea entre comandos bash: siempre `cd` absoluto antes de npm/git.

⚠️ "No se ven las animaciones": revisar "Mostrar animaciones en Windows" / "Reducir movimiento" del SO — el sitio respeta `prefers-reduced-motion` a propósito (trailer del hero y preloader no corren; counters muestran valor final). Preloader y trailer: solo 1ª visita por sesión (`sessionStorage fosque-seen`).

## 📄 Qué es el sitio

Next.js 15 App Router, `output: 'export'` (100% estático). GSAP + ScrollTrigger vía `useGSAP`, Lenis sincronizado (`SmoothScroll.tsx`). Tipografías del manual: Momo Trust Display (local, títulos), Baloo Bhaijaan 2 (texto), Bebas Neue (etiquetas). Logo oficial vectorizado del PDF (`components/logo/paths.ts`, regenerable con `scripts/trace-logo.mjs` + `gen-logo.mjs`). OG image: `scripts/gen-og.mjs`.

Rutas: `/` (home cine) · `/jose-hernandez` `/emilio-castro` `/nunez` (landings de conversión) · `/equipo` · `/franquicia` · `/novedades` (markdown en `content/novedades/`).

Datos centralizados: `data/sedes.ts` (única fuente de verdad: direcciones, WhatsApp, horarios, place_ids, instagram, guiones de rodaje) y `data/mitos.ts`.

Media: TODA la media actual es IA provisoria (`public/media/`). `components/Media.tsx` cae a placeholder con guion de rodaje si el archivo no existe; el material real del rodaje reemplaza archivos por nombre y listo (requiere rebuild). `AutoVideo.tsx` obligatorio para videos de fondo (fix autoplay iOS).

## ✅ Sesión 2026-08-06 — Sprint "lineamientos nuevos del cliente" COMPLETO

El doc del cliente está en `docs/lineamientos-cliente-2026-08.txt`. Se implementó entero:

1. **Copys oficiales**: manifiesto nuevo ("A Fosque venís a sentirte querida"), "evaluación sin cargo" (ex clase de diagnóstico) en todos los touchpoints, 7 mitos sincronizados. La respuesta "No tengo tiempo" en home usa la grilla completa (solo real en JH); por sede se adapta (`mitosParaSede`).
2. **Programa**: los 7 beneficios del doc (antes 4).
3. **`/equipo`**: 3 grupos oficiales — Profe Fosque `#profe`, Ejecutiva Fosque `#ejecutiva`, Personal de Mantenimiento `#mantenimiento` (placeholder `equipo-mantenimiento.jpg`). Teaser de 3 cards en la home (`.eq-card`).
4. **Nav oficial**: Método Fosque | Profe Fosque | Ejecutiva Fosque | Tu Sucursal (dropdown) | Novedades | Franquicia + botón EVO desktop + íconos IG/FB (URLs en `#`). Redes se ocultan <1500px, EVO <1360px (siguen en menú mobile y footer).
5. **WhatsApp flotante con selector de sede** (`WaFloat`): panel FJH/FEC/Núñez + general; en landings de sede prop `directo` (sin selector).
6. **Cards de sedes con accesos directos**: WA/Maps siempre; IG aparece solo al cargar la URL en `data/sedes.ts`. La card es `<div>` + `.sc-link` estirado (no se anidan links).
7. **`/franquicia`**: hero sandwich "FOSQUE / en tu barrio", marquee, 4 cards del modelo, stats con counters, `FranquiciaForm` → arma WhatsApp al número general. Placeholder `franquicia.mp4`.
8. **HERO PELÍCULA (home)**: se eliminó el bento + scrub. `#cine`: video fullscreen con velo oscuro + TRAILER de 3 frases secuenciales al mismo tamaño (`.cine-frases`) → al cierre entra el estado final fijo (`.cine-content`: pregunta palabra por palabra + CTAs). Visitas repetidas de la sesión van directo al estado final. Zoom lentísimo yoyo del video. `CineAudio` = mute/unmute (audible cuando el hero.mp4 real tenga pista de audio).

### Lecciones técnicas de la sesión (no re-debuggear)

- **Bug Next App Router**: varios `<Link>` al mismo pathname con distinto hash → la caché de prefetch pisa el hash. Solución: `<a>` nativo para anclas cross-page + effect en `SmoothScroll` que hace `lenis.scrollTo(hash)` al montar la ruta. El click handler también cubre `a[href*="#"]` de la misma página.
- **GSAP**: `from()` con stagger sobre targets de selectores mezclados dejó un target congelado en los valores iniciales → `CineAudio` quedó fuera de la timeline (siempre visible). Pins: usar `clearProps` en entrances para no pisar hovers CSS.
- **Counters + reduced-motion**: setear el valor final directo (HomeFx y FranquiciaFx lo hacen).

## ✅ Sesión 2026-08-07 — Hero en 3 actos

Rework del trailer del hero a pedido de Lautaro: **acto 1** = la pregunta sola sobre telón negro (sin video, `#cine` tiene `background: var(--negro)`); **acto 2** = el video+velo+botón de audio se funden a la vista junto con "Fosque no es un gimnasio." (leve anticipo `'<-0.35'`); sigue la 3ª frase sobre el video y al cierre el estado final (pregunta + CTAs) igual que antes. Detalle clave: la escena se oculta (`gsap.set opacity 0`) ANTES de arrancar el preloader — si se hace en `film()` el video se ve un instante detrás del preloader al desvanecerse y se apaga de golpe. Reduced-motion no se toca (nunca corre `film()`, la escena queda visible). Verificado con capturas Playwright por acto.

**Replay de la intro**: RECARGAR la página repite preloader+trailer; volver a la home navegando dentro del sitio va directo al estado final. Criterio: `performance.getEntriesByType('navigation')[0].type === 'reload'` + variable de módulo `homeMontoEnEsteDoc` (sobrevive navegación client-side, se resetea por documento). No sirve marcar el documento con `timeOrigin`: los `<a>` nativos a `/equipo#...` recargan documento y el regreso client-side repetiría la intro. Verificado con Playwright: carga fresca ✓, reload repite ✓, Novedades→logo no repite ✓.

**Estado final con subtítulo**: para que el cierre no repita la pregunta pelada del acto 1, el estado final ahora es pregunta + `.sub` ("Un espacio donde siempre sos bienvenida…" — la 3ª oración del subtítulo oficial del brief, que el trailer no dice) + CTAs. Con esto el hero tiene el copy oficial COMPLETO (título + subtítulo + CTA del doc del cliente).

**Intro limpia**: durante la intro el nav y el WhatsApp flotante están ocultos (`autoAlpha 0` seteado junto con el telón, antes del preloader) y entran en `reveal()` con los CTAs — en el acto 1 se ve SOLO la frase sobre negro. `CineAudio` quedó detrás del flag `HERO_CON_AUDIO` en `page.tsx` (hoy `false`): poner `true` cuando el hero.mp4 real traiga pista de audio, con video mudo el botón confundía.

**Video del hero sin loop visible**: el hero.mp4 (8s) se reproducía invisible desde la carga y loopeaba a mitad del trailer. Ahora, en el momento exacto en que abre la escena, un callback en la timeline lo reinicia (`currentTime = 0`) y lo ralentiza (`playbackRate = 0.55` → un pase ≈ 14.6s): cubre las frases y el aterrizaje del estado final; el primer loop llega mucho después. ⚠️ Si se reemplaza hero.mp4 por el del rodaje, recalcular el rate (comentario en `HomeFx.tsx`) — y si trae audio, el playbackRate ralentizado va a deformar la pista: en ese caso repensar (quizás rate 1 y un clip más largo).

## ✅ Sesión 2026-08-17 — Devolución del cliente: se va el telón negro

Doc del cliente (`docs/devolucion-cliente-2026-08-17.md`). El 85% describía lo
que ya estaba hecho; lo que sí pedía de nuevo se implementó entero:

1. **Adiós al telón negro.** `#cine` pasó de `--negro` a `--crema` y el video ya
   NO se oculta detrás del preloader: cuando el preloader se disuelve (0,9s, era
   0,4s) la escena ya está ahí. Se eliminó `.cine-frases` (el trailer de 3 frases
   que se reemplazaban) y con él la duplicación de la pregunta.
2. **El copy se SUMA en capas, no se reemplaza.** `film()` en `HomeFx.tsx`:
   pregunta palabra por palabra → `HOLD_PREGUNTA` (3s, constante arriba del
   archivo) → frase central → botones + nav + WhatsApp. Total ≈9s.
3. **Copys oficiales nuevos**: la 2ª frase es "En Fosque nos dedicamos a que
   puedas disfrutar y cuidar lo que verdaderamente tiene valor en tu vida" y el
   párrafo largo "Fosque no es un gimnasio…" salió del trailer y es ahora la
   sección `#manifiesto`, la 2ª pantalla narrativa que se descubre al scrollear.
4. **CTA final en 1ª persona**: "Mi momento es ahora / Comienzo el cambio. Elijo
   ser mi mejor versión."
5. **Códigos oficiales de sede** `FJH/FEC/FNN` (campo `codigo` en `data/sedes.ts`):
   reemplazan al "SEDE 01/02/03" inventado, en las cards y en el selector de WhatsApp.
6. **Posters de video** (`scripts/gen-posters.mjs` → `<nombre>-poster.jpg`): un
   `<video>` sin `poster` pinta NEGRO mientras bufferea, justo el corte técnico
   que el cliente marcó. `Media.tsx` lo pasa solo si el archivo existe.
7. **Fundidos**: el pie del hero se funde al crema (`#cine::after`) y el fondo del
   body pasó a `0.8s ease-in-out`, como pedía el doc.

### Contraste: el hallazgo de la sesión

Medido con `scripts/check-hero.mjs`: el título del hero estaba en **2,11:1**
contra los frames más claros del video — no llegaba ni a AA large. Venía de
antes y se notó más al quedar el copy fijo sobre el video. **No se resolvió
oscureciendo la escena** (sería volver a lo que el cliente rechazó) sino con un
velo LOCAL detrás del copy: elipse de caída larga en `.cine-content::before`,
tono de paleta. Los bordes del cuadro siguen luminosos. Ahora **5,0:1** el
título y **6,1:1** la frase. ⚠️ Volver a correr el check al cambiar `hero.mp4`:
un clip más claro tira esto abajo sin que se vea a ojo.

## ✅ Sesión 2026-08-18/19 — Entra el material real del rodaje

**5 de los 6 videos ya no son IA.** De 641 MB en bruto quedaron 18 MB servidos.

| Archivo | En bruto | En el sitio | Notas |
| --- | --- | --- | --- |
| `hero.mp4` | 212 MB | **6,6 MB** | 21,8s · 1920×1080 · ⚠️ audio MUDO |
| `sede-jose-hernandez.mp4` | 53,6 MB | **2,6 MB** | 5,2s |
| `sede-emilio-castro.mp4` | 61,5 MB | **2,3 MB** | 5,9s |
| `historia.mp4` | 95,3 MB | **2,9 MB** | 9,9s · 16:9 en marco cuadrado, se recorta 43% |
| `metodo.mp4` | 68,5 MB | **3,0 MB** | 9,7s · 1080×1350, se recorta 21% de alto |
| `franquicia.mp4` | 205 MB | **3,2 MB** | 20,3s · a 1600px y CRF 26 |
| `sede-nunez.mp4` | — | 5,0 MB | **SIGUE SIENDO IA** (sede sin filmar) |

### ⚠️ Todo lo que exporta Premiere viene en bruto

Los seis llegaron a 55-82 Mbps, 119,88 fps y con pista de audio que el
reproductor mutea igual. **No subir nada sin pasarlo por acá:**

```bash
ffmpeg -y -i ENTRADA.mp4 -an -r 30 -vf "scale=1920:-2"   -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 23   -preset slow -movflags +faststart public/media/SALIDA.mp4

rm public/media/SALIDA-poster.jpg   # el viejo es el frame del clip anterior
node scripts/gen-posters.mjs
```

Para clips de 20s o más: `-crf 26` y `scale=1600:-2`, si no se van a 8+ MB.
**Los originales en bruto NO están en el repo** (pesan 641 MB) y quedaron en un
temporal de la PC vieja: si hacen falta, se reexportan de Premiere.

### Decisiones tomadas en esta sesión

- **`HERO_RATE` pasó de 0.55 a 1**. El ralentizado existía solo porque el clip de
  IA duraba 8s y loopeaba en mitad de la intro; el real dura 21,8s.
- **El botón de audio sigue apagado** (`HERO_CON_AUDIO` en `app/page.tsx`): la
  pista del hero salió en silencio digital (-91 dB de pico). Debe ser el audio
  desactivado en la secuencia de Premiere. Reexportar con sonido de sala y
  poner el flag en `true`.
- **Los marcos de `historia` y `metodo` son casi cuadrados** (1,01:1). Se probó
  pasarlos a 16:9 y **se descartó por cómo quedaba la sección**: si hay que
  corregir el recorte, se reexporta el video en 1080×1080, no se toca el CSS.
- **Galerías separadas por sede** (`galeria-jh-*` / `galeria-ec-*`). Los archivos
  que hay son copias de los de IA hasta que lleguen las fotos reales.

### `check-hero.mjs`: dos fallas del propio test que el material real destapó

1. Los tiempos se anclaban en `networkidle`. Con videos de verdad la carga tarda
   más y la intro ya venía corriendo → 3 chequeos fallaban por el test, no por el
   sitio. Ahora se anclan en **el momento en que desaparece el preloader**, que es
   exactamente cuando arranca `film()`.
2. El contraste se medía sobre la reproducción en vivo: el mismo clip daba 3,49
   en una corrida y 4,86 en la siguiente. Ahora **pausa el video y lo recorre
   entero segundo a segundo**. Determinista y cubre el 100% del loop.

⚠️ **Pendiente concreto**: con esa medición honesta el título del hero da
**3,45:1 en el segundo 1** del clip (justo donde la pregunta queda sola). Cumple
AA para texto grande (3:1 a 86px) pero no el 4,5 del script. Se arregla subiendo
el velo local de `.cine-content::before` en `globals.css` — **no** oscureciendo
la escena entera, que es lo que el cliente rechazó.

## ✅ Sesión 2026-08-27 — Se va el video del hero

Devolución del cliente: **el video a pantalla completa le resulta invasivo**.
Se eligió la lectura literal (nada de video en el hero, ni siquiera contenido).

1. **`#cine` es ahora fondo crema + los arcos del manual.** Dos `RingsDeco`
   mucho más grandes que los de las secciones (`#cine .rings`: 72vw el rosa
   arriba a la izquierda, 46vw el teal abajo a la derecha). Se fueron
   `.cine-bg`, `.cine-veil`, el velo local `.cine-content::before`, los
   `text-shadow`, el fundido de pie `#cine::after` y `.btn.ghost` — todos
   existían solo para sobrevivir arriba del video.
2. **El copy pasó a negro sobre crema.** La coreografía que el cliente pidió el
   17-ago NO se tocó: pregunta palabra por palabra → `HOLD_PREGUNTA` (3s) →
   frase central → botones + nav + WhatsApp.
3. **El zoom lento del video lo reemplaza la respiración de los arcos** (24s,
   scale 1→1.06 y ±3°, en `HomeFx`, o sea que respeta reduced-motion).
4. **`hero.mp4` queda en `public/media/` sin usar**, a la espera de que el
   cliente defina dónde va (opciones que se le pasaron: banda contenida
   después del manifiesto, o sándwich como en las landings de sede).
   ⚠️ Sigue viajando al build (6,6 MB en `out/`) aunque ninguna página lo pida.
5. **`CineAudio.tsx` se eliminó** (está en el historial de git). Sin video no hay
   audio que activar. ⚠️ Esto **contradice el brief del cliente**, que pide
   expresamente "audio activable de forma orgánica" en el hero: hay que
   decírselo. Hoy no se perdía nada real porque el clip salió mudo (-91 dB).

### El manifiesto tuvo que animarse de nuevo

Con el hero ya en crema plano, el `fade-up` genérico del manifiesto no se veía:
se pasaba de una pantalla quieta a otra igual. Ahora el **título sube palabra
por palabra** con máscara (el mismo idioma que el hero) y el **párrafo se
enciende atado al scroll** (`scrub`, de 0,22 a 1 de opacidad por palabra), así
el que lo lee es el propio scroll.

- Las palabras se parten **desde JS** (`partirEnPalabras` en `HomeFx`), nunca
  desde el HTML con el CSS ocultando: si el script no llega, el texto queda
  entero y legible. Hay dos chequeos nuevos en `check-hero.mjs` que lo
  garantizan (en reduced-motion no se parte y nada queda apagado; con animación,
  al final del scroll ninguna palabra queda a media luz).
- El marco de la máscara lleva `padding-bottom: 0.16em` con margen negativo: los
  display van con `line-height: 0.95` y sin ese aire el marco le corta la cola a
  la "g" de "gimnasio".
- El `end` del scrub va en `top 20%`, no más abajo: con el recorrido largo las
  últimas palabras seguían apagadas con la sección ya centrada en pantalla.

### Lo que esto cierra

- **El pendiente de contraste se resolvió solo.** Venía 3,45:1 contra el frame
  más claro del clip; ahora el título da **14,64:1** y la frase **8,85:1**.
- **Lighthouse >90 en performance pasa a ser realista**: era el video fullscreen
  en autoplay lo que lo hacía imposible.
- Ya no hay que recalcular `HERO_RATE` ni volver a medir contraste cada vez que
  se cambia el clip del hero.

### Dos bugs de medición que aparecieron al hacerlo

1. **`opacity` en `.cine-content .sub` no existía en la práctica**: la intro
   anima esa misma propiedad con `autoAlpha` y al cerrar deja `opacity: 1`
   inline. O sea que el ablande solo se veía en reduced-motion, donde no corre
   la animación — las dos entradas quedaban distintas. Ahora va por **color**
   (`rgba(26, 24, 21, 0.82)`), que la animación no pisa.
2. **`check-hero.mjs` medía de más**: parseaba el color con `/\d+/` y se comía
   el alfa de `rgba()`, así que daba 14,64 para `.sub` en vez de 8,85. Además
   el chequeo 2 se reescribió entero: ya no recorre el video segundo a segundo
   sino que mide **los renglones reales** (rects de un `Range`, no la caja del
   elemento, que en un `h1` centrado de 16ch tiene aire a los costados) y
   calcula el contraste **píxel a píxel** mezclando el color del texto con el
   fondo. Sigue teniendo sentido: los arcos SÍ pintan color bajo el título.
   Y como los arcos se mueven, **se los clava con `!important` en los dos
   extremos del ciclo** antes de medir (el inline de GSAP pierde contra eso):
   sin eso daba 14,64 en una corrida y 11,62 en la siguiente. Es la misma
   lección de agosto con el video, en otra forma: **nunca medir sobre algo que
   se está moviendo.**
3. **Los arcos con `transformOrigin` en la esquina se van de cuadro.** Anclar el
   pivote en el centro de los círculos parecía más prolijo, pero `.rings.tl` ya
   trae `rotate(180deg)` del CSS y con el origen corrido el elemento entero
   termina en el extremo opuesto de la pantalla. Se deja el origen por defecto.
   (Lo cazó una captura, no el test: es de las cosas que hay que mirar.)

## 🎬 "Mejorar los videos con IA" — APROBADO, integrándose por tandas

**Decisión de Lautaro tras hablar con el cliente**: el cliente vio videos de
avatares IA en Instagram y quiere ese camino — no le molesta que sea IA. El
enfoque elegido NO es retocar los clips reales sino **recrear el lugar con
Nano Banana usando frames del video real como referencia** (mismo pipeline que
el cartel IA de /franquicia) y animar con image-to-video.

**El piloto (3 pruebas) fue APROBADO por el cliente (27-ago)** y se acordó
integrar por tandas, sede por sede, con revisión de Lautaro entre tandas.

**✅ TANDA 1 — José Hernández, INTEGRADA Y DEPLOYADA (27-ago):**
- `sede-jose-hernandez.mp4` = recreación del salón con luz solar dorada
  (0,98 MB, pipeline ffmpeg del proyecto) + poster regenerado.
- `galeria-jh-*.jpg` (las 5, 896×1200): reformer, fuerza, recepción, detalle
  con placa FOSQUE, salida. Verificado: build + smoke + check-hero OK.
- ⚠️ `galeria-jh-fuerza.jpg` es la única INVENTADA de cero (el video real no
  muestra la sala de fuerza) — si el cliente la quiere fiel, pedir foto real.
- ⚠️ En `galeria-jh-salida.jpg` el vidrio dice "PILATE…" cortado (texto IA
  menor); regenerar si molesta, igual que se hizo con recepción (v1 traía un
  cartel con texto ilegible).
- 🔑 **Truco del logo**: pasarle a Nano Banana el lockup oficial como imagen de
  referencia aparte (recorte de `app/opengraph-image.png`, crop 440:130:50:50)
  con "reproduced EXACTLY" → sale nítido. Sin eso lo deforma (pasó con el buzo).
- Los originales PNG 2K + los clips candidatos quedan en
  `Desktop/Claude/fosque/pruebas-ia/` (PC principal, fuera del repo).

**Próximas tandas**: Emilio Castro (mismo pipeline, frames de
`sede-emilio-castro.mp4` como referencia) → Núñez (sin referencia real: pedir
fotos del local, aunque sean de celular) → hero/metodo/historia/franquicia si
el cliente quiere. Créditos Higgsfield tras tanda 1: ~256 de 456 (imagen ≈2,
video 5s 1080p = 45).

**Piloto (2 pruebas) generado vía Higgsfield MCP, esperando el OK del cliente:**
- Pipeline: frames del MP4 real (`ffmpeg fps=1`) → `media_upload` →
  `nano_banana_pro` 16:9 2k con `image_references` (prompt: "recreate this
  exact studio… preserve architecture/machines/branding, transform only the
  atmosphere") → `seedance_2_5` mode `omni_reference` con `start_image` =
  job_id de la imagen, 5s 1080p sin audio (45 créditos por clip).
- Resultados en `Desktop/Claude/fosque/pruebas-ia/` (PC principal, fuera del
  repo): `clip-salon.mp4` (recreación fiel del salón de JH con luz cálida) y
  `clip-reformers.mp4` (fila de reformers + profe con buzo del logo).
- Costo del piloto: ~94 créditos (2 imágenes + 2 videos). Saldo tras el piloto:
  362 de 456.
- ⚠️ El logo de la marca en el buzo sale semi-deformado (trampa conocida: la IA
  regenera, no copia). En planos donde el logo se vea grande, taparlo/evitarlo
  o corregirlo aparte.
- Si el cliente aprueba: repetir por video a reemplazar eligiendo el mejor
  frame de referencia de cada MP4 real; para Núñez (sin rodaje) no hay
  referencia real — pedir fotos del local aunque sean de celular.

### Contexto previo (análisis del 27-ago, antes del piloto)

Pedido del cliente (27-ago-2026), **sin resolver y sin idea todavía**. Lo que
dijo es que no le gusta cómo se ven sus locales. Ojo con lo que eso significa:
**el problema no es técnico** (resolución, compresión, nitidez) sino la luz y el
espacio real. Eso cambia cuál es la herramienta.

**La trampa a evitar.** Ya está documentado en otro proyecto que el upscale de
IA **no escala: regenera** — reescribió texto de etiquetas en las 3 pruebas que
se hicieron. Sobre el local REAL de un negocio eso es peor que feo: la persona
que reserva **va a ir físicamente ahí**. Mostrar un salón que la IA mejoró es
venderle un lugar que no existe. Antes de hacer nada de esto hay que planteárselo
al cliente en esos términos, no como un problema técnico.

**Lo que sí se puede hacer sin inventar nada, en orden de rendimiento:**

1. **Corrección de color.** Los seis clips salieron de Premiere y acá se
   comprimieron con ffmpeg (CRF 23) — **el grading nunca se tocó**. Levantar
   sombras, calentar hacia la paleta de la marca (crema/durazno) y sacarle el
   verde a la luz fluorescente es, con bastante probabilidad, el 80% de "no me
   gusta cómo se ve". Es lo primero que hay que probar y no necesita IA.
2. **Cambiar el plano, no el local.** Hay **296 clips en bruto** sin usar (ver
   abajo): los 6 que están servidos son un recorte mínimo. Si lo que no le gusta
   es el salón, la respuesta editorial es no mostrarlo entero — planos cerrados
   de reformer, manos, caras — y no maquillarlo.
3. **Higgsfield** (MCP conectado): `upscale_video` 2K/4K, `reframe`,
   `motion_control`. Probar en **UN** clip corto y comparar mirando
   específicamente si reescribe carteles, logos o el equipamiento del local.
   No prometerle nada antes de esa prueba.

⚠️ **Núñez es caso aparte**: esa sede nunca se filmó, así que `sede-nunez.mp4`
ya es 100% IA. Ahí el pedido es al revés — hace falta material real, no mejor.

## 🗂️ Material en bruto: está en la PC de casa, NO viaja

`Desktop/Fosque` — **23 GB**, fuera del repo: 99 ARW + 296 clips 1080p a
119,88 fps con audio, del rodaje del 12-ago (solo las 2 sedes de Mataderos).
Es de donde salieron los 6 videos servidos. **Si en la otra PC hay que tocar los
videos, este material tiene que viajar**: sin él solo se pueden retocar los MP4
ya comprimidos, que es partir de mucho menos.
Los exports intermedios de Premiere (641 MB) se perdieron en un temporal: se
reexportan si hacen falta.

## ⏳ Pendientes

📋 Todo lo que falta de parte del cliente, junto y listo para mandarle:
`docs/PEDIDO-AL-CLIENTE.md` (incluye los números de franquicia y la versión
corta para WhatsApp).

**Del CLIENTE (bloquean):**
1. URL login EVO → `EVO_URL` en `components/Nav.tsx` (hoy `#`; también en Footer).
   ⚠️ El doc del 17-ago vuelve a dibujar el botón `[Ingresá a tu Perfil]` pero
   sigue sin mandar la URL.
2. Instagram/Facebook general → `IG_URL`/`FB_URL` en `Nav.tsx` + Footer. Instagram por sede → campo `instagram` en `data/sedes.ts` (activa el botón en las cards). ⚠️ Ídem: el doc muestra el botón de IG en las 3 sedes y no manda las URLs.
3. Confirmar direcciones ⚠️ "José Hernández" pin en Bragado 5952, "Emilio Castro" en Andalgalá 1395 (`direccionPendiente: true`). Los NOMBRES ya los confirmó el doc del 17-ago (Fosque José Hernández / Emilio Castro / Núñez, FJH/FEC/FNN).
4. **HORARIOS: hay contradicción sin resolver.** El doc del 17-ago contesta el
   mito "no tengo tiempo" con "L a V 7:00–22:00, sábados desde 9:00, domingos a
   la mañana y feriados abiertos" — eso es SOLO José Hernández. En `data/sedes.ts`
   Emilio Castro es L-V 8–21 / sáb 9–13 y Núñez L-V 8–21 / sáb 8–13, y **ninguna
   de las dos abre domingo**. Encima para JH figura "domingos hasta 17:00" y el
   doc dice "a la mañana". No tocar hasta que confirme sede por sede.
5. ¿Los mitos son 7 o 3? El doc del 17-ago lista 3; en el sitio están los 7 que
   él mismo mandó en agosto. Se asumió que los 3 son ejemplos y NO se borró nada.
6. Media real del rodaje: reemplazar por nombre en `public/media/` — `franquicia.mp4`, `equipo-mantenimiento.jpg`, y todas las fotos IA (las del "equipo" son IA: cambiarlas antes del lanzamiento real). ⚠️ Desde el 27-ago el hero NO usa video: definir con el cliente dónde va `hero.mp4` (o si se descarta).
   ⚠️ El rodaje del 12-ago cubrió **solo las 2 sedes de Mataderos** (material en
   `Desktop/Fosque`, fuera del repo: 99 ARW + 296 clips 1080p a 119,88fps con
   audio). **Núñez no se filmó** y el doc pide material real de cada sede.
   Además hoy las 3 sedes comparten los mismos `galeria-*.jpg`: con material real
   conviene separarlos por sede en `data/sedes.ts`.

**Técnicos:**
- Dominio fosque.com + setear `NEXT_PUBLIC_SITE_URL` en Vercel (para el OG de WhatsApp). ⚠️ El doc del cliente lo encabeza como si el dominio ya existiera: hoy es fosque.vercel.app. Definir quién lo compra.
- **Confirmarle al cliente que el botón de audio del hero se cayó** con el video (lo pide el brief). Vuelve solo si el video vuelve al hero de alguna forma.
- Lighthouse >90 que pide el doc: **ahora sí es alcanzable en las cuatro categorías** — el techo era el video fullscreen en autoplay. Falta medirlo.
- Decap CMS para que Vero publique novedades sola (guía provisoria: `COMO-PUBLIR.md.txt` en la carpeta del proyecto de la PC principal).
- Transición home → sede con barrido de arcos (idea vieja, baja prioridad).

## 🗂️ Otros archivos fuera del repo (PC de casa, Desktop/Claude/fosque/)

`CONTINUAR.md` viejo (reemplazado por este), `lineamientos nuevos fosque.txt` (copiado a `docs/`), `files/` (brief y prototipos originales). Nada de esto hace falta: para trabajar el SITIO alcanza con el repo. Lo único que sí puede faltar es el material en bruto del rodaje (ver arriba).
