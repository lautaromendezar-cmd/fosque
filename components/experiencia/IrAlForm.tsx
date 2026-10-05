'use client';

/* Los botones de cada bloque de /experiencia/ no repiten el formulario: suben
   al único que hay, arriba (un solo form que conectar al CRM). El scroll lo
   hace SmoothScroll como con cualquier ancla de la misma página; este
   componente además avisa al form qué sede traer elegida (el bloque de
   Pilates + Musculación sube con José Hernández) y que se resalte. */

export const FORM_ID = 'formulario';
export const EVENTO_IR_AL_FORM = 'experiencia:ir-al-form';

export type DetalleIrAlForm = { sede?: string };

export default function IrAlForm({
  sede,
  className,
  children,
}: {
  sede?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={`#${FORM_ID}`}
      className={className}
      onClick={() =>
        window.dispatchEvent(
          new CustomEvent<DetalleIrAlForm>(EVENTO_IR_AL_FORM, { detail: { sede } }),
        )
      }
    >
      {children}
    </a>
  );
}
