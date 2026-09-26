# FOSQUE — Estado del proyecto y cómo continuar

**EN VIVO: https://fosque.com/** — hosting del cliente, **se publica subiendo `deploy-ftp/` por FTP a mano** (`npm run ftp` + FileZilla; guía en `deploy/LEEME-SUBIDA.txt`).
Repo: https://github.com/lautaromendezar-cmd/fosque — es **sólo código y backup**: no deploya en ningún lado. **Vercel se borró el 3-sep**, pero desde el 21-sep hay un **preview en https://fosque-preview.vercel.app** (proyecto nuevo, con `noindex`, para mostrar cambios sin tocar el hosting; ver abajo). Para ver un cambio antes de subirlo: `npm run probar`.

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
npm run check-nav             # el nav en 15 anchos: no engorda, y los 3 IG se alcanzan
```

`SMOKE_PORT` / `HERO_PORT` cambian el puerto si otro proyecto tiene tomado el
default (4173 / 4194).

⚠️ Un `git push` NO publica nada: el sitio se publica subiendo `deploy-ftp/` por FTP. ⚠️ En Claude Code el cwd se resetea entre comandos bash: siempre `cd` absoluto antes de npm/git.

⚠️ "No se ven las animaciones": revisar "Mostrar animaciones en Windows" / "Reducir movimiento" del SO — el sitio respeta `prefers-reduced-motion` a propósito (trailer del hero y preloader no corren; counters muestran valor final). Preloader y trailer: solo 1ª visita por sesión (`sessionStorage fosque-seen`).

## 🖼️ 21-sep — Díptico del hero de Fuerza y Cardio (sí se pudo cambiar la imagen)

**El video del hero se reemplazó por dos fotos** (`fz-hero`): Fuerza y Cardio
(más ancha, sin offset — "la imagen más importante") + Reformer (más chica,
calada hacia abajo), tal como pidió el PDF: "vendemos la combinación, no por
separado". `sede-jh-fuerza.mp4` queda huérfano en `public/media/` (mismo
destino que `hero.mp4`), por si vuelve.

**Por qué no se podía cumplir con material real tal cual estaba:** se armó una
hoja de contacto de los 38 clips crudos (`videos-gimnasio/`, un frame por
clip) para buscar alguna toma con mayoría sonriendo de frente. No hay
ninguna — es rodaje candid, todo el mundo está concentrado, de espaldas o de
perfil. Pedirle "mujeres sonriendo a cámara" no es algo que el material
filmado tenga.

**Lo que se generó, entonces, es 100% sintético** (no hay alumnas reales
identificables en la foto nueva) — y esto YA es el criterio del resto de la
galería del sitio: `galeria-jh-reformer.jpg` (la que se reusó para el lado
Reformer del díptico) y el resto de `gal-*` en `pruebas-ia/README.md` también
son recreaciones IA, no fotografía documental. No hace falta el OK de
consentimiento de ninguna alumna para esto — es contenido publicitario
inventado, como cualquier foto de stock, no un testimonio real.

**Pipeline**: `nano_banana_pro`, 2 references (`gym-video-sala-base.jpg` para
el grading cálido + `gym-frame-C0063-video-sala.jpg` para la estructura real
del techo — la v1 sin la segunda referencia inventó un cielorraso de losetas
blancas con spots redondos, el mismo bug ya anotado en `fuerza-jh-cardio.jpg`;
pasarle el frame crudo lo corrigió). 3:4, 2K, 2 créditos. Resultado en
`pruebas-ia/gym-grupo-v2.png` (fuente) → `fuerza-jh-grupo.jpg` (896×1200,
`scripts/tmp/png2jpg-896.mjs`, mismo criterio que `png2jpg.mjs`).

**Verificado**: build con tipos, smoke de 7 rutas, captura de `#fuerza` en
1440 y 390, curl en vivo confirmando el archivo y las clases nuevas.


## 📄 21-sep — PDF del cliente: Membresía F + landing de invitación + Fuerza y Cardio v2

El PDF está en `modificaciones-21-09/` (4 páginas). Son los **3 cambios** y
están los tres **hechos y publicados en el preview** (no en fosque.com):

1. **Membresía F, dos modelos.** "Vamos a tener que meterle cabeza para
   mostrar los dos tipos de membresía porque son dos modelos diferentes":
   Reformer (FEC y FNN) e integral (FJH, que suma Fuerza y Cardio). Va como
   sección `#membresia` **en cada landing de sede**, después de INFO (y de
   Fuerza y Cardio en JH), con el modelo de esa sede. Datos en `data/sedes.ts`
   (`MEMBRESIA_REFORMER` / `MEMBRESIA_INTEGRAL`, campo `membresia` de cada
   sede), texto suyo palabra por palabra; beneficios como lista numerada, sin
   tarjetas para no repetir las de INFO y F&C en la misma página. Dos botones:
   "Quiero mi Membresía F" (WhatsApp de la sede) e "Ingresar a mi Membresía F"
   (plataforma). Reveals en `SedeFx.tsx`.
   ⚠️ **El acceso a socios sigue muerto.** Pide "un botón de acceso a
   miembros" con link a `https://socios.fosquereformer.com`: **ese dominio no
   existe y `fosquereformer.com` ni está registrado** (NXDOMAIN, verificado
   21-sep). El botón existe en el nav y el footer desde agosto ("Ingresá a tu
   Perfil") esperando la URL de EVO. Ahora los tres botones comparten
   `PLATAFORMA_URL` en `data/sedes.ts`, en `'#'` hasta que mande la real.
   Esto también contesta la duda de la membresía en JH: su Membresía F
   integral incluye "Entrenamiento Integral (Fuerza, Cardio + Reformer)".
2. **Landing de aterrizaje: `/invitacion/`** (`app/invitacion/page.tsx` +
   `components/invitacion/InvitacionFx.tsx` + CSS `INVITACIÓN`). Copy suyo en
   el mismo orden: pregunta gigante en el hero invadiendo el video de la
   clase (`sede-emilio-castro.mp4`), "Tu mejor versión" con `metodo.mp4`,
   "Somos el Programa para Mejorar tu Vida" con dos tarjetas asimétricas
   (FEC+FNN / FJH) que linkean a las sedes, la frase de "Ganá movilidad…" como
   statement y el cierre "¡Activate! Te lo merecés." con **un botón por sede**
   al WhatsApp de esa sede (el sitio no tiene un WhatsApp general de verdad:
   `WA_GENERAL` es el de JH). Es página de campaña: **`robots: noindex`** en
   su metadata y no está en el nav; se llega por el link del anuncio. Tres
   retoques mínimos al copy, avisar: "Actívate"→"Activate" y
   "Anótate"→"Anotate" (convivían con el voseo del resto) e "Inicia"→"Inicial".
3. **Fuerza y Cardio v2.** El WhatsApp y la p.4 del PDF traen título, promesa,
   ventajas, CTA y notas de imagen. Su título "Fuerza, Cardio + Pilates
   Reformer: Único en Fosque José Hernández" quedó partido en eyebrow + h2;
   la promesa reemplaza mis dos párrafos de intro (grande, en display); las 4
   ventajas van como lista con separadores al lado de las 3 tarjetas; el
   botón dice "¡Anotate ahora!" con "Semana de invitación a la experiencia"
   debajo. Tipo `Fuerza` cambiado: `eyebrow`, `promesa`, `ventajas`, `cta`,
   `ctaNota` (se fue `texto`).
   ⛔ **Lo único que NO se hizo: las imágenes.** Pide "mujeres ejercitándose,
   la mayoría y con una sonrisa" y "otra con el de Fosque Reformer" porque
   "vendemos la combinación, no por separado". Choca con el criterio de la
   tanda 5 (sin caras de alumnas reconocibles) y hoy la sección no tiene
   Reformer. Antes de tocar: ¿tiene el OK de las alumnas que salen en los 38
   clips? Si no, son personas generadas en un local real. Propuesta: díptico
   arriba (clip de sala de fuerza + clip de Reformer).

**Sin decidir, para el cliente** (agregado a `docs/PEDIDO-AL-CLIENTE.md`):
URL real de socios · "Pilates Reformer" (todo su PDF) vs "Fosque Reformer"
(todo el sitio) · si la Semana de Invitación es permanente · las fotos con
caras.

**Verificación (21-sep)**: build con tipos, smoke de 7 rutas (se sumó
`/invitacion/` a `smoke.mjs`), capturas de `#fuerza`, `#membresia` (JH y
Núñez) e `/invitacion/` entera en 1440 y 390 con
`scripts/tmp/shot-secciones.mjs`, y curl en vivo del preview.

## 🔭 21-sep — Preview en Vercel: https://fosque-preview.vercel.app (fosque.com NO cambió)

**Para qué**: mostrar y aprobar cambios sin tocar el hosting del cliente. Es un
proyecto NUEVO de Vercel (`fosque-preview`, equipo `lautaro-mendez-s-projects`),
no el `fosque` que se borró el 3-sep. **fosque.com se sigue publicando por FTP
igual que siempre** (`npm run ftp` + FileZilla); el preview no reemplaza eso.

**Cómo está blindado para que no le compita a fosque.com** (la razón por la que
se borró el anterior):
- `vercel.json` manda `X-Robots-Tag: noindex, nofollow, noarchive` en todo.
- El canonical y el `og:image` apuntan **a sí mismo** (`NEXT_PUBLIC_SITE_URL=
  https://fosque-preview.vercel.app`, cargada como env var del proyecto en
  Production y Preview). Así no hay `noindex` + canonical a otro sitio, que era
  la combinación que Google desaconseja y por la que antes no se puso `noindex`.
- La URL larga del deployment (`fosque-preview-xxxx-...vercel.app`) redirige al
  login de Vercel (Deployment Protection); **al cliente se le pasa el alias
  corto**, que es público.

**Cómo se redeploya** (desde cualquier PC, después de `git pull`):
```
vercel link --yes --project fosque-preview --scope lautaro-mendez-s-projects   # solo la 1ª vez en la PC
vercel pull --yes --environment=production                                    # solo la 1ª vez en la PC
vercel build --prod --yes && vercel deploy --prebuilt --prod --yes
```
Sube solo `out/` (~25 MB, deduplicado por hash); el fuente y los 25 MB de
`pruebas-ia/` no viajan. `.vercel/` y `.env.local` (token OIDC) quedaron en
`.gitignore`, los agregó `vercel link`. `vercel deploy --prod` sin `--prebuilt`
también anda (Vercel corre `next build` con la env var del proyecto), pero sube
el fuente entero.

**Trampas que ya se pagaron (21-sep)**:
- `vercel.json` con `"framework": "nextjs"` + `output: 'export'` +
  `trailingSlash: true` → **todas las páginas dan 404 en Vercel** (los assets
  sí responden). El `@vercel/next` del CLI 59.11.7 renombra `x/index.html` a
  `x/index` en `overrides` y `/x/` no resuelve. Por eso el `vercel.json` es
  `framework: null` + `buildCommand: next build` + `outputDirectory: out` +
  `trailingSlash: true`: **Vercel sirve `out/` como archivos planos, igual que
  el Apache**, y `404.html` sale solo. El cache `immutable` de `_next/static`
  se declara a mano en `headers`.
- Sin `vercel.json`, el proyecto (preset "Other") sirve `public/` en vez de
  `out/`: quedaba solo `media/`.
- `cd .vercel/output` en la shell deja la carpeta ocupada y el siguiente
  `vercel build` muere con `EBUSY`. Rutas absolutas, no `cd`.
- `armar-ftp.mjs` ignora `vercel.json`: el paquete FTP no cambia.

## 🏋️ 16-sep — Sección "Fuerza y Cardio" en José Hernández + se fue el sorteo

**Pedido del cliente**: la sede JH tiene gimnasio (sala de musculación y cardio)
y quería mostrarlo **como complemento de Fosque Reformer, no como gimnasio**: la
home dice "Fosque no es un gimnasio" y el mito "No me gustan los gimnasios" lo
repite, así que el copy va por ese lado. Lautaro filmó 38 clips nuevos del
gimnasio (`videos-gimnasio/`, 1,7 GB, **fuera del repo por .gitignore**, misma
Sony: 1080p a 119,88 fps con PCM).

**Estado al 20-sep-2026: HECHO, verificado y empaquetado (`deploy-ftp/`), pero
FRENADO: se le mostró al cliente y NUNCA CONTESTÓ con los textos que quería
modificar.** Commiteado y pusheado el 20-sep (`b7fa00d`).
**21-sep: el cliente mandó el texto de las tres tarjetas y está cargado tal
cual en `data/sedes.ts`** (`lead` = lo que puso antes de los dos puntos, en
negrita; `d` = el resto), con la intro ajustada para nombrar bicicletas y
elípticos. Visible en https://fosque-preview.vercel.app/jose-hernandez/ .
Verificado: build con tipos, smoke de las 6 rutas y captura de la sección en
1440 y 390 (3 líneas por tarjeta en desktop, 4-6 en mobile;
`scripts/tmp/shot-fuerza.mjs`). **Después llegó el PDF con título, promesa y ventajas: v2 aplicada, ver la
sección del PDF más arriba.** La membresía quedó contestada por el PDF (la
Membresía F de JH es integral). No se subió por FTP: fosque.com sigue mostrando lo del
4-sep (con el pop-up del sorteo todavía puesto). Para retomar: reclamarle los textos, cambiar
el copy en `data/sedes.ts`, `npm run build` + los tres checks, `npm run ftp`
(si el clasificador lo frena, `node scripts/armar-ftp.mjs` hace lo mismo) y
subir. Si aprueba tal cual, `deploy-ftp/` ya está listo para arrastrar.

### Qué se agregó

- `data/sedes.ts`: tipo `Fuerza` y campo opcional `fuerza` en `Sede`. Solo JH lo
  tiene; la sección se renderiza si existe. Copy provisorio ahí mismo (título,
  2 párrafos, 3 puntos, texto del WhatsApp).
- `app/[sede]/page.tsx`: sección `#fuerza` entre INFO y GALERÍA. Bloque salvia
  (`#DCE5D9`, body a `#EAF0EC`), arcos sol en `bl`. Editorial: eyebrow "Solo en
  José Hernández" → título grande → **video protagonista a todo el ancho (2:1)**
  → texto en una columna + 3 cards al lado → 3 fotos 3:4 en cascada (la del
  medio baja 3rem). CTA "Quiero conocer la sala" → WhatsApp de la sede.
- `app/globals.css`: bloque `FUERZA Y CARDIO` antes de la galería. Mobile: video
  4:3, una columna, fotos 2 + 1 ancha.
- `components/sede/SedeFx.tsx`: parallax del video (`y` 36 → -36 con scrub) y
  cascada de las fotos como en `#equipo`. Las cards entran con la regla genérica.
- Galería de JH: `galeria-jh-fuerza.jpg` **ya no es la inventada de cero**; ahora
  es una recreación de los discos reales (C0052). Texto del shot actualizado.

### El material (tanda 5 de IA, misma receta que las tandas 1-4)

Selección de 5 clips entre los 38 (criterio: alumnas de espaldas o sin cara
reconocible, profe con uniforme real, un ancho, un detalle, uno humano; se
descartaron press de banca / peso muerto / abdominales por caras de alumnos en
primer plano y los carteles con texto): **C0063** (sala completa con profe
asistiendo → video), **C0036** (cardio, alumna de espaldas), **C0042** (máquinas
en profundidad), **C0050** (profe con buzo FOSQUE guiando en la polea),
**C0052** (discos). Lámina: `pruebas-ia/gym-seleccion.jpg`.

Pipeline, ahora por **CLI** y no por MCP (ver abajo): frame real →
`nano_banana_pro` 2K con el frame como `--image-references` (+ el logo-ref para
la del buzo) → `seedance_2_5` `--mode omni_reference --start-image` 5 s 1080p sin
audio → receta ffmpeg del proyecto (1,3 MB) → `gen-posters.mjs`. Prompts en
`Desktop/Claude/…/scratchpad` de la sesión; la idea es la de siempre: "recreate
this EXACT room… transform ONLY the atmosphere: warm golden sunlight, haze,
cream/peach, no fluorescent green; posters and text become plain surfaces".

Archivos en vivo: `sede-jh-fuerza.mp4` + poster, `fuerza-jh-cardio.jpg`,
`fuerza-jh-profe.jpg`, `fuerza-jh-maquinas.jpg`, `galeria-jh-fuerza.jpg` (todas
896×1200). Fuentes 2K y frames en `pruebas-ia/gym-*` (README actualizado).

⚠️ Para mostrarle al cliente / regenerar si marca:
- `fuerza-jh-cardio.jpg`: el techo salió **de chapa con vigas de madera**; el
  real es cielorraso liso con spots. Es lo único que no es fiel al lugar.
- `fuerza-jh-maquinas.jpg`: quedó una etiqueta amarilla "WARNING" legible en la
  máquina del frente (real, pero es texto).
- En el video la profe termina **sentada en el banco mirando a cámara** (3-5 s);
  al loopear salta de sentada a inclinada. Igual que los otros loops de 5 s.
- El buzo de la profe salió con el logo F + FOSQUE chico en el pecho, nítido
  (truco del logo-ref). El estampado de la manga quedó semi-ilegible, es chico.

### Copy: qué confirmar con el cliente

Se escribió sin material de él. Preguntas cerradas en `docs/PEDIDO-AL-CLIENTE.md`:
qué hay exactamente en la sala (¿solo cintas de cardio o también bicis?), si
entra en la membresía de Reformer o es un plan aparte, y si "un instructor te
guía y te corrige en cada sesión" es literal. Si algo no es así, se cambia en
`data/sedes.ts` y listo.

### Higgsfield ahora es CLI, no MCP

El conector MCP de claude.ai no aparece en esta PC. Se instaló **`npm i -g
@higgsfield/cli`** (1.1.25) y la sesión ya estaba autenticada
(`higgsfield account status` → cuenta de Lautaro, plan ultimate, **1193 créditos**
al 16-sep). Las skills `higgsfield-*` viven en `Desktop/Claude/.claude/skills/`.
Comandos que sirvieron (los flags de media aceptan rutas locales y suben solos):

```bash
higgsfield generate create nano_banana_pro --prompt "..." --image-references frame.jpg --aspect_ratio 3:4 --resolution 2k --wait --json
higgsfield generate create seedance_2_5 --prompt "..." --mode omni_reference --start-image base.png --duration 5 --resolution 1080p --aspect_ratio 16:9 --generate_audio false --wait --json
```

Costo de la tanda: 5 imágenes + 1 video ≈ 55 créditos.

### Verificación (16-sep)

`npm run build` OK · `smoke.mjs` ✓ 6 rutas · `check-hero.mjs` ✓ · `check-nav.mjs` ✓
· `scripts/tmp/shot-fuerza.mjs` (captura propia de `#fuerza` en 1440 y 390, con y
sin animaciones; con scroll real las fotos entran en cascada). Ojo: una captura
de elemento más alto que el viewport **no dispara los ScrollTrigger** de lo que
queda abajo: las cards salen vacías y no es un bug. Verificar con rueda.

### Sorteo: borrado

Vencido el 11/09, el 16-sep se borró todo (detalle en la sección del sorteo,
más abajo). `npm run check-sorteo` ya no existe.

### Lo que sigue (pedido del 16-sep, todavía sin material)

**Sección "Opiniones"** con entrevistas filmadas por Lautaro (~1 min c/u, que
hay que **cortar y subtitular acá**: ffmpeg + whisper están en esta PC, modelos
base/small/medium bajados, torch sin CUDA). Falta que pase los archivos, cómo se
nombra cada persona, de qué sede es y si aceptó salir en la web. Plan: componente
propio, en la home con todas y en cada landing con las de esa sede; subtítulos
quemados en la tipografía del sitio para que anden mudos con autoplay, más
botón de audio; cortes a la mejor frase (20-30 s) con la desgrabación completa.

## 📱 4-sep — Instagram por sede en el nav, y se fue Facebook

Los dos íconos de redes del nav apuntaban a `'#'` desde siempre, esperando URLs
que nunca llegaron. Ahora:

- **Instagram**: el ícono ya no es un link, es un **desplegable con las tres
  cuentas de sede** (Fosque no tiene una general). Sale de `data/sedes.ts`, con
  el número de sede en su color y el @ debajo, reusando el `.sub` de "Tu
  Sucursal" — mismo CSS, no hay un dropdown nuevo.
- **Facebook: borrado** del nav, del menú mobile y del footer. Nunca llegó la
  URL, así que eran tres links muertos repetidos en las 9 páginas. Si el cliente
  manda la cuenta, vuelve: el ícono está en el historial de git.
- **En el menú mobile el Instagram va al lado de cada sede**, no en una sección
  aparte. La sección propia repetía las tres sedes y estiraba el menú 166px: el
  tercer Instagram caía abajo del borde y había que descubrir que el menú
  scrollea por dentro. Con el ícono en la fila, el menú vuelve a entrar sin
  scroll en 390×844.
- `EVO_URL` sigue en `'#'`: es lo único que queda esperando al cliente.

### Tres cosas que aparecieron al hacerlo

1. **Había un hueco de 400px de ancho sin Instagram.** El ícono se ocultaba en
   `max-width: 1500px` pero el burger aparece recién en `1100px`, así que
   **entre 1101 y 1500 no había ni ícono ni menú**. No molestaba mientras el
   ícono fuera un link muerto; ahora sí. El breakpoint del ícono pasó a 1100:
   mientras haya menú de escritorio, hay Instagram.
2. **El botón "Ingresá a tu Perfil" partía su texto en dos líneas y engordaba el
   nav 22px** (82 → 104 de alto), entre 1361 y 1500px. **Es un defecto viejo**,
   de antes de todo esto: se ve en la medición con el ícono oculto. Arreglado con
   `nav .btn { white-space: nowrap }`. No lo agarraba ningún chequeo porque el
   nav no desborda ni se monta: sólo crece.
3. **El barrio de cada sede va ahora en su propio renglón** en el menú mobile.
   Al lado del nombre no entra en todos los anchos (medido: faltan 9px en 390 y
   34px en 360), así que quedaba José Hernández en dos renglones y Emilio Castro
   en uno. Se compensó bajando el aire de arriba del menú (14vh → 11vh).

### Verificación

`npm run check-nav` — **15 anchos** (1920, 1600, 1501, 1499, 1450, 1400, 1360,
1200, 1150, 1101, 1099, 900, 768, 600, 390; los pares 1101/1099 y 1501/1499
rodean los breakpoints a propósito). En cada uno: el nav no desborda, no se le
montan los bloques, no engorda respecto del alto de referencia, ningún botón
parte su texto, la página no scrollea de costado, y **los 3 Instagram se
alcanzan** — con las URLs exactas de `data/sedes.ts`. En mobile, además, que los
tres se vean **sin scrollear** el menú y que el ícono mida 44px. Aparte: que no
quede ningún link a `'#'` fuera del EVO, que no haya rastro de Facebook, y el
desplegable con teclado (abre al enfocar con Tab, cierra con Escape, y pasar por
"Tu Sucursal" no abre el de Instagram).

## 🎁 4-sep — Pop-up del sorteo de estreno — ✅ BORRADO el 16-sep-2026

**Se apagó solo el 11/09 y el 16-sep se borró el código muerto**: `Sorteo.tsx`, el
bloque CSS, el `<Sorteo />` del layout, `check-sorteo.mjs`, `sorteo-off.mjs` (y sus
imports en smoke / check-hero / check-nav), la línea de `package.json` y las fotos
del premio. Queda el aviso `fosque:intro-lista` de HomeFx, que es genérico. Lo de
abajo es historia de cómo se hizo, por si vuelve a pedir un pop-up temporal.

El cliente pidió un pop-up que anuncie el sorteo del combo Stanley por el
estreno de la web. **Está hecho y verificado, pero NO subido**: falta reemplazar
la foto del premio (ver abajo).

**Se apaga solo el 11/09 a las 00:00 de Argentina, y acá eso no es un lujo:** sin
deploy automático, un pop-up que dependiera de una subida para desaparecer
obligaría a alguien a acordarse de rebuildear y arrastrar 16 MB por FileZilla.
La fecha está horneada en `components/Sorteo.tsx` (`FIN`), en UTC (03:00Z = 00:00
ART). Se compara contra el reloj del visitante, que es lo único que hay sin
backend: si alguien tiene la fecha mal en la máquina, lo ve un día de más o de
menos.

### Los archivos

| Archivo | Qué es |
|---|---|
| `components/Sorteo.tsx` | el pop-up entero: fecha, tiempos, foco, freno de Lenis |
| `app/globals.css` (final) | bloque `SORTEO DE ESTRENO` |
| `app/layout.tsx` | lo monta DENTRO de `SmoothScroll` (para poder frenar Lenis) |
| `components/home/HomeFx.tsx` | dispara `fosque:intro-lista` en sus 3 caminos |
| `scripts/check-sorteo.mjs` | verificador propio (`npm run check-sorteo`) |
| `scripts/sorteo-off.mjs` | apaga el pop-up para smoke y check-hero |
| `public/media/sorteo-premio*.jpg` | los dos recortes de la placa (ver abajo) |
| `sorteo.jpg` (raíz del repo) | la placa original que mandó el cliente, 899×1599 |

**Cuando termine el sorteo se borra todo junto**: el componente, el bloque de
CSS, el `<Sorteo />` del layout, los dos scripts, la línea de `package.json`, la
foto, y el `avisarIntroLista` de HomeFx queda inofensivo (o se saca también).

### Decisiones que no son obvias

- **Va en todas las páginas**, no sólo en la home: quien venga del Instagram de
  una sede cae en `/nunez/` o `/emilio-castro/`, no en la portada.
- **En la home espera a que termine la intro.** El preloader + el trailer duran
  unos 6s y un pop-up encima le arruina la película. `HomeFx` avisa por el evento
  `fosque:intro-lista` en sus **tres** caminos (reduced-motion, visita repetida y
  película completa), así el que escucha no depende de cuál se tomó. En las otras
  páginas entra a los 2,2s. El timeout de 12s de la home es sólo la red por si el
  aviso no llega.
- **El HTML exportado no lleva la palabra "sorteo" en ninguna parte.** El
  componente arranca cerrado y devuelve `null`, así que el markup lo inyecta el
  JS. Dos razones: Google está decidiendo justo ahora qué indexar de fosque.com y
  no queremos que el snippet hable de un sorteo terminado, ni que quede texto
  muerto en las 9 páginas. Verificado con grep sobre `out/`. Corolario bueno: si
  el JS no corre, no aparece nada.
- **Una sola vez por visitante**: `localStorage` (no el `sessionStorage` del
  preloader, que vuelve en cada sesión a propósito). Sólo cerrarlo cuenta como
  visto — si se fue de la página sin cerrarlo, vuelve.
- **`?sorteo=ver`** en cualquier URL lo abre salteando la fecha y el "ya lo
  cerré". Es para mostrárselo al cliente y para el verificador.
- **La placa promete "3 formas de participar" y el copy del cliente da 2**
  (explorar la web y seguir el IG). Se resolvió con las 2 del copy, y por eso la
  foto va **recortada**: si se usara la placa entera, el cartel prometería tres.
  Si aparece la tercera forma, hay que sumarla al pop-up.
- **El rosa está oscurecido al 85% del de la placa** (`--sorteo-rosa: #a43f54`).
  No es gusto: el mismo color tiene que servir de texto sobre el crema Y de
  fondo para texto blanco, y las dos cosas pedían lo mismo. El rosa de la placa
  daba 3,92:1 sobre el crema y no pasaba AA; este da 5,08:1 y el blanco encima
  6,14:1.

### Dos trampas que ya se pagaron

1. **El pop-up se le sentaba encima al smoke y a check-hero.** Aparece a los
   2,2s en las páginas internas, justo cuando esos scripts sacan screenshots y
   miden contraste del hero: `nunez.png` salió con el modal puesto y **ninguna
   alarma sonó** — el promedio de luminancia no lo delata porque el panel es
   crema, y se descubrió de casualidad, porque el PNG tenía el md5 idéntico al
   screenshot del propio pop-up. Arreglado en `scripts/sorteo-off.mjs`: el
   servidor de prueba de los dos scripts inyecta la marca de "ya lo cerré" en el
   HTML. Se hizo así, y no con `addInitScript`, para cubrir todas las páginas y
   contextos de un solo lugar. El chequeo 8 de `check-sorteo` verifica que la
   clave siga sincronizada con el componente, porque si se desincronizan el
   fallo vuelve a ser silencioso.
2. **Medir durante la animación de entrada da números falsos.** El panel entra
   con `opacity 0→1` y `scale(.98)→1`; medido a mitad de camino, el contraste
   daba 3,62:1 donde en realidad era 3,92:1, y un botón de 44px medía 43,2 y
   hacía fallar el chequeo sin que nada estuviera mal. `check-sorteo.mjs` espera
   a que la animación termine (`abrirPanel`) antes de medir cualquier cosa.

### Verificación

`npm run check-sorteo` — 8 bloques, todo en verde:
aparece y no rompe recursos · los 3 Instagram salen de `data/sedes.ts` ·
contraste AA de los 9 textos · z-index por encima del nav y del WhatsApp ·
en mobile entra completo (el 3er Instagram y la fecha se ven **sin** scrollear
el panel, y "José Hernández" no se parte) · la X mide 44px ·
**se apaga solo** (4 fechas fingidas con `page.clock`, incluido el 10/09 a las
23:00 y el 11/09 a las 00:30) · cierra con Esc, click afuera y la X, y después
la página vuelve a scrollear · no vuelve a aparecer una vez cerrado · el fondo
no scrollea detrás · el foco arranca en el panel y no se escapa en 12 tabs, y
vuelve al cerrar · en la home no aparece a los 2,5s y sí cuando la intro
termina · con reduced-motion entra sin animación y el fondo igual queda quieto
(ahí Lenis está destruido y el freno lo hace el CSS).

### La foto del premio: DOS recortes de la placa

El cliente mandó la placa que salió en redes (`sorteo.jpg` en la raíz del repo,
899×1599). Se midieron las bandas de texto y **no existe ninguna ventana
vertical que tenga el termo y el mate completos y deje afuera el sello**: el
círculo "TERMO + MATE STANLEY" está en y 605-847, justo arriba del mate. Así que
son dos recortes, elegidos con `<picture>`:

| Archivo | Recorte | Qué entra |
|---|---|---|
| `sorteo-premio.jpg` | 560×920 (x 180, y 500) | escritorio: termo completo, mate, **el sello de la placa** y el manuscrito |
| `sorteo-premio-ancho.jpg` | 899×355 (x 0, y 935) | mobile: el mate y el cuerpo del termo, sin texto |

- Las bandas de texto de la placa, medidas: **y 227-340** ("SORTEO"), **438-499**
  ("¡3 FORMAS DE PARTICIPAR!"), **1317-1393** (el manuscrito) y **1435-1491**
  ("Invitá. Compartí. Ganá."). Ninguno de los dos recortes toca el "3 FORMAS",
  que es el que contradice los dos pasos del pop-up.
- El sello **ya viene dentro del recorte de escritorio**, así que ahí el
  `.sorteo-premio` tipografiado va en `display: none` y sólo aparece en mobile,
  donde el recorte no lo incluye. Ojo con esa regla: el `display: none` tiene que
  ir DONDE ESTABA el `display: grid`, no antes — declarado arriba, el `grid`
  posterior lo gana y se ven los dos sellos.
- La columna de la foto pasó a `0.95fr` (era `0.82fr`): el recorte es 0.609 de
  ratio y con la columna más angosta `cover` le mordía el sello y el borde del
  termo. Al texto le saca 15px, nada.
- La banda de mobile corta en y=1290 y no en 1305: los ascendentes del
  manuscrito asoman antes que la banda que detecta el análisis por filas.

### Para avisarle al cliente

- Se apaga solo el 11/09 a las 00:00; si quiere estirar el sorteo hay que
  cambiar la fecha, rebuildear y volver a subir por FTP (no es automático).
- La placa dice 3 formas de participar y el texto que mandó tiene 2.

## 🚚 2026-09-03 — El sitio se muda al hosting del cliente (FTP)

**DECISIÓN DEL CLIENTE: el sitio va alojado en SU hosting, no en Vercel.** No hay
que convertir nada: ya era `output: 'export'` + `trailingSlash: true` +
`images.unoptimized`, sin API routes ni middleware → HTML plano que anda en un
Apache pelado. **Probado de verdad**: se subió por FTP al hosting de otro cliente
y funcionó (rutas, estilos, fuentes, videos, 404 propio).

**Todo se regenera con un comando, desde cualquier PC:**

```
git pull && npm install && npm run ftp     # deja deploy-ftp/ listo (~16 MB)
npm run probar                             # lo sirve por HTTP y abre el navegador
```

- `scripts/armar-ftp.mjs` — buildea con `NEXT_PUBLIC_SITE_URL=https://fosque.com`
  **fijo adentro del script** (si falta, el fallback es `localhost:3000` y el
  preview de WhatsApp queda roto igual), copia `out/`, suma `deploy/.htaccess`,
  saca `media/hero.mp4` (huérfano desde el 27-ago, 6,6 MB que no pide nadie) y
  **verifica** que el HTML tenga el dominio y estén `_next/`, `media/`, `.htaccess`.
- `scripts/probar-ftp.mjs` (+ `PROBAR SITIO.bat`) — sirve `deploy-ftp/` imitando
  a Apache. ⚠️ Abrir `index.html` con doble clic NO sirve: rutas absolutas.
- `deploy/.htaccess` — 404 propio, gzip y cache. El HTML va con **`no-cache`** a
  propósito, para que un cambio subido por FTP se vea; `_next/static` (con hash
  en el nombre) va con cache de un año — aunque ojo: `mod_expires` y
  `mod_headers` **no están cargados** en este hosting, así que esos bloques no
  aplican (ver abajo). **Sin `RewriteRule`**: acá tira 403 en todo el sitio.
- `deploy/LEEME-SUBIDA.txt` — instructivo de FileZilla. **No se sube** (quedaría
  público en la raíz); tampoco lo copia el script.
- `deploy-ftp/` está en `.gitignore`: es generado, no se versiona.

⚠️ **YA NO HAY DEPLOY AUTOMÁTICO, EN NINGÚN LADO.** Desde que se borró Vercel
(3-sep), un `git push` no actualiza ninguna copia navegable. Lo que ve la gente
es, literalmente, lo último que se subió por FTP.

**Estado real del dominio — el hosting lo arregló ESE MISMO DÍA.** Lo de arriba
(la tabla del relevamiento de la mañana: apex redirigiendo y `www` en Bitrix24)
quedó viejo en horas. Verificado en vivo el 3-sep a las 18:30:

| Qué | Cómo está ahora |
|---|---|
| `fosque.com` y `www.fosque.com` | los **dos** al Apache del hosting, `190.210.9.50` — se acabó la redirección al `.vercel.app` |
| Certificado | **Let's Encrypt emitido el 3-sep 18:48 UTC**, SAN = `fosque.com` + `www.fosque.com`, vence el 2-dic (se renueva solo) |
| `http://` | ya redirige a `https://` **solo, a nivel de servidor** (por eso el forzar-HTTPS del `.htaccess` queda comentado) |
| `https://` (los dos) | **403 Forbidden** de Apache = la raíz web está VACÍA, esperando esta subida |
| FTP | vivo en `ftp.fosque.com:21`, **Pure-FTPd con TLS** (SFTP/22 cerrado: es FTPS explícito, no SFTP) |
| MX | intacto: `MX 0 a.mx.fosque.com`. El mail no se tocó |

✅ **El bloqueante del SSL murió**: era exactamente lo que pedía
`docs/PEDIDO-AL-HOSTING.md` y lo hicieron completo. Ya no hay nada que esperar
de nadie: subir `deploy-ftp/` por FTP y el sitio queda en el dominio propio, con
el preview de WhatsApp andando.

⚠️ **Efecto colateral que hay que avisarle al cliente:** al mover `www` al
hosting, el hosting **desenchufó el sitio viejo de Bitrix24** — `www.fosque.com`
ya no lo sirve. Con él se cayeron el chat **"Asesor Fosque"** (si entraban
consultas al CRM, dejaron de entrar por ahí) y la sección **Planes**, que el
sitio nuevo no tiene. No lo hicimos nosotros, pero pasó hoy: preguntarle si el
chat estaba en uso y si Planes tiene que existir en el sitio nuevo.

**Ajustes de esta sesión (3-sep, PC de casa), ya con el SSL resuelto:**
- `deploy/.htaccess`: se intentó meter un **301 de `www` → apex**… y **tiró el
  sitio entero a 403**. Ver la sección de abajo: en este Apache `mod_rewrite`
  está prohibido. Quedó afuera, y también se borró el bloque comentado de
  "forzar HTTPS" para que nadie lo descomente (el hosting ya redirige solo).
- `app/layout.tsx`: `alternates: { canonical: './' }` → todas las páginas salen
  con `<link rel="canonical">` a `https://fosque.com/...`. Antes no había
  ninguno y Google se quedaba con el `.vercel.app`.

## 🟢 3-sep, 18:50 — **EL SITIO ESTÁ ONLINE EN https://fosque.com**

Subido por FTP a `/htdocs` y **verificado en vivo**: las 7 páginas en 200, el 404
propio andando, y **46 assets + 7 fuentes (14,1 MB) sin un solo roto**, con los
MIME correctos (`video/mp4`, `font/woff2`). gzip activo: la home viaja 102 KB →
**19 KB**. `<link rel="canonical">` y `og:image` absoluto salen bien servidos.

### ⛔ Lo que hay que saber de este Apache (aprendido a los golpes)

**`mod_rewrite` NO SE PUEDE USAR. Nunca.** El vhost tiene `FollowSymLinks` y
`SymLinksIfOwnerMatch` **apagados**, y en ese caso Apache prohíbe `RewriteRule`
en `.htaccess` y contesta **403 a TODO el sitio** — no al pedido que matchea: a
todo. Un 301 de `www` → apex de tres líneas dejó `fosque.com` entero caído. Se
diagnostica en un minuto con el log (ver abajo):

```
AH00670: Options FollowSymLinks and SymLinksIfOwnerMatch are both off, so the
RewriteRule directive is also forbidden ... /users/webs/fosque.com/htdocs/
```

Por eso `deploy/.htaccess` ya **no tiene ni el bloque comentado** de "forzar
HTTPS": descomentarlo tiraba el sitio. Tampoco hace falta, el hosting redirige
`http` → `https` solo, a nivel de servidor.

**Qué módulos hay y cuáles no:**

| Módulo | ¿Anda? | Consecuencia |
|---|---|---|
| `mod_deflate` | ✅ | gzip andando, la home baja a 19 KB |
| `mod_mime` | ✅ | `AddType` aplicado (woff2 y mp4 correctos) |
| `mod_rewrite` | ⛔ **prohibido** | cualquier `RewriteRule` = 403 en todo el sitio |
| `mod_expires` | ❌ no cargado | el `<IfModule>` lo saltea en silencio |
| `mod_headers` | ❌ no cargado | ídem |

⚠️ Como `mod_expires`/`mod_headers` no están, **el HTML sale sin `Cache-Control`**.
No es grave (Apache manda `Last-Modified` + `ETag` y el navegador revalida por
heurística), pero después de subir un cambio por FTP alguien puede ver el HTML
viejo un rato. Si molesta, pedirle al hosting que habilite los dos módulos.

### 🔎 Los logs del vhost están en el FTP

En la raíz del FTP (un nivel arriba de `htdocs`) están **`fosque.com.error.log`
y `fosque.com.access.log`**, al día. Ante cualquier cosa rara, bajarlos y leer el
final: ahí salió el `AH00670` con la ruta real del `DocumentRoot`
(`/users/webs/fosque.com/htdocs`), que es lo que destrabó todo. **No commitear
los logs**: tienen IPs de visitantes y pesan.

### 🗂️ Cómo quedó el FTP

| Carpeta | Qué es |
|---|---|
| `/htdocs` | **la raíz web** — acá vive el sitio nuevo |
| `/htdocs/.htaccess.off` | la redirección vieja al `.vercel.app`, desactivada por el hosting. Inerte, dejarla |
| `/htdocs.off` | el sitio viejo de 2022 (`send-mail.php`, `js/`, `images/`). Parkeado por ellos, **no borrar** |
| `/subdomains` | vacío |
| `/web_fosque_vieja.rar` | backup de 2017, ignorar |

### Pendiente menor: el 301 de `www`

`www.fosque.com` sirve el **mismo** contenido en 200 (mismo docroot) en vez de
redirigir al apex. No se puede arreglar por `.htaccess` (sería un `RewriteRule`).
El daño real —que Google indexe duplicado— ya lo tapan los `<link rel="canonical">`
de las 9 páginas, que apuntan todos a `https://fosque.com/`. Si se quiere el 301
de verdad, pedírselo al hosting junto con `mod_headers`/`mod_expires`.

### 🗑️ Vercel se borró (3-sep, 2ª sesión) — Google lo tenía indexado

**El proyecto de Vercel ya no existe.** `fosque.vercel.app` responde **404
DEPLOYMENT_NOT_FOUND**, verificado. No quedó nada que mantener sincronizado: el
repo es sólo código y backup, y **un `git push` no publica en ningún lado**.

**Por qué se borró antes de lo previsto:** Google lo tenía indexado y lo mostraba
en los resultados con la URL `fosque.vercel.app`, compitiéndole al dominio real.
Servía en 200, sin `X-Robots-Tag` ni `meta robots`, y encima con
`<link rel="canonical">` a **`https://www.fosque.com/`** (la variable de entorno
en Vercel había quedado en `www`): la cadena era `vercel.app → www → apex`, dos
saltos para llegar al dominio bueno.

⚠️ **Por qué NO se le puso `noindex`, que era el reflejo obvio:** Google
desaconseja combinar `noindex` con un `canonical` que apunta a otra página,
porque el `noindex` puede propagarse al destino — y acá el canonical apuntaba al
sitio real. No se arriesga el sitio bueno para limpiar una copia. (`robots.txt`
tampoco servía: bloquea el rastreo, no desindexa, y encima le tapa a Google el
`noindex`.) Si alguna vez hace falta un staging navegable, el lever correcto es
**Deployment Protection → Vercel Authentication**, no `noindex`.

**Qué reemplaza al staging:** `npm run probar`, que sirve `deploy-ftp/` imitando
a Apache. Es mejor que lo que daba Vercel, porque prueba **el paquete exacto que
se sube**: el build de Vercel era distinto (otro `NEXT_PUBLIC_SITE_URL`, incluía
`hero.mp4`, y no tenía el `.htaccess`).

⏳ **Falta que Google lo suelte.** Las URLs caen solas cuando recrawlea el 404;
suele tardar días, a veces un par de semanas. Si urge, la herramienta de
Eliminaciones de Search Console lo esconde en ~1 día, pero exige verificar
`fosque.vercel.app` como propiedad — y eso ya no se puede, porque para
verificarlo había que poder desplegar ahí. **Es la única contra de haber borrado
primero: ahora sólo queda esperar.**

📢 **Avisarle al cliente**: él tenía el link del `.vercel.app`. Ahora está muerto.

### 🧭 El 404 dejó de ser el de Next (3-sep, 2ª sesión)

Hasta hoy `out/404.html` era **el 404 de fábrica de Next**: pantalla negra, en
inglés, "This page could not be found", sin salida. El `ErrorDocument 404` del
`.htaccess` estaba bien enchufado — lo que faltaba era la página. Ahora existe
`app/not-found.tsx`.

**Por qué importa más de lo que parece:** Google todavía tiene indexado el sitio
viejo de Bitrix24, con URLs `/<sede>/home/`. Verificado buscando: están vivas en
el índice `www.fosque.com/nunez/home/`, `/emiliocastro/home/` y
`/sanmartin/home/`. Todo eso cae al 404, así que el 404 es una página de entrada
real, no un rincón.

- Fondo crema y no negro, a propósito: el cliente pidió que no quede ninguna
  superficie oscura en el sitio.
- Lleva Nav y Footer completos, y las **3 sedes como destino principal**: quien
  entra por `/nunez/home/` viene buscando Núñez, no una disculpa.
- `alternates: { canonical: null }` — sin eso heredaba el canonical del layout y
  el 404 salía declarándose canónico en `/_not-found/`, una URL que no existe.
  El `noindex` lo pone Next solo, no hace falta repetirlo.
- `scripts/smoke.mjs` ahora navega **`/nunez/home/`**, que no es una ruta
  inventada: es una de las URLs viejas que Google tiene indexadas.
- Contraste medido sobre el fondo real: `small` y el número de sede dan 5,08:1 y
  los botones 14,64:1. El número estaba en `opacity: .5` y daba **3,23:1** (no
  pasaba AA) → subió a `.65`.

⚠️ **`.eyebrow` es un problema de TODO el sitio, no del 404**: con `opacity:
.55` sobre el crema da **3,74:1** y no pasa AA. Está en home, sedes, novedades,
equipo y franquicia. No se tocó acá porque cambiarlo altera el aspecto de todas
las secciones ya aprobadas: es decisión de diseño, no un bug del 404.

### ⏭️ Los 301 de las URLs viejas — PENDIENTE, decisión abierta

El 404 es la red que atrapa **todas** las URLs viejas, incluidas las que no
conocemos. Aparte de eso, para las que sí conocemos un 301 sería mejor (conserva
posicionamiento y no le hace perder el viaje a nadie):

| URL vieja indexada | Debería ir a |
|---|---|
| `/nunez/home/` | `/nunez/` |
| `/emiliocastro/home/` | `/emilio-castro/` |
| `/josehernandez/home/` | `/jose-hernandez/` |

⚠️ Ojo: los slugs viejos van **sin guion** (`emiliocastro`), los nuevos con.

**No está implementado.** `RewriteRule` acá está prohibido (tira 403 en todo el
sitio, ver arriba), pero **`Redirect` es de `mod_alias`, que es otro módulo y NO
exige `FollowSymLinks`** — el error AH00670 habla sólo de `RewriteRule`. O sea
que en principio esto sí se puede:

```apache
<IfModule mod_alias.c>
  Redirect 301 /nunez/home/ https://fosque.com/nunez/
  Redirect 301 /emiliocastro/home/ https://fosque.com/emilio-castro/
  Redirect 301 /josehernandez/home/ https://fosque.com/jose-hernandez/
</IfModule>
```

El `<IfModule>` hace que, si el módulo no está, el bloque se ignore en vez de
tirar 500. Aun así, **después del 403 del 301 de www no se sube a ciegas**:
probar con UNA línea, cargar el sitio, y si algo huele mal borrarla y volver a
subir el `.htaccess`. Nunca un `Redirect` sobre `/nunez/` a secas: eso sí haría
un loop con la página nueva.

**Antes de escribir la lista completa conviene dar de alta fosque.com en Search
Console** (ya está en la lista de pendientes) y leer el informe de cobertura:
ahí está la lista REAL de URLs viejas indexadas, en vez de las 3 que
encontramos buscando a mano.

⚠️ **Y un tema para el cliente, no técnico:** el sitio viejo cubría TODAS las
sedes de la marca (San Martín, Monte Grande, Adrogué, Villa del Parque), y este
sitio tiene sólo 3. Quien busque "Fosque Monte Grande" cae al 404 y no encuentra
su sede en ningún lado. Hay que preguntarle si las franquicias tienen que
aparecer de alguna forma.

### Lo que sigue

1. **Probar el preview de WhatsApp** mandándose el link: era EL síntoma que
   reportó el cliente. Si no aparece la imagen, sospechar del `og:image`, que
   pesa **384 KB** (WhatsApp suele cortar cerca de 300 KB); se baja a 131 KB
   re-encodeando el PNG a paleta de 256 colores con sharp, sin tocar la URL.
2. ~~Vercel → `NEXT_PUBLIC_SITE_URL`~~ ✅ moot: **Vercel se borró el 3-sep**.
3. **Dar de alta `https://fosque.com` en Search Console.** Ahora es lo más
   urgente de la lista: es lo único que muestra si Google soltó el `.vercel.app`
   y qué URLs viejas de Bitrix24 tiene indexadas (hacen falta para los 301).
4. Avisarle al cliente lo del Bitrix24 caído (chat "Asesor Fosque" y Planes), y
   que el link del `.vercel.app` que él tenía ya no existe.
5. ~~Borrar el proyecto de Vercel~~ ✅ **HECHO el 3-sep.**

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

**✅ TANDA 2 — Emilio Castro, INTEGRADA Y DEPLOYADA (27-ago):**
- `sede-emilio-castro.mp4` = **montaje de 3 tomas** (el original real también
  tenía 2-3 cortes): salón amplio con la profe de espaldas y la remera blanca
  FOSQUE (2,2s) → detalle de la placa FOSQUE en la torre con cuerda roja (1,8s)
  → plano medio de las alumnas (2s). Pedido de Lautaro: NO poner los dos planos
  generales seguidos. Corte con ffmpeg filter_complex trim+concat, luego el
  pipeline de compresión de siempre (1,4 MB).
- `galeria-ec-*.jpg` (las 4): reformer, recepción, detalle, salida. Identidad
  EC respetada: lámparas esféricas amarillas/naranjas colgando SIEMPRE
  presentes, galpón de chapa con lucarnas, reformers con torre, remera blanca
  FOSQUE (vs. buzo negro de JH).
- ⚠️ Inventadas de cero (sin referencia en el clip real): `galeria-ec-recepcion`
  y `galeria-ec-salida` (frente vidriado). Si el cliente las quiere fieles,
  pedir fotos del local.
- Los 3 clips individuales de 5s + las imágenes base 2K quedan en
  `Desktop/Claude/fosque/pruebas-ia/` para re-cortar el montaje sin regenerar.

**✅ TANDA 3 — Serie "equipo", INTEGRADA Y DEPLOYADA (27-ago):**
- Las 6 fotos que alimentan las cards de la home, /equipo y las landings de
  sede: `equipo-1..4.jpg`, `equipo-mantenimiento.jpg` (antes NO existía, era
  placeholder) y `galeria-detalle.jpg` (card mantenimiento de la home + galería
  Núñez). Todas con los uniformes reales (buzo negro con logo F / remera blanca
  FOSQUE) y los espacios reales (correas rosas JH, lámparas EC).
- Detalles menores aceptados por Lautaro: en la grupal el estampado chico dice
  "FOSQU"; en la de mantenimiento las máquinas salieron más de madera clara que
  las reales. Regenerar si el cliente los marca.
- 🔁 **`equipo-mantenimiento.jpg` REGENERADA (27-ago, 2ª pasada)**: la mujer de
  la v1 tenía la cara de una **profe** — la IA la sacó de los frames del rodaje,
  donde las que aparecen son las profesoras. Poner esa cara limpiando es
  atribuirle a una persona real un puesto que no es el suyo. La v2 es la misma
  escena y la misma luz, pero **de espaldas y con la cabeza girada hacia abajo:
  no se ve nada de la cara, ni de perfil**. Regla que queda: en esta serie,
  **cualquier rol que no sea "profe" va sin cara reconocible** — de espaldas o
  plano cerrado. Bonus: de espaldas no se ve el logo del pecho, así que se
  esquiva la deformación de siempre. Prompt: "recreate this EXACT interior…
  change ONLY the person, photographed strictly FROM BEHIND… no part of her face
  is visible, not even a sliver of profile". El 2K fuente está en
  `pruebas-ia/eq-mantenimiento.jpg` (pisó al anterior).

**✅ TANDA 4 — metodo.mp4 e historia.mp4 de la home (27-ago), SIN créditos:**
- Reemplazados por videos "Ken Burns" (zoom lento sobre still) hechos con
  ffmpeg `zoompan` a partir de imágenes IA ya aprobadas: metodo = la profe
  corrigiendo el estiramiento (crop 1080×1350 de `ia-reformers.png`), historia
  = el salón cálido de JH (`ia-salon.png`, 1920×1080). ~10s cada uno, mismas
  dimensiones que los clips reales que reemplazan.
- Receta anti-tembleque del zoompan: upscale grande ANTES del zoompan
  (`scale=3240:4052` / `5504:3072`) y zoom de 0.0003 por frame. Sin eso el
  Ken Burns tiembla.

**Próximas tandas**: Núñez (sin referencia real: pedir fotos del local, aunque
sean de celular) → hero/franquicia si el cliente quiere.
⚠️ Créditos Higgsfield: **~91 de 456** (imagen ≈2, video 5s 1080p = 45) — para
más tandas con video IA hace falta recargar; los Ken Burns salen gratis.

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
2. ~~Instagram por sede~~ ✅ RESUELTO (27-ago): el cliente mandó las 3 URLs y están cargadas en `data/sedes.ts` (cards home + landing con @handle + footer). ~~Falta el Instagram/Facebook GENERAL~~ ✅ **CERRADO el 4-sep**: el nav ya no espera una cuenta general — el ícono despliega las 3 de sede, y **Facebook se borró** (del nav, del menú mobile y del footer) porque la URL nunca llegó y eran links muertos. Si el cliente manda la cuenta de Facebook, vuelve.
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
- ~~**Dominio fosque.com mal apuntado**~~ ✅ **RESUELTO el 3-sep**: el hosting
  apuntó los dos nombres a su Apache y emitió el SSL. El relevamiento del 27-ago
  que estaba acá (redirección al `.vercel.app`, certificado roto, `www` en
  Bitrix24) quedó obsoleto — el estado real y lo que falta está arriba, en
  "2026-09-03 — El sitio se muda al hosting del cliente (FTP)". Lo único que
  queda es **subir `deploy-ftp/` por FTP**.
- **Confirmarle al cliente que el botón de audio del hero se cayó** con el video (lo pide el brief). Vuelve solo si el video vuelve al hero de alguna forma.
- Lighthouse >90 que pide el doc: **ahora sí es alcanzable en las cuatro categorías** — el techo era el video fullscreen en autoplay. Falta medirlo.
- Decap CMS para que Vero publique novedades sola (guía provisoria: `COMO-PUBLIR.md.txt` en la carpeta del proyecto de la PC principal).
- Transición home → sede con barrido de arcos (idea vieja, baja prioridad).

## 🔄 Traspaso 27-ago (2ª sesión, PC principal → PC de casa)

Todo lo de hoy está DEPLOYADO y en el repo — para continuar alcanza `git pull`:

1. **Tandas IA 1-4 en vivo**: JH (video + 5 galería), EC (montaje 3 tomas + 4
   galería), serie equipo (6 fotos: home + /equipo + sedes), metodo/historia de
   la home como Ken Burns (gratis, ffmpeg zoompan).
2. **Instagram por sede cargados** (bloqueante resuelto): cards home + landing
   con @handle + footer. Falta el IG/FB GENERAL (nav sigue en `#`).
3. **Fix mobile**: las cards de sedes se clipeaban 60px abajo (entrance `y:60`
   dentro del scroller nativo). Mobile ahora anima solo opacidad.
4. **`pruebas-ia/` ahora viaja EN el repo** (20MB: clips fuente + stills en JPG
   + README con el pipeline). Los PNG 2K originales quedaron en la PC principal
   (`Desktop/Claude/fosque/pruebas-ia/`) y en el historial de Higgsfield.

**Para seguir (en la PC de casa conviene porque AHÍ está el material en bruto):**
- **Núñez**: pedir fotos del local al cliente (nunca se filmó, no hay referencia).
- **Créditos Higgsfield: quedan ~91** — recargar antes de más videos IA
  (45/clip). Fotos (~2) y Ken Burns (gratis) alcanzan con lo que hay.
- Pendientes de siempre: EVO URL, IG/FB general, horarios por sede, fosque.com.

## 🗂️ Otros archivos fuera del repo (PC de casa, Desktop/Claude/fosque/)

`CONTINUAR.md` viejo (reemplazado por este), `lineamientos nuevos fosque.txt` (copiado a `docs/`), `files/` (brief y prototipos originales). Nada de esto hace falta: para trabajar el SITIO alcanza con el repo. Lo único que sí puede faltar es el material en bruto del rodaje (ver arriba).


## 📹 26-sep — Devolución del cliente por WhatsApp y 4 videos

El material crudo está en `modificaciones-26-09/`: los 4 `.mp4` que grabó
Gerardo, las transcripciones en `desgrabado/*.txt` (whisper small, español) y
las capturas de verificación en `capturas/`.

⚠️ **Los videos 3 y 4 mandan sobre el 1 y el 2.** Grabó los dos primeros de
noche, después "descansó bien" y volvió a grabar los mismos pedidos mejor
ordenados. Lo que sobrevive del 1 y el 2 es lo que el 3 y el 4 repiten.

### Lo que se hizo

1. **Tipografía +20%.** Textual del video 1: *"agrandar todas estas letras,
   todas en toda la página, todas, agrandarlas por lo menos un veinte o un
   treinta por ciento, sin miedo... porque somos todos, como dice mi abuela,
   chicatos"*. Se escalaron 54 declaraciones de `font-size` una por una más la
   base de `body` (la mayoría del texto corrido no tenía tamaño propio y
   heredaba los 16px del navegador). **Los displays no se tocaron**: h1/h2,
   títulos gigantes, contadores y statements quedan como estaban.

   ⚠️ **El nav es la excepción: subió 9%, no 20%** (`.nlink` 0.88 → 0.96rem).
   A +20% la fila de links se partía en dos renglones entre 1101 y 1400px
   —medido en el DOM, no a ojo—. Además el nav cede padding y gap en ese tramo
   (`@media (max-width: 1300px)`), que es lo que permitió el 9% sin romperlo.
   Si alguna vez hay que agrandarlo más, hay que sacar un link del nav.

2. **Index reordenado** (video 3): hero → "FOSQUE no es un gimnasio ni un
   estudio de pilates" (texto nuevo suyo, dos párrafos) → **la página de
   aterrizaje entera** → 24 años → Reformer → **Pilates Reformer + Fuerza y
   Cardio** con botón (videos 2 y 4) → Elegí tu Fosque.

3. **La landing vive en dos lados sin duplicarse.** Su cuerpo salió de
   `app/invitacion/page.tsx` a `components/invitacion/Cuerpo.tsx`, y los
   reveals a `components/invitacion/fx.ts`, que usan InvitacionFx y HomeFx.
   **Tocar el copy ahí, no en las páginas.**
   El hero de la landing NO entra al index: los dos eran, literal, la misma
   pregunta ("¿Qué es lo más importante de tu vida?"). El hero del index se
   quedó con la pregunta y adoptó la bajada rica de la landing.
   `/invitacion/` sigue existiendo con su `noindex` para pautar (decisión
   consultada y aprobada el 26-09).

4. **Landing de sucursal reordenada** (videos 1 y 4). Antes la membresía caía
   después del mapa y "se perdía". Ahora: hero → Fuerza y Cardio → Conocé el
   espacio → equipo → mitos → Membresía F → horarios, dirección y mapa →
   CTA final.

5. **José Hernández**: el hero decía "MATADEROS" (el barrio) y ahora dice
   **José Hernández**, con Mataderos de bajada. El título de la sección se dio
   vuelta a **"Pilates Reformer + Fuerza y Cardio"**. El hero es un díptico
   con **`sede-jh-fuerza.mp4`, que había quedado huérfano el 21-sep** — no se
   reusaron las fotos del díptico de la sección, que está justo abajo.

6. **"sede" → "sucursal"** en todo el copy visible. Las clases, ids, slugs y
   el tipo `Sede` siguen igual a propósito: renombrarlos era ruido sin valor.

7. **Botón "Membresía F"** en nav y footer (antes "Ingresá a tu Perfil").
   ⚠️ Sigue apuntando a `PLATAFORMA_URL`, que **sigue en `'#'`**: el cliente
   todavía no mandó la URL real de socios.

### El scroll trabado de "Elegí tu Fosque" — arreglado

No era GSAP. `.sedes-track` tenía `data-lenis-prevent` en el markup, pero ese
atributo solo hace falta en mobile, donde la track es un scroller nativo
(`overflow-x: auto` vive dentro de `@media (max-width: 900px)`). En desktop la
track queda pineada ocupando toda la pantalla, el puntero está siempre encima
y Lenis tenía orden de ignorar la rueda ahí. Ahora el atributo lo pone y lo
saca `HomeFx` solo en la rama mobile de `matchMedia`.

### Dos cosas que aparecieron al verificar

- **`#info` desbordaba 20px a 360px** en José Hernández: con el texto más
  grande, pares como "Lunes a Viernes" + "7:00 – 22:00" no entran en un
  renglón, y los ítems de un flex no bajan de su contenido. `.horario` ahora
  envuelve.
- **El manifiesto animaba solo el primer párrafo** (`q('.mf-texto')[0]`).
  Con el texto nuevo, que son dos, el segundo quedaba quieto. Ahora se parten
  los dos y las palabras se encadenan en una sola tanda (54 palabras).

### Test intermitente, preexistente

`check-nav` → "Escape lo cierra" falla ~1 de cada 4 corridas con la máquina
cargada. **No es del cambio**: el desplegable tiene `transition: 0.3s` sobre
`visibility` y el test espera 350ms fijos — 50ms de margen. Si molesta, subir
la espera del test, no tocar el CSS.


## ⚠️ 26-sep — Red de seguridad del deploy: `.vercelignore`

**La receta buena sigue siendo la de arriba** (`vercel build --prod && vercel
deploy --prebuilt --prod`): sube solo `out/`. Si la usás, nada de esto te toca.

Lo que pasó el 26-sep fue usar `vercel deploy --prod` **sin** `--prebuilt`,
que como ya avisaba esta guía sube el fuente entero. Lo que NO se sabía es
cuánto: el CLI **no respetó el `.gitignore`** y empezó a mandar
`videos-gimnasio/` y `entrevistas/` (el crudo de cámara). Llegó a **7,1 GB** y
murió con `File size limit exceeded (1 GB)`.

Por eso ahora hay un **`.vercelignore`**, que hace seguro también ese camino.

⚠️ **Su sola existencia desactiva el `.gitignore` para Vercel.** Todo lo que no
esté listado ahí se sube, `.env` y `node_modules` incluidos — por eso el
archivo arranca listando los secretos. Si agregás una carpeta pesada al
proyecto, va ahí también.

También: **el `--scope` no es opcional**. Sin él Vercel contesta `Not
authorized` aunque `vercel whoami` diga que la sesión está bien, porque el
`orgId` de `.vercel/project.json` es del equipo y no del usuario:

```
npx vercel deploy --prod --yes --scope lautaro-mendez-s-projects
```

En el intento fallido el `.env.local` sí subió, pero adentro solo había un
`VERCEL_OIDC_TOKEN` —lo genera el propio CLI, es de vida corta y fue a parar a
Vercel mismo—, así que no hubo nada que rotar.


## 🔧 26-sep (tarde) — 4 ajustes después de que Lautaro revisó el preview

1. **La foto repetida.** Desde que el cuerpo de la landing entró al index,
   `metodo.mp4` aparecía DOS veces en la misma página (en `#programa` y en
   `#version`). `metodo.mp4` se queda en `#programa` —es el video del método— y
   `#version` pasó a `metodo-clase.jpg`, generada para esta tanda.
   **Pipeline**: `nano_banana_pro`, 2 referencias (frames del propio
   `metodo.mp4`), 3:4, 2K. **Tres intentos, y los dos primeros se descartaron
   mirándolos al 100%**: el v2 salió una sala blanca de boutique con reformers
   de madera (nada que ver con el galpón real) y el v3, ya con la sala correcta,
   tenía a la alumna **sin cabeza visible** y los brazos de las dos fundidos.
   El bueno es el v4, con composición simple: la profe sola en el pasillo, de
   perfil, sin tocar a nadie, y las alumnas atrás en poses simétricas.
   Fuentes en `pruebas-ia/metodo-v2..v4.png`.
   ⚠️ **Dos reglas que salieron de acá**: la profe del video real es una persona
   identificable, así que la generada es inventada a propósito; y el buzo va
   **liso, sin el logo**, porque la IA lo deforma (ya anotado el 21-sep).

2. **Las dos tarjetas de `#mejorar` quedan parejas.** Tenían `aspect-ratio: 4/3`
   por foto, y como una tarjeta tiene una foto y la otra dos, cada columna daba
   una altura distinta y los títulos arrancaban desfasados. Ahora la fila de
   fotos tiene altura fija y las imágenes la llenan. Medido: desfase 0px.

3. **Animación en el CTA "¡Activate! Te lo merecés."** Entra palabra por palabra
   con máscara, igual que el título del manifiesto: mismo idioma, no un efecto
   nuevo. Vive en `components/invitacion/fx.ts`, así corre en el index y en
   `/invitacion/`. `partirEnPalabras` salió de HomeFx a `components/texto.ts`
   porque ahora lo usan los dos motores.

4. **El desplegable de "Tu Sucursal" quedaba debajo de la barra del nav.**
   `top` se calculaba sobre la altura del TEXTO del link, así que el panel
   arrancaba **10px arriba** del borde del nav: sus primeros píxeles quedaban
   bajo el crema translúcido y `nav::after` (la línea de gradiente) se pintaba
   por encima. Dos causas, las dos arregladas:
   - `nav .links` medía 27px y quedaba centrado en una fila de ~52px; le faltaba
     `align-self: stretch` para llegar al borde.
   - `nav::after` es un pseudo-elemento posicionado sin z-index, así que pintaba
     después del panel. El panel ahora tiene `z-index: 5`.
   El padding vertical del nav es la variable `--nav-pv`, que usan el propio nav
   y el desplegable: una sola fuente de verdad para los dos estados.
   Medido: 8px de hueco por debajo de la barra, igual arriba y scrolleado.

**Y `check-nav` dejó de ser intermitente**: el test de "Escape lo cierra"
esperaba 350ms fijos contra una `transition: 0.3s` sobre `visibility` (50ms de
margen). Ahora espera a que la transición termine, con techo de 3s. 6 de 6
corridas en verde.


## 26-sep (cierre) — Dos cosas más del cliente

1. **Emilio Castro estaba en 4.6 y las tres sucursales están en 4.7.** Avisó él.
   Los `reviews` también estaban viejos (620 / 395 / 186, de agosto) y se
   desfasaban solos porque son números fijos. **Resuelto de raíz: la interfaz
   ya no muestra el conteo crudo sino "más de N opiniones"**, con
   `opinionesDesde()` en `data/sedes.ts`, que redondea para ABAJO al múltiplo
   de 50 (y baja uno más si cae justo, para que el "más de" no sea mentira).
   620 → más de 600, 395 → más de 350, 186 → más de 150. El número real se
   sigue guardando en `reviews`, así se sabe de cuándo es el dato; el que
   envejece bien es lo que se muestra. **Ya no hay que perseguir esto.**

2. **Membresía F en el menú mobile: era el último ítem**, debajo de "Contacto"
   y fuera de la pantalla, así que el cliente la veía "como una cosa más,
   chiquita" siendo lo más importante que vende. Ahora **abre el menú**: bloque
   destacado con el nombre, una línea explicando qué es (copy suyo) y las dos
   intenciones separadas — "Quiero mi Membresía F" (WhatsApp) e "Ingresar a mi
   Membresía F" (plataforma, todavía en `'#'`).
   Se mantuvo compacto a propósito: el menú venía justo de alto en 390x844.
   Verificado que los 3 Instagram siguen alcanzándose **sin scrollear** en
   todos los anchos, que era la restricción que ya existía.


## 🅿️ 26-sep — DÓNDE QUEDÓ ESTO (leer primero al retomar)

**Todo lo del 26-sep está en la rama `modificaciones-26-09`, NO en `main`.**
Está publicado en el preview y **esperando que el cliente lo mire** — el
viernes 26 desapareció sin contestar.

Desde la otra PC:

```bash
git fetch && git checkout modificaciones-26-09
npm install
```

**Si aprueba** (y recién ahí):

```bash
npm run build && node scripts/smoke.mjs && npm run check-nav && node scripts/check-hero.mjs
npm run ftp        # ⚠️ REGENERAR: el deploy-ftp/ que está quedó con el copy viejo
```
y subir `deploy-ftp/` a `/htdocs` con FileZilla (`deploy/LEEME-SUBIDA.txt`).
Mergear a `main` es decisión de Lautaro: se dejó en rama a propósito para no
tocar `main` con algo que el cliente todavía no aprobó.

**Si pide cambios**: el crudo de su devolución (4 videos + transcripciones)
está en `modificaciones-26-09/`, y arriba en este archivo está el detalle de
qué se hizo y por qué.

⚠️ **Lo único que sigue trabado es suyo: la URL real de socios.** Ahora pesa
más que antes, porque "Membresía F" pasó a ser el primer bloque del menú
mobile y el botón "Ingresar" no lleva a ningún lado. Si no la manda, evaluar
dejar solo el botón de WhatsApp para no tener un botón muerto en el lugar más
visible del menú.

Pendiente de cobro al 26-sep: esta tanda de cambios (presupuestada en
$150.000, ver el hilo con Lautaro), además de los $200.000 de la seña y los
videos con IA.
