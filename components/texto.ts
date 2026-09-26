/** Parte el texto de un elemento en palabras animables.
 *
 *  Vivía dentro de HomeFx. Salió acá el 26-09 porque el CTA "¡Activate! Te lo
 *  merecés." está en el cuerpo compartido de la landing, que se renderiza en
 *  el index (HomeFx) y en /invitacion/ (InvitacionFx): los dos motores lo
 *  necesitan y no tiene sentido duplicarlo.
 *
 *  Devuelve los `<span class="pal">`, uno por palabra. Es idempotente: si el
 *  elemento ya se partió devuelve los de antes, así dos motores sobre el mismo
 *  nodo no lo rompen.
 *
 *  Con `mascara`, cada palabra queda dentro de un marco con `overflow: hidden`
 *  para que pueda entrar desde abajo sin verse hasta que corresponde.
 */
export const partirEnPalabras = (el: HTMLElement, mascara: boolean) => {
  if (el.dataset.partido) return Array.from(el.querySelectorAll<HTMLElement>('.pal'));
  const palabras = (el.textContent ?? '').trim().split(/\s+/);
  el.textContent = '';
  const salida: HTMLElement[] = [];
  palabras.forEach((palabra, i) => {
    const marco = document.createElement('span');
    marco.style.display = 'inline-block';
    if (mascara) {
      marco.style.overflow = 'hidden';
      marco.style.verticalAlign = 'top';
      /* los display van con line-height 0.95: sin este aire el marco le corta
         la cola a la "g" de "gimnasio" y a la "q" de "Fosque" */
      marco.style.paddingBottom = '0.16em';
      marco.style.marginBottom = '-0.16em';
    }
    const pal = document.createElement('span');
    pal.className = 'pal';
    pal.style.display = 'inline-block';
    pal.textContent = palabra;
    marco.appendChild(pal);
    el.appendChild(marco);
    if (i < palabras.length - 1) el.appendChild(document.createTextNode(' '));
    salida.push(pal);
  });
  el.dataset.partido = '1';
  return salida;
};
