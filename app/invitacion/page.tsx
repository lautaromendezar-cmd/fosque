import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import WaFloat from '@/components/WaFloat';
import Media from '@/components/Media';
import RingsDeco from '@/components/RingsDeco';
import InvitacionFx from '@/components/invitacion/InvitacionFx';
import { sedes, waLink, WA_GENERAL } from '@/data/sedes';

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
    '¿Qué es lo más importante de tu vida? Todo eso necesita tu mejor versión. Anotate hoy y accedé a tu Semana de Invitación en la sede Fosque que elijas.',
  robots: { index: false, follow: false },
};

const MARQUEE =
  'SEMANA DE INVITACIÓN ✦ 2 SESIONES ✦ FOSQUE REFORMER ✦ FUERZA Y CARDIO EN JOSÉ HERNÁNDEZ ✦ SIEMPRE CON PROFE ✦ ';

const waTexto = (sede: string) =>
  `Hola! Quiero anotarme a la Semana de Invitación (2 sesiones) en Fosque ${sede}`;

export default function InvitacionPage() {
  const jh = sedes.filter((s) => s.slug === 'jose-hernandez');
  const reformer = sedes.filter((s) => s.slug !== 'jose-hernandez');

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

      <div className="marquee">
        <div className="track">
          <span>{MARQUEE}</span>
          <span>{MARQUEE}</span>
        </div>
      </div>

      {/* TU MEJOR VERSIÓN */}
      <section id="version" className="bloque clip" style={{ background: '#DCEAEE' }} data-bg="#EAF0EC">
        <RingsDeco id="inv-version" from="#8FD5CC" to="#43A9A1" className="br" />
        <div className="wrap inv-dos">
          <div className="inv-reveal">
            <div className="eyebrow">Tu mejor versión</div>
            <h2>El ejercicio físico es la base de la salud, la vitalidad y el bienestar.</h2>
            <p>
              Lo más valioso para nuestros seres amados es que podamos estar en nuestro mejor
              momento para acompañarlos, cuidarlos y disfrutarlos.
            </p>
            <p className="inv-pregunta">¿Realmente la vida no tiene precio? ¿Cuánto vale tu vida?</p>
            <p>
              Cuando no hacemos ejercicio físico, de alguna manera le estamos poniendo un límite a
              nuestra salud, poniendo precio a la vida.
            </p>
            <p>
              En Fosque nos dedicamos a acompañarte y motivarte a alcanzar tu mejor versión para que
              puedas disfrutar y cuidar lo que más valoras.
            </p>
          </div>
          <Media
            className="inv-foto inv-reveal"
            file="metodo.mp4"
            shot="🎬 VIDEO MÉTODO · Detalle de manos, resortes, deslizamiento del carro"
          />
        </div>
      </section>

      {/* EL PROGRAMA: una tarjeta por modelo de sede */}
      <section id="mejorar" className="bloque clip" style={{ background: '#DCE5D9' }} data-bg="#EAF0EC">
        <RingsDeco id="inv-mejorar" from="#93A48D" to="#5E99A8" className="tl" />
        <div className="wrap">
          <div className="eyebrow inv-reveal">Fosque Reformer</div>
          <h2 className="inv-reveal">Somos el Programa para Mejorar tu Vida.</h2>
          <p className="inv-lead inv-reveal">
            La evolución del Pilates Reformer combinada con la motivación y un acompañamiento cálido
            que transforman el ejercicio en un hábito placentero, agradable y de rápida efectividad.
          </p>
          <div className="inv-sedes">
            <div className="inv-sede">
              <div className="fotos">
                <Media
                  file="galeria-ec-reformer.jpg"
                  shot="📷 Sala Reformer en clase · plano fijo lateral"
                />
              </div>
              <div className="eyebrow">En nuestras sedes Emilio Castro y Núñez</div>
              <h3>
                Disfrutá la experiencia del mejor Pilates Reformer en sus 3 Niveles: Inicial,
                Intermedia y Avanzada.
              </h3>
              <div className="links">
                {reformer.map((s) => (
                  <Link key={s.slug} className="btn" href={`/${s.slug}/`}>
                    Conocé {s.nombre}
                  </Link>
                ))}
              </div>
            </div>
            <div className="inv-sede doble">
              <div className="fotos">
                <Media
                  file="galeria-jh-reformer.jpg"
                  shot="📷 Sala Reformer en clase · plano fijo lateral"
                />
                <Media file="galeria-jh-fuerza.jpg" shot="📷 Detalle sala de fuerza · discos y barra" />
              </div>
              <div className="eyebrow">En nuestra sede José Hernández</div>
              <h3>Sumá la combinación perfecta de Pilates Reformer + Sala de Fuerza y Cardio.</h3>
              <div className="links">
                {jh.map((s) => (
                  <Link key={s.slug} className="btn" href={`/${s.slug}/`}>
                    Conocé {s.nombre}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LO QUE GANÁS */}
      <section id="ganas" data-bg="#F8DDE0">
        <div className="wrap inv-statement">
          <h2 className="inv-reveal">
            Ganá movilidad, descontracturá tu cuerpo, dormí mejor y despertá esa fuerza física e
            interior que renueva tu energía y tu estado de ánimo.
          </h2>
          <p className="inv-reveal">
            Te aseguramos: <strong>nunca un esfuerzo de más, nunca uno de menos</strong>, siempre
            acompañada por un Profe y una Ejecutiva Fosque.
          </p>
        </div>
      </section>

      {/* ANOTATE: la persona elige su sede */}
      <section id="anotate" className="bloque clip" style={{ background: '#F5E3CB' }} data-bg="#F0E9D8">
        <RingsDeco id="inv-final" from="#F3A6C8" to="#CDB6D9" className="br" />
        <div className="wrap inv-final">
          <div className="eyebrow">Viví la Experiencia Fosque</div>
          <h2>¡Activate! Te lo merecés.</h2>
          <p>Anotate hoy y accedé a tu Semana de Invitación.</p>
          <div className="inv-cta-label">¡Anotate ahora: 2 sesiones de invitación! Elegí tu sede</div>
          <div className="inv-botones">
            {sedes.map((s) => (
              <a
                key={s.slug}
                className="btn solid"
                href={waLink(s.whatsapp, waTexto(s.nombre))}
                target="_blank"
                rel="noopener"
              >
                {s.nombre}
              </a>
            ))}
          </div>
          <small>Te contestamos por el WhatsApp de la sede.</small>
        </div>
      </section>

      <Footer />
      <WaFloat numero={WA_GENERAL} />
    </InvitacionFx>
  );
}
