/* El pop-up del sorteo, apagado para los OTROS verificadores.
   TEMPORAL: se borra junto con el pop-up cuando pase el 10/09.

   Por qué existe: el pop-up aparece a los 2,2s en las páginas internas, así que
   se le mete encima a los screenshots del smoke y a las mediciones de
   check-hero (contraste y luminancia del hero medidos sobre el modal, que es
   cualquier cosa). Ya pasó: `nunez.png` del smoke salió con el pop-up puesto y
   ninguna alarma sonó — el promedio de luminancia no lo delató porque el panel
   es crema, y sólo se descubrió porque el PNG tenía el md5 idéntico al del
   screenshot del propio pop-up.

   Se apaga marcando la misma clave que usa el componente cuando lo cerrás. Va
   inyectado por el servidor de prueba y no por `addInitScript` a propósito: así
   cubre todas las páginas y todos los contextos de un solo lugar, sin depender
   de que cada `newPage()` se acuerde de pedirlo.

   ⚠️ La clave tiene que ser la MISMA que `VISTO` en components/Sorteo.tsx. */
export const CLAVE_SORTEO = 'fosque-sorteo-estreno-2026-09';

const SNIPPET = `<script>try{localStorage.setItem('${CLAVE_SORTEO}','1')}catch(e){}</script>`;

/** Mete el apagado del pop-up en un HTML que está por servirse. */
export function apagarSorteo(html) {
  const i = html.indexOf('<head>');
  if (i === -1) return html;
  return html.slice(0, i + 6) + SNIPPET + html.slice(i + 6);
}

/** ¿Este archivo es un HTML al que hay que inyectarle el apagado? */
export const esHtml = (file) => file.endsWith('.html');
