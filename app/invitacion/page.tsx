import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import WaFloat from '@/components/WaFloat';
import Media from '@/components/Media';
import RingsDeco from '@/components/RingsDeco';
import InvitacionFx from '@/components/invitacion/InvitacionFx';
import InvitacionCuerpo from '@/components/invitacion/Cuerpo';
import { WA_GENERAL } from '@/data/sedes';

/* Landing de campaña ("página de aterrizaje" del PDF del cliente, 21-sep-2026).
   El copy es suyo palabra por palabra, en el mismo orden. Solo se tocaron
   dos tildes de tuteo que convivían con el voseo del resto ("Actívate" →
   "Activate", "Anótate" → "Anotate") y "Inicia" → "Inicial" en los niveles.
   Es para anuncios: no se indexa ni está en el nav; se llega por el link de
   la campaña. La persona elige su sede al final y cae en el WhatsApp de esa
   sede, como en todo el sitio. */

export const metadata: Metadata = {
  title: 'Semana de Invitación — 2 sesiones para vivir la experiencia Fosque',
  description:
    '¿Qué es lo más importante de tu vida? Todo eso necesita tu mejor versión. Anotate hoy y accedé a tu Semana de Invitación en la sucursal Fosque que elijas.',
  robots: { index: false, follow: false },
};

export default function InvitacionPage() {
  return (
    <InvitacionFx>
      <Nav
        waNumero={WA_GENERAL}
        waTexto="Hola Fosque! Quiero anotarme a la Semana de Invitación"
      />

      <div className="badge">Semana de Invitación</div>

      {/* HERO: la pregunta, gigante, invadiendo la foto */}
      <section className="inv-hero" data-bg="#F0E9D8">
        <RingsDeco id="inv-hero" from="#F8E27A" to="#F29B38" className="bl" />
        <div className="wrap">
          <div className="eyebrow">Viví la Experiencia Fosque</div>
          <h1>
            <span className="l">¿Qué es</span>
            <span className="l">lo más importante</span>
            <span className="l">de tu vida?</span>
          </h1>
          <Media
            className="inv-media"
            file="sede-emilio-castro.mp4"
            shot="🎬 Clase de Fosque Reformer · Steadicam entre camas · Luz natural"
          />
          <p className="sub">
            ¿La familia, los hijos, la pareja, la carrera profesional, cumplir tus sueños? Todo esto
            necesita de tu mejor versión: un cuerpo y una mente energizados y sanos.
          </p>
          <div className="ctas">
            <a className="btn solid" href="#anotate">
              ¡Anotate ahora: 2 sesiones de invitación!
            </a>
          </div>
        </div>
      </section>

      {/* Cuerpo compartido con el index (components/invitacion/Cuerpo.tsx) */}
      <InvitacionCuerpo />

      <Footer />
      <WaFloat numero={WA_GENERAL} />
    </InvitacionFx>
  );
}
