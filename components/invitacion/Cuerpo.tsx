import Link from 'next/link';
import Media from '@/components/Media';
import RingsDeco from '@/components/RingsDeco';
import { sedes, waLink } from '@/data/sedes';
import { EXPERIENCIA, EXPERIENCIA_URL } from '@/data/experiencia';
import IrAlForm from '@/components/experiencia/IrAlForm';

/* Cuerpo de la "página de aterrizaje" (marquee + las 4 secciones que van
   después del hero). Vive acá, y no dentro de app/invitacion/page.tsx, porque
   desde el 26-09 el MISMO bloque se usa en dos lados:

   · /invitacion/  — la landing de campaña, con su hero propio (la pregunta
     gigante sobre el video) y su `noindex`. Sigue existiendo para pautar.
   · /            — el index, después del manifiesto. Devolución del cliente
     (video 3): "esta página de aterrizaje como la parte principal de la
     página porque está buenísimo, es espectacular".

   Ahí el hero NO se repite: el index ya abre con la misma pregunta
   ("¿Qué es lo más importante de tu vida?") y desde el 26-09 con la misma
   bajada, así que duplicarla ponía el mismo H1 gigante dos veces en tres
   pantallas. El copy del cuerpo es del cliente, palabra por palabra.

   Las animaciones las aporta el motor de cada página (InvitacionFx en la
   landing, HomeFx en el index) a través de `cuerpoReveals()` en ./fx. */

const MARQUEE =
  'SEMANA DE INVITACIÓN ✦ 2 SESIONES ✦ FOSQUE REFORMER ✦ FUERZA Y CARDIO EN JOSÉ HERNÁNDEZ ✦ SIEMPRE CON PROFE ✦ ';

// En el index la cinta habla de la campaña Experiencia (1 sesión), no de la
// Semana de Invitación: el resto del home ya ofrece eso (5-oct).
const MARQUEE_EXPERIENCIA =
  'EXPERIENCIA FOSQUE ✦ 1 SESIÓN SIN CARGO ✦ FOSQUE REFORMER ✦ FUERZA Y CARDIO EN JOSÉ HERNÁNDEZ ✦ SIEMPRE CON PROFE ✦ ';

const waTexto = (sucursal: string) =>
  `Hola! Quiero anotarme a la Semana de Invitación (2 sesiones) en Fosque ${sucursal}`;

/* Tres modos, porque el mismo cuerpo vive en tres páginas:
   · 'invitacion' — /invitacion/, la Semana de Invitación (2 sesiones): el
     cierre manda al WhatsApp de cada sede. Como estaba.
   · 'home'       — el index (5-oct): cinta y cierre hablan de la campaña
     Experiencia (1 sesión) y el cierre lleva a /experiencia/.
   · 'landing'    — /experiencia/ (5-oct, pedido de Gerardo: "la página sigue
     y te explica todo y en cada pantalla un llamado a la acción"). Cada bloque
     suma un botón que sube al formulario de arriba, y entra un bloque propio
     de Pilates + Musculación (José Hernández). */
type Modo = 'invitacion' | 'home' | 'landing';

/** Botón "sin cargo" de cada bloque de la landing: sube al formulario. */
function CtaBloque({ sede, children }: { sede?: string; children: React.ReactNode }) {
  return (
    <div className="exp-cta-bloque inv-reveal">
      <IrAlForm sede={sede} className="btn cta sin-cargo">
        <span className="sc-regalo" aria-hidden="true">
          🎁
        </span>{' '}
        {children}
      </IrAlForm>
    </div>
  );
}

export default function InvitacionCuerpo({ modo = 'invitacion' }: { modo?: Modo }) {
  const experiencia = modo !== 'invitacion';
  const landing = modo === 'landing';
  const jh = sedes.filter((s) => s.slug === 'jose-hernandez');
  const reformer = sedes.filter((s) => s.slug !== 'jose-hernandez');
  const cinta = experiencia ? MARQUEE_EXPERIENCIA : MARQUEE;
  const fuerza = jh[0]?.fuerza;

  return (
    <>
      <div className="marquee">
        <div className="track">
          <span>{cinta}</span>
          <span>{cinta}</span>
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
            {landing && <CtaBloque>{EXPERIENCIA.cta}</CtaBloque>}
          </div>
          {/* 26-09: acá iba `metodo.mp4`, el mismo que el bloque del método del
              index. Desde que este cuerpo entró al index, la misma imagen
              aparecía dos veces en la misma página. `metodo.mp4` se queda allá
              —es el video del método— y acá va una imagen nueva de clase.
              Es sintética, como el resto de la galería: persona inventada, sin
              el logo en el buzo (la IA lo deforma, ver CONTINUAR). */}
          <Media
            className="inv-foto inv-reveal"
            file="metodo-clase.jpg"
            shot="📷 Clase de Fosque Reformer · profe acompañando la fila"
          />
        </div>
      </section>

      {/* EL PROGRAMA: una tarjeta por modelo de sucursal */}
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
              <div className="eyebrow">En nuestras sucursales Emilio Castro y Núñez</div>
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
              <div className="eyebrow">En nuestra sucursal José Hernández</div>
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
          {landing && <CtaBloque>{EXPERIENCIA.cta}</CtaBloque>}
        </div>
      </section>

      {/* PILATES + MUSCULACIÓN: solo en la landing (Gerardo, 5-oct: "hay que
          mostrar pilates más musculación"). Copy de la sección Fuerza y
          Cardio de José Hernández (data/sedes.ts), con el nombre que usa el
          cliente. Fotos que no se repiten en esta página: las de la tarjeta
          de arriba son otras. */}
      {landing && fuerza && (
        <section id="musculacion" className="bloque clip" style={{ background: '#EADFF0' }} data-bg="#F0E9D8">
          <RingsDeco id="exp-musc" from="#F8E27A" to="#F29B38" className="tl" />
          <div className="wrap inv-dos exp-musc">
            <div>
              <div className="eyebrow inv-reveal">{fuerza.eyebrow}</div>
              <h2 className="inv-reveal">Pilates Reformer + Musculación.</h2>
              <p className="inv-reveal">
                {fuerza.promesa} Sala de fuerza y cardio propia, siempre con instructor, junto a
                tus clases de Reformer.
              </p>
              <ul className="exp-ventajas inv-reveal">
                {fuerza.ventajas.map((v) => (
                  <li key={v.t}>
                    <b>{v.t}</b>
                    {v.d}
                  </li>
                ))}
              </ul>
              <CtaBloque sede="jose-hernandez">Pilates + Musculación sin cargo</CtaBloque>
            </div>
            <div className="exp-musc-fotos inv-reveal">
              <Media file="fuerza-jh-grupo.jpg" shot="📷 Sala de fuerza · alumnas entrenando" />
              <Media file="fuerza-jh-maquinas.jpg" shot="📷 Sala de fuerza · máquinas y peso libre" />
            </div>
          </div>
        </section>
      )}

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
          {landing && <CtaBloque>{EXPERIENCIA.cta}</CtaBloque>}
        </div>
      </section>

      {/* ANOTATE: la persona elige su sucursal */}
      <section id="anotate" className="bloque clip" style={{ background: '#F5E3CB' }} data-bg="#F0E9D8">
        <RingsDeco id="inv-final" from="#F3A6C8" to="#CDB6D9" className="br" />
        <div className="wrap inv-final">
          <div className="eyebrow">Viví la Experiencia Fosque</div>
          <h2>¡Activate! Te lo merecés.</h2>
          {experiencia ? (
            <>
              <p>Anotate hoy y viví tu sesión de experiencia Fosque.</p>
              <div className="inv-cta-label">
                {EXPERIENCIA.avisoA} 🎁 {EXPERIENCIA.avisoB}
              </div>
              <div className="inv-botones">
                {landing ? (
                  <IrAlForm className="btn solid">{EXPERIENCIA.cta}</IrAlForm>
                ) : (
                  <Link className="btn solid" href={EXPERIENCIA_URL}>
                    {EXPERIENCIA.cta}
                  </Link>
                )}
              </div>
              <small>{EXPERIENCIA.legal}</small>
            </>
          ) : (
            <>
              <p>Anotate hoy y accedé a tu Semana de Invitación.</p>
              <div className="inv-cta-label">
                ¡Anotate ahora: 2 sesiones de invitación! Elegí tu sucursal
              </div>
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
              <small>Te contestamos por el WhatsApp de la sucursal.</small>
            </>
          )}
        </div>
      </section>
    </>
  );
}
