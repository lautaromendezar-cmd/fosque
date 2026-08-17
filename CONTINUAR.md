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

## ⏳ Pendientes

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
6. Media real del rodaje: reemplazar por nombre en `public/media/` — prioridad `hero.mp4` CON AUDIO (relato continuo: rutina/cansancio → Fosque → transformación), `franquicia.mp4`, `equipo-mantenimiento.jpg`, y todas las fotos IA (las del "equipo" son IA: cambiarlas antes del lanzamiento real).
   ⚠️ El rodaje del 12-ago cubrió **solo las 2 sedes de Mataderos** (material en
   `Desktop/Fosque`, fuera del repo: 99 ARW + 296 clips 1080p a 119,88fps con
   audio). **Núñez no se filmó** y el doc pide material real de cada sede.
   Además hoy las 3 sedes comparten los mismos `galeria-*.jpg`: con material real
   conviene separarlos por sede en `data/sedes.ts`.

**Técnicos:**
- Dominio fosque.com + setear `NEXT_PUBLIC_SITE_URL` en Vercel (para el OG de WhatsApp). ⚠️ El doc del cliente lo encabeza como si el dominio ya existiera: hoy es fosque.vercel.app. Definir quién lo compra.
- Botón de audio del hero: `HERO_CON_AUDIO` en `app/page.tsx` (hoy `false`). Ponerlo en `true` cuando `hero.mp4` traiga pista de audio — el cliente lo pide expresamente. Y ahí `HERO_RATE` (`HomeFx.tsx`) tiene que volver a 1: a 0,55x el audio se deforma.
- Lighthouse >90 que pide el doc: alcanzable en accesibilidad / best practices / SEO. En **performance** con video fullscreen en autoplay no es realista; se mejora con el poster + comprimir el clip del rodaje. Conviene fijarle la expectativa antes de que reclame el número.
- Decap CMS para que Vero publique novedades sola (guía provisoria: `COMO-PUBLIR.md.txt` en la carpeta del proyecto de la PC principal).
- Transición home → sede con barrido de arcos (idea vieja, baja prioridad).

## 🗂️ Archivos fuera del repo (PC principal, Desktop/Claude/fosque/)

`CONTINUAR.md` viejo (reemplazado por este), `lineamientos nuevos fosque.txt` (copiado a `docs/`), `files/` (brief y prototipos originales). Todo lo necesario para trabajar está EN el repo.
