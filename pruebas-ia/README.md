# pruebas-ia — assets fuente del pipeline IA (27-ago-2026, gimnasio JH 16-sep-2026)

Material generado con Higgsfield (Nano Banana Pro + Seedance 2.5) usando frames
de los videos reales como referencia. **Esta carpeta NO se sirve** (está fuera
de `public/`): existe para poder re-cortar montajes y re-animar sin regenerar.
El detalle del pipeline y los prompts están en `CONTINUAR.md`.

## Clips (fuente de los montajes)

- `clip-salon-sol.mp4` — salón JH con sol → es el `sede-jose-hernandez.mp4` en vivo
- `clip-ec-sede.mp4` / `ec-toma2/3` (ver jpg) — las 3 tomas de EC; el montaje
  vivo (`ec-sede-montaje.mp4`) es: amplia 2,2s → placa FOSQUE 1,8s → medio 2s.
  Para re-cortar: ffmpeg filter_complex trim+concat (comando en CONTINUAR).
- `clip-reformers.mp4`, `clip-logo-maquina.mp4`, `clip-salon.mp4` — pruebas
  aprobadas sin uso asignado todavía.
- `metodo-kb.mp4` / `historia-kb.mp4` — Ken Burns (ya en vivo en la home).

## Stills (JPG comprimido; los PNG 2K originales quedaron en la PC principal
y en el historial de generaciones de la cuenta Higgsfield)

- `ia-*.jpg` — bases 16:9 de JH (salon, salon-sol, reformers, logo-maquina)
- `ec-base-video.jpg`, `ec-toma2/3.jpg` — bases 16:9 de EC
- `gal-jh-*.jpg` / `gal-ec-*.jpg` — galerías (integradas en public/media a 896×1200)
- `eq-*.jpg`, `gal-detalle-generico.jpg` — serie equipo (integrada)
- `jh-frame-01/03.jpg` — frames del video real de JH usados como referencia

## Regla de oro del logo

Para que el logo FOSQUE salga EXACTO: pasarle a Nano Banana el lockup oficial
como imagen de referencia aparte (crop de `app/opengraph-image.png`:
`ffmpeg -i opengraph-image.png -vf "crop=440:130:50:50" logo.png`) y pedir
"reproduced EXACTLY as in the logo reference image". Sin eso, lo deforma.

## Gimnasio de José Hernández (16-sep-2026, tanda 5, vía CLI `higgsfield`)

Material del rodaje del gimnasio (38 clips en `videos-gimnasio/`, fuera del repo
por .gitignore). Mismo pipeline: frame real → Nano Banana Pro 2K con el frame
como `image_references` → Seedance 2.5 `omni_reference` con `start_image`.

- `gym-seleccion.jpg` — lámina con los 4 cuadros elegidos y su rol
- `gym-frame-C00xx-*.jpg` — los 5 frames reales de referencia (1920×1080)
- `gym-video-sala-base.jpg` — recreación 16:9 de C0063, base del video
- `gym-cardio.jpg` / `gym-profe.jpg` / `gym-maquinas.jpg` / `gym-discos.jpg` —
  recreaciones 3:4 (2K) → en vivo como `fuerza-jh-cardio/profe/maquinas.jpg`
  y `galeria-jh-fuerza.jpg` (896×1200)
- `clip-gym-sala.mp4` — Seedance 5 s 1080p sin comprimir → `sede-jh-fuerza.mp4`
- `gal-jh-fuerza-v1-inventada.jpg` — la galería "fuerza" anterior, inventada
  de cero por la IA (no había toma real). Reemplazada por los discos.
- Ojo: en `gym-cardio.jpg` el techo salió de chapa con vigas de madera; el real
  es cielorraso liso con spots. Regenerar si el cliente lo marca.

## Clase de Reformer para el index (26-sep-2026, vía CLI `higgsfield`)

Salió de un problema de composición, no de un pedido del cliente: cuando el
cuerpo de la landing de invitación entró al index, `metodo.mp4` quedó
apareciendo DOS veces en la misma página. `metodo.mp4` se queda en `#programa`
(es el video del método) y `#version` pasó a una imagen nueva.

Pipeline: dos frames del propio `metodo.mp4` como `image-references` →
`nano_banana_pro` 3:4 2K. 6 créditos los tres intentos.

- `metodo-v2.png` — ❌ **descartada**: salió una sala blanca de boutique con
  reformers de madera clara. Composición linda, pero no es el galpón de
  Fosque. Faltaba describir la sala, no alcanzaba con pasar el frame.
- `metodo-v3.png` — ❌ **descartada**: la sala ya es la correcta (mural de
  pinos, bombitas colgando, reformers metálicos con correas turquesa y
  amarillas), pero al 100% la alumna **no tiene cabeza visible** y los brazos
  de las dos se funden. El pedido tenía dos cuerpos entrelazados y ahí la IA
  se rompe.
- `metodo-v4.png` — ✅ la que quedó → `public/media/metodo-clase.jpg`
  (896×1200). La clave fue **simplificar la composición**: la profe sola en el
  pasillo, de perfil, sin tocar a nadie, y las alumnas atrás acostadas en
  poses simétricas y bien separadas.

⚠️ Dos reglas de esta tanda:
- La profe del video real es una **persona identificable**. La generada es
  inventada a propósito, no un parecido de ella.
- El buzo va **liso, sin el logo**: la IA lo deforma (ya estaba anotado arriba,
  y acá se evitó de entrada en vez de pelearlo).
