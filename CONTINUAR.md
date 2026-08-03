# FOSQUE — Estado del proyecto

## Qué hay
Sitio Next.js 15 (App Router, `output: 'export'`, 100% estático) en `fosque/site/`.
Construido según `files/BRIEF-CLAUDE-CODE.md` sobre los prototipos `files/index.html` y `files/sede.html`.

- `/` — Home cinematográfica: preloader (1ª visita por sesión), hero con título por palabras, fondo vivo (el body muta de color por capítulo con ScrollTrigger), arcos con dibujo scrub, counters de historia, programa con columna sticky, 3 sedes, acordeón de mitos, equipo, CTA final.
- `/jose-hernandez` `/emilio-castro` `/nunez` — Landings de conversión autónomas: hero sandwich (título gigante detrás/delante del video), marquee, horarios REALES de cada sede, WhatsApp PROPIO de cada sede, mapa embebido + "Cómo llegar" (place_id), galería horizontal, equipo, mitos (respuesta de "no tengo tiempo" adaptada al horario de esa sede), CTA.
- `/novedades` — Cartelera markdown: Vero agrega archivos `.md` en `site/content/novedades/` (guía en `COMO-PUBLICAR.md.txt`). Decap CMS pendiente (requiere repo en GitHub).

Datos centralizados en `site/data/sedes.ts` (única fuente de verdad: direcciones, WhatsApp, horarios, ratings, place_ids, guiones de rodaje) y `site/data/mitos.ts`.

Stack: GSAP + ScrollTrigger vía `useGSAP` (cleanup automático), Lenis sincronizado con ScrollTrigger, `prefers-reduced-motion` respetado, fuentes Archivo (wdth) + Quicksand vía next/font.

## Comandos
```
cd fosque/site
npm run dev        # desarrollo
npm run build      # export estático a out/
node scripts/smoke.mjs  # smoke test Playwright (sirve out/, consola + screenshots)
```

## Pendientes del CLIENTE (bloquean lo marcado)
1. **Logo vectorial SVG** → reemplazar el path provisorio del isologo F en `components/home/Preloader.tsx` y el wordmark tipografiado del nav/footer (debe ser el SVG oficial, nunca tipografiado).
2. **Momo Trust Display .woff2** + licencia web → hoy fallback Archivo/Quicksand.
3. **Confirmar nombres comerciales vs direcciones** ⚠️ "José Hernández" tiene pin en Bragado 5952 y "Emilio Castro" en Andalgalá 1395. Marcado con `direccionPendiente: true` en `data/sedes.ts`.
4. **URL login EVO** → constante `EVO_URL` en `components/Nav.tsx` (hoy `#`).
5. **Instagram por sede** → campo `instagram` en `data/sedes.ts` (hoy null → "Muy pronto").
6. **Videos reales** → cada placeholder (`components/Vph.tsx`) tiene el guion de rodaje anotado; al llegar el material se cambia por `<video>` MP4 H.265 + WebM, poster, `preload="metadata"`, hero ≤ 4MB loop 8-12s sin audio.

## Pendientes técnicos (siguiente iteración)
- Deploy a Vercel (crear repo GitHub primero; ahí también se habilita Decap CMS para novedades).
- Transición de página home → sede con barrido de arcos (View Transitions / template.tsx).
- Secciones pin avanzadas del brief (sedes apiladas fullscreen en home, beneficios sobre video pineado) — versión actual usa sticky/reveal más simple y robusta.
- Favicon + OG image cuando esté el logo oficial.
