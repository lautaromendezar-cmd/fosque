'use client';

import { useEffect, useState } from 'react';
import IrAlForm, { FORM_ID } from './IrAlForm';
import { EXPERIENCIA } from '@/data/experiencia';

/** Botón fijo abajo, solo en mobile (lo limita el CSS): la landing es larga y
 *  el formulario queda arriba de todo. Aparece cuando el form sale de la
 *  pantalla y se va cuando vuelve a verse, así nunca hay dos llamados juntos. */
export default function BarraMovil() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const form = document.getElementById(FORM_ID);
    if (!form) return;
    const io = new IntersectionObserver(([e]) => setVisible(!e.isIntersecting));
    io.observe(form);
    return () => io.disconnect();
  }, []);

  return (
    <div className={`exp-barra-movil${visible ? ' on' : ''}`} aria-hidden={!visible}>
      <IrAlForm className="btn cta">
        <span aria-hidden="true">🎁</span> {EXPERIENCIA.cta}
      </IrAlForm>
    </div>
  );
}
