import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import WaFloat from '@/components/WaFloat';
import Media from '@/components/Media';
import Arcs from '@/components/Arcs';
import RingsDeco from '@/components/RingsDeco';
import Mitos from '@/components/Mitos';
import HomeFx from '@/components/home/HomeFx';
import Preloader from '@/components/home/Preloader';
import { sedes, waLink, WA_GENERAL } from '@/data/sedes';
import { mitosHome } from '@/data/mitos';

const TITULO = '¿Qué es lo más importante de tu vida?';

export default function Home() {
  return (
    <HomeFx>
      <Preloader />
      <Nav waNumero={WA_GENERAL} waTexto="Hola Fosque! Quiero vivir la experiencia" />

      {/* ============ HERO ============ */}
      <section id="hero" data-bg="#F0E9D8">
        <RingsDeco id="hero" from="#8FD5CC" to="#43A9A1" className="bl" />
        <Media
          file="hero.mp4"
          className="frame"
          shot="🎬 VIDEO HERO · Plano secuencia lento: mujeres en Reformer, risas, abrazo al final de clase · Luz natural cálida, 50fps para slow-motion · Loop 10s sin audio"
        />
        <h1>
          {TITULO.split(' ').map((w, i) => (
            <span key={i}>
              <span className="w">
                <span>{w}</span>
              </span>{' '}
            </span>
          ))}
        </h1>
        <p>
          Tu vida no tiene precio. Fosque no es un gimnasio: es el lugar donde sos bienvenida, te
          acompañamos y transformamos el ejercicio en el gran logro de tu vida.
        </p>
        <div className="ctas">
          <a
            className="btn solid"
            href={waLink(WA_GENERAL, 'Hola Fosque! Quiero vivir la experiencia')}
            target="_blank"
            rel="noopener"
          >
            Quiero vivir la experiencia Fosque
          </a>
          <a className="btn" href="#sedes">
            Elegí tu sucursal
          </a>
        </div>
      </section>

      <Arcs />

      {/* ============ MANIFIESTO (video full-bleed) ============ */}
      <section id="manifiesto" data-bg="#F0E9D8">
        <div className="mv">
          <Media
            file="hero.mp4"
            shot="🎬 VIDEO MANIFIESTO · Plano general cálido de clase, cámara lenta"
          />
        </div>
        <div className="mq">
          <blockquote>&ldquo;Acá no venís a sufrir.&rdquo;</blockquote>
          <p>
            Desde tu primer mensaje te hacemos sentir valorada: tu Ejecutiva Fosque te guía para
            que incorporar el movimiento sea sostenible y hermoso.
          </p>
        </div>
      </section>

      {/* ============ HISTORIA ============ */}
      <section id="historia" className="bloque" style={{ background: '#F8DDE0' }} data-bg="#F5EBE2">
        <div className="wrap grid">
          <div>
            <div className="eyebrow">Nuestra historia</div>
            <h2>24 años transformando esfuerzo en felicidad.</h2>
            <p>
              Nacimos en el año 2000. Desde entonces le mejoramos la vida a más de 30.000 personas
              que confiaron en nosotros para incorporar el ejercicio físico a su día a día.
            </p>
            <p>
              <b>Muchísimas gracias a todas las Mujeres Fosque</b> que nos hicieron parte de su vida
              en estos 24 años.
            </p>
            <p>
              Acá no venís a sufrir. Desde tu primer mensaje te hacemos sentir valorada: tu
              Ejecutiva Fosque te guía para que incorporar el movimiento sea sostenible y hermoso.
            </p>
            <div className="stats">
              <div className="stat">
                <div className="n">2000</div>
                <div className="l">Nacimos</div>
              </div>
              <div className="stat">
                <div className="n" data-count="24">
                  0
                </div>
                <div className="l">Años</div>
              </div>
              <div className="stat">
                <div className="n" data-count="30000">
                  0
                </div>
                <div className="l">Vidas mejoradas</div>
              </div>
            </div>
          </div>
          <Media
            file="historia.mp4"
            shot="🎬 VIDEO STORYTELLING · Equipo fundador + collage de archivo · Entrevista con B-roll de las 3 sedes · 45-60s"
          />
        </div>
      </section>

      {/* ============ PROGRAMA ============ */}
      <section id="programa" className="bloque" style={{ background: '#DCEAEE' }} data-bg="#EAF0EC">
        <div className="wrap stage">
          <div className="sticky">
            <div className="eyebrow">El Programa Fosque</div>
            <h2>
              Fosque Reformer.
              <br />
              La evolución de Pilates.
            </h2>
            <Media
              file="metodo.mp4"
              shot="🎬 VIDEO MÉTODO · Detalle de manos, resortes, deslizamiento del carro · Macro + plano general de clase · Ritmo suave"
            />
          </div>
          <div>
            <div className="beneficio">
              <h3>Dormí mejor</h3>
              <p>El movimiento consciente regula tu descanso desde la primera semana.</p>
            </div>
            <div className="beneficio">
              <h3>Recuperá movilidad</h3>
              <p>Reducí dolores de espalda y volvé a moverte con libertad.</p>
            </div>
            <div className="beneficio">
              <h3>Ganá fuerza real</h3>
              <p>La fuerza para abrazar a tus seres amados y para tu vida diaria.</p>
            </div>
            <div className="beneficio">
              <h3>Mejor ánimo</h3>
              <p>Optimizá tu estado de ánimo y tu autoestima, clase a clase.</p>
            </div>
            <div className="niveles">
              <div className="nivel">
                <b>1</b>
                <small>Inicial</small>
              </div>
              <div className="nivel">
                <b>2</b>
                <small>Progresivo</small>
              </div>
              <div className="nivel">
                <b>3</b>
                <small>Avanzado</small>
              </div>
            </div>
            <p style={{ marginTop: '1.2rem', lineHeight: 1.6 }}>
              No importa tu estado físico actual: hay un nivel exacto para vos, sin esfuerzos de más
              ni de menos.
            </p>
            <a
              className="btn solid"
              style={{ marginTop: '1.4rem' }}
              href={waLink(WA_GENERAL, 'Hola! Quiero mi sesión de diagnóstico')}
              target="_blank"
              rel="noopener"
            >
              Quiero mi sesión de diagnóstico
            </a>
          </div>
        </div>
      </section>

      {/* ============ SEDES: carrusel horizontal ============ */}
      <section id="sedes-pin" data-bg="#F0E9D8">
        <div id="sedes" className="sedes-head">
          <div className="eyebrow">Tres capítulos, una misma película</div>
          <h2>Elegí tu Fosque</h2>
          <p>
            Cada sede tiene su propia energía. Todas comparten lo mismo: un lugar donde sos
            bienvenida.
          </p>
        </div>
        <div className="sedes-track">
          {sedes.map((s) => (
            <Link key={s.slug} className="sede-card" href={`/${s.slug}/`}>
              <Media file={s.videoFile} shot={s.shotHome} />
              <span className="sc-badge">
                ★ {s.rating} · {s.reviews} opiniones
              </span>
              <div className="sc-info">
                <div className="num">
                  SEDE {s.numero} · {s.barrio.toUpperCase()}
                </div>
                <h3>
                  Fosque
                  <br />
                  {s.nombre}
                </h3>
                <div className="disc">
                  {s.disciplinas.map((d) => (
                    <span key={d} className="tag">
                      {d}
                    </span>
                  ))}
                </div>
                <div className="meta">
                  {s.direccion} · {s.horarioResumen}
                </div>
                <span className="go">
                  Conocé la sede <span className="arrow">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ MITOS ============ */}
      <section id="mitos" className="bloque" style={{ background: '#F5E3CB' }} data-bg="#F0E9D8">
        <div className="wrap">
          <div className="eyebrow">Derribando mitos</div>
          <h2>Todo lo que pensás antes de animarte.</h2>
          <Mitos mitos={mitosHome} />
        </div>
      </section>

      {/* ============ EQUIPO ============ */}
      <section
        id="equipo"
        className="bloque clip"
        style={{ background: '#EADFF0' }}
        data-bg="#F0E9D8"
      >
        <RingsDeco id="equipo" from="#F3A6C8" to="#CDB6D9" className="br" />
        <div className="wrap">
          <div className="eyebrow">El Equipo Fosque</div>
          <h2>Las personas que te van a cuidar.</h2>
          <div className="row">
            <Media file="equipo-1.jpg" shot="📷 Retrato instructora · fondo crema" />
            <Media file="equipo-2.jpg" shot="📷 Ejecutiva en recepción" />
            <Media file="equipo-3.jpg" shot="📷 Instructor corrigiendo postura" />
            <Media file="equipo-4.jpg" shot="📷 Equipo completo de sede" />
          </div>
        </div>
      </section>

      {/* ============ CTA FINAL ============ */}
      <section id="final" data-bg="#F0E9D8">
        <RingsDeco id="final" from="#F8E27A" to="#F29B38" className="bl" />
        <div className="eyebrow">Tu momento es ahora</div>
        <h2>Cambiá tu vida en un abrir y cerrar de ojos.</h2>
        <a
          className="btn solid"
          style={{ fontSize: '1rem', padding: '1rem 2.2rem' }}
          href={waLink(WA_GENERAL, 'Hola Fosque! Quiero empezar')}
          target="_blank"
          rel="noopener"
        >
          Quiero vivir la experiencia Fosque
        </a>
      </section>

      <Footer />
      <WaFloat numero={WA_GENERAL} />
    </HomeFx>
  );
}
