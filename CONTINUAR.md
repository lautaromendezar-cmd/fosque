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
npm run build            # export estático a out/
node scripts/smoke.mjs   # Playwright: consola + screenshots de las 5 rutas
```

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

## ⏳ Pendientes

**Del CLIENTE (bloquean):**
1. URL login EVO → `EVO_URL` en `components/Nav.tsx` (hoy `#`; también en Footer).
2. Instagram/Facebook general → `IG_URL`/`FB_URL` en `Nav.tsx` + Footer. Instagram por sede → campo `instagram` en `data/sedes.ts` (activa el botón en las cards).
3. Confirmar nombres comerciales vs direcciones ⚠️ "José Hernández" pin en Bragado 5952, "Emilio Castro" en Andalgalá 1395 (`direccionPendiente: true`).
4. Media real del rodaje: reemplazar por nombre en `public/media/` — prioridad `hero.mp4` CON AUDIO (relato continuo: rutina/cansancio → Fosque → transformación), `franquicia.mp4`, `equipo-mantenimiento.jpg`, y todas las fotos IA (las del "equipo" son IA: cambiarlas antes del lanzamiento real).

**Técnicos:**
- Dominio fosque.com + setear `NEXT_PUBLIC_SITE_URL` en Vercel (para el OG de WhatsApp).
- Decap CMS para que Vero publique novedades sola (guía provisoria: `COMO-PUBLIR.md.txt` en la carpeta del proyecto de la PC principal).
- Transición home → sede con barrido de arcos (idea vieja, baja prioridad).

## 🗂️ Archivos fuera del repo (PC principal, Desktop/Claude/fosque/)

`CONTINUAR.md` viejo (reemplazado por este), `lineamientos nuevos fosque.txt` (copiado a `docs/`), `files/` (brief y prototipos originales). Todo lo necesario para trabajar está EN el repo.
