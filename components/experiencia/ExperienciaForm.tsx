'use client';

import { useEffect, useRef, useState } from 'react';
import { sedes, getSede, waLink } from '@/data/sedes';
import { EXPERIENCIA } from '@/data/experiencia';
import { FORM_ID, EVENTO_IR_AL_FORM, type DetalleIrAlForm } from './IrAlForm';

type Campos = { nombre: string; telefono: string; email: string; sede: string };
type Enviado = { url: string; sede: string; nombre: string };

/** Formulario de la campaña Experiencia. No guarda nada en ningún lado: arma
 *  el mensaje con los datos y abre el WhatsApp de la sucursal elegida (pedido
 *  de Lautaro, 5-oct). La confirmación lo dice así, sin prometer un registro
 *  que no existe: lo que llega a la sede es el mensaje, si ella lo envía. */
export default function ExperienciaForm() {
  const [f, setF] = useState<Campos>({ nombre: '', telefono: '', email: '', sede: '' });
  const [enviado, setEnviado] = useState<Enviado | null>(null);

  // Desde el hero de cada sede se llega con ?sede=<slug>: la sucursal viene
  // ya elegida. Se lee al montar (export estático: no hay query en el build).
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get('sede');
    if (slug && getSede(slug)) setF((prev) => ({ ...prev, sede: slug }));
  }, []);

  // Los botones de los bloques de abajo (IrAlForm) suben hasta acá: el form
  // se resalta al llegar y, si el botón era de una sede, la deja elegida.
  const [resalta, setResalta] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const onIr = (e: Event) => {
      const sede = (e as CustomEvent<DetalleIrAlForm>).detail?.sede;
      if (sede && getSede(sede)) setF((prev) => ({ ...prev, sede }));
      setResalta(false);
      if (timer.current) clearTimeout(timer.current);
      // después del scroll, no durante: que se vea al llegar
      timer.current = setTimeout(() => {
        setResalta(true);
        timer.current = setTimeout(() => setResalta(false), 1600);
      }, 700);
    };
    window.addEventListener(EVENTO_IR_AL_FORM, onIr);
    return () => {
      window.removeEventListener(EVENTO_IR_AL_FORM, onIr);
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);
  const clase = `fr-form exp-form${resalta ? ' resalta' : ''}`;

  const set =
    (k: keyof Campos) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setF({ ...f, [k]: e.target.value });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sede = getSede(f.sede);
    if (!sede) return;
    const texto = [
      `Hola Fosque ${sede.nombre}! Quiero mi sesión de Experiencia Pilates Reformer sin cargo 🎁`,
      `• Nombre: ${f.nombre.trim()}`,
      `• Celular: ${f.telefono.trim()}`,
      `• Email: ${f.email.trim()}`,
    ].join('\n');
    const url = waLink(sede.whatsapp, texto);
    setEnviado({ url, sede: sede.nombre, nombre: f.nombre.trim().split(/\s+/)[0] });
    // Sin 'noopener' en las features: con él window.open devuelve null
    // siempre y no se puede saber si el navegador bloqueó la pestaña.
    const w = window.open(url, '_blank');
    if (w) w.opener = null;
    else window.location.href = url;
  };

  if (enviado) {
    return (
      <div className={`${clase} exp-ok`} id={FORM_ID} role="status">
        <div className="ok-ico" aria-hidden="true">
          ✓
        </div>
        <h2>¡Listo, {enviado.nombre}!</h2>
        <p>
          Te abrimos WhatsApp con tus datos. Enviá el mensaje a <b>Fosque {enviado.sede}</b> y
          una Ejecutiva Fosque te contacta por WhatsApp para agendar tu sesión.
        </p>
        <a className="btn solid" href={enviado.url} target="_blank" rel="noopener">
          ¿No se abrió? Abrir WhatsApp
        </a>
        <button type="button" className="otra" onClick={() => setEnviado(null)}>
          Corregir mis datos
        </button>
      </div>
    );
  }

  return (
    <form className={clase} id={FORM_ID} onSubmit={onSubmit}>
      <label>
        <span>
          Nombre y Apellido <span className="ast">*</span>
        </span>
        <input
          required
          value={f.nombre}
          onChange={set('nombre')}
          placeholder="Tu nombre y apellido"
          autoComplete="name"
        />
      </label>
      <label>
        <span>
          Celular / WhatsApp <span className="ast">*</span>
        </span>
        <input
          required
          type="tel"
          inputMode="tel"
          pattern="[0-9 +\-\(\)]{8,}"
          title="Tu número de celular, con característica (ej. 11 1234-5678)"
          value={f.telefono}
          onChange={set('telefono')}
          placeholder="11 1234-5678"
          autoComplete="tel"
        />
      </label>
      <label>
        <span>
          Email <span className="ast">*</span>
        </span>
        <input
          required
          type="email"
          value={f.email}
          onChange={set('email')}
          placeholder="tu@email.com"
          autoComplete="email"
        />
      </label>
      <label>
        <span>
          Sucursal Fosque de preferencia <span className="ast">*</span>
        </span>
        <select required value={f.sede} onChange={set('sede')}>
          <option value="" disabled>
            Elegí tu sucursal
          </option>
          {sedes.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.barrio !== s.nombre ? `${s.nombre} (${s.barrio})` : s.nombre}
            </option>
          ))}
        </select>
      </label>
      <button className="btn cta" type="submit">
        {EXPERIENCIA.cta}
      </button>
      <p className="exp-legal">{EXPERIENCIA.legal}</p>
    </form>
  );
}
