import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import RingsDeco from '@/components/RingsDeco';
import ExperienciaFx from '@/components/experiencia/ExperienciaFx';
import ExperienciaForm from '@/components/experiencia/ExperienciaForm';
import BarraMovil from '@/components/experiencia/BarraMovil';
import InvitacionCuerpo from '@/components/invitacion/Cuerpo';
import { WA_GENERAL } from '@/data/sedes';
import { EXPERIENCIA } from '@/data/experiencia';

/* Landing de la campaña Experiencia (brief del cliente, 5-oct-2026): se llega
   desde la barra de aviso de todas las páginas, el home y los botones de cada
   sede. Textos del brief tal cual (data/experiencia.ts).
   Primera pantalla: lo corto + el formulario. Abajo, a pedido de Gerardo
   ("la página sigue y te explica todo y en cada pantalla un llamado a la
   acción"), el cuerpo de /invitacion/ en modo 'landing': cada bloque con su
   botón que sube al formulario, más Pilates + Musculación. Un solo form,
   así hay uno solo que conectar al CRM.
   No lleva la barra de aviso (sería un link a sí misma) ni el WhatsApp
   flotante (competiría con el formulario); en mobile, BarraMovil.
   Como /invitacion/, es de campaña: no se indexa. */

export const metadata: Metadata = {
  title: `${EXPERIENCIA.titulo} — ${EXPERIENCIA.badge}`,
  description: `${EXPERIENCIA.cita} Anotate y viví 1 sesión de Experiencia Pilates Reformer sin cargo en la sucursal Fosque que elijas.`,
  robots: { index: false, follow: true },
};

export default function ExperienciaPage() {
  return (
    <ExperienciaFx>
      <Nav
        waNumero={WA_GENERAL}
        waTexto="Hola Fosque! Quiero mi sesión de experiencia sin cargo"
        aviso={false}
      />

      <section className="exp-hero" data-bg="#F0E9D8">
        <RingsDeco id="exp-a" from="#F8E27A" to="#F29B38" className="bl" />
        <RingsDeco id="exp-b" from="#F3A6C8" to="#CDB6D9" className="br" />
        <div className="wrap exp-grid">
          <div className="exp-copy">
            <span className="pulso">{EXPERIENCIA.badge}</span>
            <h1>
              {EXPERIENCIA.titulo}
            </h1>
            <blockquote>“{EXPERIENCIA.cita}”</blockquote>
          </div>
          <ExperienciaForm />
        </div>
      </section>

      <InvitacionCuerpo modo="landing" />

      <Footer />
      <BarraMovil />
    </ExperienciaFx>
  );
}
