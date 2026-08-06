import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import WaFloat from '@/components/WaFloat';
import Media from '@/components/Media';
import RingsDeco from '@/components/RingsDeco';
import FranquiciaFx from '@/components/franquicia/FranquiciaFx';
import FranquiciaForm from '@/components/franquicia/FranquiciaForm';
import { WA_GENERAL } from '@/data/sedes';

export const metadata: Metadata = {
  title: 'Franquicia — Quiero formar parte',
  description:
    'Llevá la experiencia Fosque a tu barrio: 24 años de método probado, más de 30.000 vidas mejoradas y un modelo que te acompaña de la obra a la primera clase.',
};

const MARQUEE =
  'MODELO PROBADO ✦ 24 AÑOS DE MARCA ✦ 30.000 VIDAS MEJORADAS ✦ FOSQUE REFORMER ✦ ACOMPAÑAMIENTO TOTAL ✦ ';

export default function FranquiciaPage() {
  return (
    <FranquiciaFx>
      <Nav
        waNumero={WA_GENERAL}
        waTexto="Hola Fosque! Quiero información sobre la franquicia"
      />

      <div className="badge">Quiero formar parte</div>

      {/* HERO: sandwich con el sueño adentro */}
      <section className="sede-hero" data-bg="#F0E9D8">
        <RingsDeco id="fr-hero" from="#F8E27A" to="#F29B38" className="bl" />
        <div className="stack">
          <div className="title-back">Fosque</div>
          <Media
            className="frame"
            file="franquicia.mp4"
            shot="🎬 VIDEO FRANQUICIA · Sede en hora pico: clase llena, recepción en movimiento, sonrisas · Cierre en fachada con logo"
          />
          <div className="title-front">en tu barrio</div>
        </div>
        <p className="sub">
          24 años de método probado. Más de 30.000 vidas mejoradas. Tres sedes que son
          comunidades. El próximo capítulo de la película Fosque puede ser tuyo.
        </p>
        <div className="ctas">
          <a className="btn solid" href="#contacto">
            Quiero formar parte
          </a>
          <a className="btn" href="#modelo">
            Conocé el modelo
          </a>
        </div>
      </section>

      <div className="marquee">
        <div className="track">
          <span>{MARQUEE}</span>
          <span>{MARQUEE}</span>
        </div>
      </div>

      {/* EL MODELO */}
      <section id="modelo" className="bloque clip" style={{ background: '#DCEAEE' }} data-bg="#EAF0EC">
        <RingsDeco id="fr-modelo" from="#93A48D" to="#5E99A8" className="tl" />
        <div className="wrap">
          <div className="eyebrow">El modelo Fosque</div>
          <h2>Un negocio que mejora vidas.</h2>
          <div className="fr-grid">
            <div className="fr-card">
              <div className="num">01</div>
              <h3>Método probado</h3>
              <p>
                Fosque Reformer, la evolución de Pilates: niveles progresivos que hacen que las
                alumnas se queden años, no meses.
              </p>
            </div>
            <div className="fr-card">
              <div className="num">02</div>
              <h3>Marca querida</h3>
              <p>
                La Mujer Fosque no es un público objetivo: es una comunidad que vuelve, recomienda
                y llena las clases.
              </p>
            </div>
            <div className="fr-card">
              <div className="num">03</div>
              <h3>Acompañamiento total</h3>
              <p>
                Te formamos en el método, la gestión y la experiencia Fosque completa. No abrís en
                soledad: abrís con 24 años de espalda.
              </p>
            </div>
            <div className="fr-card">
              <div className="num">04</div>
              <h3>Tu zona, estudiada</h3>
              <p>
                Analizamos juntos la ubicación y te acompañamos en el armado de la sede, de la obra
                a la primera clase.
              </p>
            </div>
          </div>
          <div className="stats">
            <div className="stat">
              <div className="n">2000</div>
              <div className="l">Nacimos</div>
            </div>
            <div className="stat">
              <div className="n" data-count="24">
                0
              </div>
              <div className="l">Años de marca</div>
            </div>
            <div className="stat">
              <div className="n" data-count="30000">
                0
              </div>
              <div className="l">Vidas mejoradas</div>
            </div>
            <div className="stat">
              <div className="n" data-count="3">
                0
              </div>
              <div className="l">Sedes propias</div>
            </div>
          </div>
        </div>
      </section>

      {/* FORMULARIO */}
      <section id="contacto" className="bloque clip" style={{ background: '#F5E3CB' }} data-bg="#F0E9D8">
        <RingsDeco id="fr-form" from="#F3A6C8" to="#CDB6D9" className="br" />
        <div className="wrap fr-form-wrap">
          <div>
            <div className="eyebrow">Quiero formar parte</div>
            <h2>Contanos quién sos.</h2>
            <p>
              Completá el formulario y seguimos la charla por WhatsApp con el equipo Fosque. Sin
              compromiso: el primer paso es conocernos.
            </p>
          </div>
          <FranquiciaForm />
        </div>
      </section>

      <Footer />
      <WaFloat numero={WA_GENERAL} />
    </FranquiciaFx>
  );
}
