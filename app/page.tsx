import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import WaFloat from '@/components/WaFloat';
import Media from '@/components/Media';
import RingsDeco from '@/components/RingsDeco';
import Mitos from '@/components/Mitos';
import HomeFx from '@/components/home/HomeFx';
import Preloader from '@/components/home/Preloader';
import CineAudio from '@/components/home/CineAudio';
import { sedes, waLink, mapsLink, WA_GENERAL } from '@/data/sedes';
import { mitosHome } from '@/data/mitos';

const TITULO = '¿Qué es lo más importante de tu vida?';

/* Botón mute/unmute del hero ("audio activable de forma orgánica" del brief).
   Poner en true cuando el hero.mp4 real del rodaje traiga pista de audio —
   con el video IA mudo actual el botón no hace nada y confunde. */
const HERO_CON_AUDIO = false;

export default function Home() {
  return (
    <HomeFx>
      <Preloader />
      <Nav waNumero={WA_GENERAL} waTexto="Hola Fosque! Quiero vivir la experiencia" />

      {/* ============ HERO CINE: la película Fosque ============ */}
      <section id="cine" data-bg="#F0E9D8">
        <Media
          className="cine-bg"
          file="hero.mp4"
          shot="🎬 VIDEO HERO · Relato continuo sin cortes bruscos: rutina urbana y cansancio → llegada a Fosque → transformación, risas, abrazo · Luz cálida"
        />
        <div className="cine-veil" />
        {/* las 3 frases del trailer: una tras otra, mismo tamaño */}
        <div className="cine-frases" aria-hidden="true">
          <p className="frase">¿Qué es lo más importante de tu vida?</p>
          <p className="frase">Fosque no es un gimnasio.</p>
          <p className="frase">
            Es el lugar donde lográs tu mejor versión para disfrutar y cuidar lo más importante de
            tu vida.
          </p>
        </div>
        {/* estado final: aparece cuando termina el trailer y queda fijo */}
        <div className="cine-content">
          <h1>
            {TITULO.split(' ').map((w, i) => (
              <span key={i}>
                <span className="w">
                  <span>{w}</span>
                </span>{' '}
              </span>
            ))}
          </h1>
          {/* la parte del subtítulo oficial que el trailer no dice: cierra el relato */}
          <p className="sub">
            Un espacio donde siempre sos bienvenida, te acompañamos con profesionalismo y
            amabilidad para que el ejercicio físico se convierta, de una vez por todas, en un
            hábito en tu vida.
          </p>
          <div className="ctas">
            <a
              className="btn cta"
              href={waLink(WA_GENERAL, 'Hola Fosque! Quiero vivir la experiencia')}
              target="_blank"
              rel="noopener"
            >
              Quiero vivir la experiencia Fosque
            </a>
            <a className="btn ghost" href="#sedes">
              Elegí tu sucursal
            </a>
          </div>
        </div>
        {HERO_CON_AUDIO && <CineAudio />}
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
              A Fosque venís a sentirte querida. Desde tu primer mensaje te hacemos sentir
              bienvenida. Tu Ejecutiva Fosque te guía para que puedas disfrutar los beneficios del
              ejercicio físico y te motivamos para que sea sostenible, constante y hasta divertido.
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
              <h3>Dormí mejor y descansá</h3>
              <p>Regularizá tu sueño y ganá energía para todos los días.</p>
            </div>
            <div className="beneficio">
              <h3>Función cerebral y memoria</h3>
              <p>Más claridad mental para tomar mejores decisiones.</p>
            </div>
            <div className="beneficio">
              <h3>Fuerza y movilidad funcional</h3>
              <p>
                Recuperá flexibilidad y cuidá tu espalda: la fuerza para proteger y abrazar a tus
                seres amados.
              </p>
            </div>
            <div className="beneficio">
              <h3>Ánimo y autoestima</h3>
              <p>Activá las hormonas de la felicidad: alegría y motivación constante.</p>
            </div>
            <div className="beneficio">
              <h3>Cuidado celular y longevidad</h3>
              <p>Movimiento y buena alimentación: la combinación para vivir más y mejor.</p>
            </div>
            <div className="beneficio">
              <h3>Cuerpo en equilibrio</h3>
              <p>Bajá de peso de forma natural y aliviá contracturas.</p>
            </div>
            <div className="beneficio">
              <h3>Salud cardiovascular</h3>
              <p>Un corazón más fuerte para amar mejor.</p>
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
              href={waLink(WA_GENERAL, 'Hola! Quiero mi evaluación sin cargo')}
              target="_blank"
              rel="noopener"
            >
              Quiero mi evaluación sin cargo
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
        <div className="sedes-track" data-lenis-prevent>
          {sedes.map((s) => (
            <div key={s.slug} className="sede-card">
              <Media file={s.videoFile} shot={s.shotHome} />
              <span className="sc-badge">
                ★ {s.rating} · {s.reviews} opiniones
              </span>
              {/* link estirado a la landing; los accesos directos flotan encima */}
              <Link
                className="sc-link"
                href={`/${s.slug}/`}
                aria-label={`Conocé Fosque ${s.nombre}`}
              />
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
              <div className="sc-actions">
                <a
                  href={waLink(s.whatsapp, `Hola Fosque ${s.nombre}! Quiero más info`)}
                  target="_blank"
                  rel="noopener"
                  aria-label={`WhatsApp de Fosque ${s.nombre}`}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.4c1.4.8 3 1.2 4.8 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2zm5.6 14.2c-.2.7-1.2 1.2-2 1.4-.5.1-1.2.2-3.6-.8-3-1.2-4.9-4.3-5.1-4.5-.1-.2-1.2-1.6-1.2-3.1s.8-2.2 1-2.5c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .7.5.2.6.8 2.1.9 2.2.1.2.1.3 0 .5s-.2.4-.3.5l-.5.6c-.2.2-.3.4-.1.7.2.3.8 1.4 1.8 2.2 1.2 1.1 2.3 1.4 2.6 1.6.3.1.5.1.7-.1.2-.2.8-.9 1-1.2.2-.3.4-.3.7-.2l2.1 1c.3.1.5.2.6.4 0 .1 0 .7-.2 1.2z" />
                  </svg>
                </a>
                <a
                  href={mapsLink(s.placeId)}
                  target="_blank"
                  rel="noopener"
                  aria-label={`Fosque ${s.nombre} en Google Maps`}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
                  </svg>
                </a>
                {s.instagram && (
                  <a
                    href={s.instagram}
                    target="_blank"
                    rel="noopener"
                    aria-label={`Instagram de Fosque ${s.nombre}`}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <rect x="3" y="3" width="18" height="18" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ MITOS ============ */}
      <section
        id="mitos"
        className="bloque clip"
        style={{ background: '#F5E3CB' }}
        data-bg="#F0E9D8"
      >
        <RingsDeco id="mitos" from="#93A48D" to="#5E99A8" className="tl" />
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
          {/* <a> nativo: Link de Next pisa el hash cuando hay varios al mismo
              pathname (bug de la caché de prefetch del App Router) */}
          <div className="row equipo-cards">
            <a className="eq-card" href="/equipo/#profe">
              <Media file="equipo-3.jpg" shot="📷 Instructor corrigiendo postura" />
              <h3>Profe Fosque</h3>
              <p>Instructores y profesores de sala.</p>
              <span className="go">
                Conocelos <span className="arrow">→</span>
              </span>
            </a>
            <a className="eq-card" href="/equipo/#ejecutiva">
              <Media file="equipo-2.jpg" shot="📷 Ejecutiva en recepción" />
              <h3>Ejecutiva Fosque</h3>
              <p>Atención personalizada desde tu primer mensaje.</p>
              <span className="go">
                Conocelas <span className="arrow">→</span>
              </span>
            </a>
            <a className="eq-card" href="/equipo/#mantenimiento">
              <Media file="galeria-detalle.jpg" shot="📷 Detalle de sala impecable" />
              <h3>Personal de Mantenimiento</h3>
              <p>Cada sede siempre limpia e impecable.</p>
              <span className="go">
                Conocelos <span className="arrow">→</span>
              </span>
            </a>
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
