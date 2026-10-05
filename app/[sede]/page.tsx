import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import WaFloat from '@/components/WaFloat';
import Media from '@/components/Media';
import Mitos from '@/components/Mitos';
import RingsDeco from '@/components/RingsDeco';
import SedeFx from '@/components/sede/SedeFx';
import {
  sedes,
  getSede,
  waLink,
  mapsLink,
  mapsEmbed,
  PLATAFORMA_URL,
  opinionesDesde,
} from '@/data/sedes';
import { mitosParaSede } from '@/data/mitos';
import { EXPERIENCIA_URL } from '@/data/experiencia';

export function generateStaticParams() {
  return sedes.map((s) => ({ sede: s.slug }));
}

export const dynamicParams = false;

type Props = { params: Promise<{ sede: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sede: slug } = await params;
  const sede = getSede(slug);
  if (!sede) return {};
  return {
    title:
      sede.nombre === sede.barrio
        ? `Fosque ${sede.nombre}`
        : `Fosque ${sede.nombre} — ${sede.barrio}`,
    description: `${sede.descripcion} ${sede.direccion}. ${sede.horarioResumen}.`,
  };
}

export default async function SedePage({ params }: Props) {
  const { sede: slug } = await params;
  const sede = getSede(slug);
  if (!sede) notFound();

  return (
    <SedeFx>
      <Nav waNumero={sede.whatsapp} waTexto={`Hola Fosque ${sede.nombre}! Quiero empezar`} />

      <div className="badge">
        ★ {sede.rating} · más de {opinionesDesde(sede.reviews)} opiniones
      </div>

      {/* HERO: nombre de sede gigante, video en sandwich */}
      <section className="sede-hero" data-bg="#F0E9D8">
        <RingsDeco id="sede-hero" from="#8FD5CC" to="#43A9A1" className="bl" />
        <div className="stack">
          <div className="title-back">{sede.heroBack}</div>
          {/* 26-09 (video 4): donde hay sala propia el hero muestra las DOS
              cosas —"acá tiene que haber una imagen de Reformer y una de la
              parte de Fuerza y Cardio"—. Las sucursales sin sala (Emilio
              Castro y Núñez) siguen con el video único de siempre. */}
          {sede.videoFuerzaFile ? (
            <div className="frame hero-dipt">
              <Media className="hd-reformer" file={sede.videoFile} shot={sede.shotHero} />
              <Media
                className="hd-fuerza"
                file={sede.videoFuerzaFile}
                shot={sede.shotFuerza as string}
              />
            </div>
          ) : (
            <Media className="frame" file={sede.videoFile} shot={sede.shotHero} />
          )}
          {/* `largo` achica el display cuando el nombre no entra a 11vw
              ("José Hernández" son 14 caracteres contra los 9 de antes) */}
          <div className={`title-front${sede.heroFront.length > 10 ? ' largo' : ''}`}>
            {sede.heroFront}
          </div>
          {/* "Podría ser Mataderos abajo" (video 4): el barrio no se pierde,
              pasa a ser bajada. En Núñez barrio y nombre son lo mismo. */}
          {sede.barrio !== sede.heroFront && <div className="hero-barrio">{sede.barrio}</div>}
        </div>
        <p className="sub">{sede.descripcion}</p>
        <div className="ctas">
          {/* 5-oct: era "Quiero mi evaluación sin cargo" → WhatsApp. Ahora
              lleva a la landing de la campaña Experiencia con esta sede ya
              elegida en el formulario. En José Hernández el cliente pidió
              nombrar la combinación ("Pilates + Musculación"), que es lo que
              la diferencia: es la única con sala de fuerza propia. */}
          <Link className="btn solid" href={`${EXPERIENCIA_URL}?sede=${sede.slug}`}>
            {sede.fuerza ? 'Pilates + Musculación sin cargo' : '1 sesión sin cargo'}
          </Link>
          <a className="btn" href="#info">
            Horarios y ubicación
          </a>
        </div>
      </section>

      <div className="marquee">
        <div className="track">
          <span>{sede.marquee.join(' ✦ ')} ✦&nbsp;</span>
          <span>{sede.marquee.join(' ✦ ')} ✦&nbsp;</span>
        </div>
      </div>

      {/* ORDEN DE LA PÁGINA — devolución del cliente 26-09 (videos 1 y 4).
          Antes: info (horarios/mapa) → fuerza → membresía → galería → …
          "Eso no me gustó": la membresía quedaba abajo de los datos de la
          sucursal y se perdía, siendo "lo más importante". Ahora la página
          vende primero y recién al final dice dónde queda:
          hero → Fuerza y Cardio → conocé el espacio → equipo → mitos →
          Membresía F → horarios, dirección y mapa → CTA final. */}
      {/* FUERZA Y CARDIO: solo sedes con sala propia (hoy José Hernández).
          Editorial, no grilla simétrica: título grande, video protagonista a
          todo el ancho, promesa + ventajas a una columna con las tarjetas al
          lado y las fotos en cascada. Todo el copy es del cliente (data/sedes.ts). */}
      {sede.fuerza && (
        <section id="fuerza" className="bloque clip" style={{ background: '#DCE5D9' }} data-bg="#EAF0EC">
          <RingsDeco id="sede-fuerza" from="#F8E27A" to="#F29B38" className="bl" />
          <div className="wrap">
            <div className="eyebrow">{sede.fuerza.eyebrow}</div>
            <h2 className="fz-titulo">{sede.fuerza.titulo}</h2>
            {/* Díptico: la combinación, no por separado (pedido del cliente 21-sep).
                La de Fuerza y Cardio es "la imagen más importante": columna más
                ancha y sin offset; Reformer va más chica y calada hacia abajo. */}
            <div className="fz-hero">
              <Media
                className="fz-hero-fuerza"
                file={sede.fuerza.heroFuerza.file}
                shot={sede.fuerza.heroFuerza.shot}
              />
              <Media
                className="fz-hero-reformer"
                file={sede.fuerza.heroReformer.file}
                shot={sede.fuerza.heroReformer.shot}
              />
            </div>
            <div className="fz-texto">
              <div>
                <p className="fz-promesa">{sede.fuerza.promesa}</p>
                <ul className="fz-ventajas">
                  {sede.fuerza.ventajas.map((v) => (
                    <li key={v.t}>
                      <strong>{v.t}.</strong> {v.d}
                    </li>
                  ))}
                </ul>
                <a
                  className="btn solid"
                  href={waLink(sede.whatsapp, sede.fuerza.waTexto)}
                  target="_blank"
                  rel="noopener"
                >
                  {sede.fuerza.cta}
                </a>
                <small className="fz-nota">{sede.fuerza.ctaNota}</small>
              </div>
              <div className="fz-puntos">
                {sede.fuerza.puntos.map((p) => (
                  <div key={p.t} className="card punto">
                    <h3>{p.t}</h3>
                    <p>
                      {p.lead && <strong>{p.lead}.</strong>} {p.d}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="fz-fotos">
              {sede.fuerza.fotos.map((g) => (
                <Media key={g.file} file={g.file} shot={g.shot} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* GALERÍA */}
      <section id="galeria" data-bg="#F8DDE0">
        <h2 className="wrap">Conocé el espacio antes de venir.</h2>
        <div className="rail" data-lenis-prevent>
          {sede.galeria.map((g) => (
            <Media key={g.file + g.shot} file={g.file} shot={g.shot} />
          ))}
        </div>
      </section>

      {/* EQUIPO DE LA SEDE */}
      <section id="equipo" data-bg="#EADFF0">
        <RingsDeco id="sede-equipo" from="#F3A6C8" to="#CDB6D9" className="br" />
        <div className="wrap">
          <div className="eyebrow">El equipo de {sede.nombre}</div>
          <h2>Las personas que te van a cuidar.</h2>
          <div className="row">
            <Media file="equipo-1.jpg" shot="📷 Retrato instructora · fondo crema" />
            <Media file="equipo-2.jpg" shot="📷 Ejecutiva en recepción" />
            <Media file="equipo-3.jpg" shot="📷 Instructor corrigiendo postura" />
            <Media file="equipo-4.jpg" shot="📷 Equipo completo de la sede" />
          </div>
        </div>
      </section>

      {/* MITOS */}
      <section
        id="mitos"
        className="bloque clip"
        style={{ background: sede.colorFondo }}
        data-bg="#F0E9D8"
      >
        <RingsDeco id="sede-mitos" from="#93A48D" to="#5E99A8" className="tl" />
        <div className="wrap">
          <div className="eyebrow">Derribando mitos</div>
          <h2>Todo lo que pensás antes de animarte.</h2>
          <Mitos mitos={mitosParaSede(sede)} />
        </div>
      </section>

      {/* MEMBRESÍA F: texto del cliente (PDF 21-sep-2026), dos modelos según
          la sede: Reformer (Emilio Castro, Núñez) o integral (José Hernández).
          Texto y CTA a un lado, los beneficios numerados al otro. El botón
          de acceso a la plataforma apunta a PLATAFORMA_URL, todavía pendiente. */}
      <section id="membresia" className="bloque clip" style={{ background: '#E9E5CD' }} data-bg="#F0E9D8">
        <RingsDeco id="sede-membresia" from="#C9C25A" to="#8F9A3E" className="tl" />
        <div className="wrap">
          <div className="eyebrow">Membresía F · {sede.nombre}</div>
          <h2>{sede.membresia.titulo}</h2>
          <div className="mb-grid">
            <div className="mb-texto">
              {sede.membresia.texto.map((p) => (
                <p key={p}>{p}</p>
              ))}
              <div className="mb-ctas">
                <a
                  className="btn solid"
                  href={waLink(sede.whatsapp, `Hola! Quiero mi Membresía F en ${sede.nombre}`)}
                  target="_blank"
                  rel="noopener"
                >
                  Quiero mi Membresía F
                </a>
                <a className="btn" href={PLATAFORMA_URL}>
                  Ingresar a mi Membresía F
                </a>
              </div>
            </div>
            <div className="mb-beneficios">
              {sede.membresia.beneficios.map((b, i) => (
                <div key={b.t} className="mb-item">
                  <div className="num">{String(i + 1).padStart(2, '0')}</div>
                  <div>
                    <h3>{b.t}</h3>
                    <p>{b.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* INFO */}
      <section id="info" data-bg="#DCEAEE">
        <div className="wrap grid">
          <div>
            <div className="eyebrow">
              Sucursal {sede.nombre} · {sede.barrio}
            </div>
            <h2>Todo lo que necesitás, en un solo lugar.</h2>
            <div className="card">
              <h3>HORARIOS</h3>
              {sede.horarios.map((h) => (
                <div key={h.dias} className="horario">
                  <span>{h.dias}</span>
                  <b>{h.horas}</b>
                </div>
              ))}
            </div>
            <div className="card">
              <h3>CONTACTO</h3>
              <div className="horario">
                <span>WhatsApp</span>
                <b>{sede.whatsappDisplay}</b>
              </div>
              <div className="horario">
                <span>Dirección</span>
                <b>{sede.direccion}</b>
              </div>
              <div className="horario">
                <span>Instagram</span>
                <b>
                  {sede.instagram ? (
                    <a
                      href={sede.instagram}
                      target="_blank"
                      rel="noopener"
                      style={{ color: 'inherit', textDecoration: 'underline' }}
                    >
                      @{new URL(sede.instagram).pathname.replaceAll('/', '')}
                    </a>
                  ) : (
                    'Muy pronto'
                  )}
                </b>
              </div>
            </div>
            <div className="card resena">
              <div className="stars">
                {sede.rating}
                <small>más de {opinionesDesde(sede.reviews)} opiniones en Google</small>
              </div>
              <p>Calificación real de la comunidad Fosque {sede.nombre} en Google Maps.</p>
            </div>
          </div>
          <div>
            <div className="mapa">
              <iframe
                src={mapsEmbed(sede.direccion)}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Mapa de Fosque ${sede.nombre}`}
              />
              <a
                className="btn como-llegar"
                href={mapsLink(sede.placeId)}
                target="_blank"
                rel="noopener"
              >
                Cómo llegar
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section id="final" data-bg="#F0E9D8">
        <div className="eyebrow">Tu primera clase te espera</div>
        <h2>Vení a probar. Tu evaluación es sin cargo.</h2>
        <p>
          Después de esa clase recibís una devolución personalizada sobre cuáles son las mejores
          clases y planes para vos.
        </p>
        <a
          className="btn solid"
          style={{ fontSize: '1rem', padding: '1rem 2.2rem' }}
          href={waLink(sede.whatsapp, `Hola! Quiero mi evaluación sin cargo en ${sede.nombre}`)}
          target="_blank"
          rel="noopener"
        >
          Reservar mi evaluación sin cargo
        </a>
      </section>

      <Footer />
      <WaFloat numero={sede.whatsapp} directo />
    </SedeFx>
  );
}
