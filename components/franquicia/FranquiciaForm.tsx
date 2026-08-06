'use client';

import { useState } from 'react';
import { waLink, WA_GENERAL } from '@/data/sedes';

type Campos = { nombre: string; telefono: string; zona: string; mensaje: string };

/** Formulario de captación: arma el mensaje y sigue la charla por WhatsApp. */
export default function FranquiciaForm() {
  const [f, setF] = useState<Campos>({ nombre: '', telefono: '', zona: '', mensaje: '' });

  const set =
    (k: keyof Campos) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setF({ ...f, [k]: e.target.value });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const texto = [
      'Hola Fosque! Quiero información sobre la franquicia.',
      `• Nombre: ${f.nombre}`,
      `• Teléfono: ${f.telefono}`,
      `• Zona de interés: ${f.zona}`,
      f.mensaje.trim() && `• Sobre mí: ${f.mensaje.trim()}`,
    ]
      .filter(Boolean)
      .join('\n');
    window.open(waLink(WA_GENERAL, texto), '_blank', 'noopener');
  };

  return (
    <form className="fr-form" onSubmit={onSubmit}>
      <label>
        Tu nombre
        <input
          required
          value={f.nombre}
          onChange={set('nombre')}
          placeholder="Nombre y apellido"
          autoComplete="name"
        />
      </label>
      <label>
        Tu WhatsApp
        <input
          required
          value={f.telefono}
          onChange={set('telefono')}
          placeholder="11 1234-5678"
          inputMode="tel"
          autoComplete="tel"
        />
      </label>
      <label className="full">
        ¿Dónde te imaginás tu Fosque?
        <input
          required
          value={f.zona}
          onChange={set('zona')}
          placeholder="Barrio, ciudad o zona de interés"
        />
      </label>
      <label className="full">
        Contanos de vos <span className="opc">(opcional)</span>
        <textarea
          rows={4}
          value={f.mensaje}
          onChange={set('mensaje')}
          placeholder="Tu experiencia, si ya tenés un local en vista, en qué plazo te imaginás abriendo…"
        />
      </label>
      <button className="btn solid" type="submit">
        Enviar por WhatsApp
      </button>
    </form>
  );
}
