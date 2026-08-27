# pruebas-ia — assets fuente del pipeline IA (27-ago-2026)

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
