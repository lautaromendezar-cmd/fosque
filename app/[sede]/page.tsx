import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import WaFloat from '@/components/WaFloat';
import Vph from '@/components/Vph';
import Mitos from '@/components/Mitos';
import SedeFx from '@/components/sede/SedeFx';
import { sedes, getSede, waLink, mapsLink, mapsEmbed } from '@/data/sedes';
import { mitosParaSede } from '@/data/mitos';

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

  const waDiagnostico = waLink(
    sede.whatsapp,
    `Hola! Quiero mi sesión de diagnóstico en ${sede.nombre}`,
  );

  return (
    <SedeFx>
      <Nav
        backLink={{ href: '/#sedes', label: 'Todas las sedes' }}
        waNumero={sede.whatsapp}
        waTexto={`Hola Fosque ${sede.nombre}! Quiero empezar`}
      />

      <div className="badge">
        ★ {sede.rating} · {sede.reviews} opiniones
      </div>

      {/* HERO: nombre de sede gigante, video en sandwich */}
      <section className="sede-hero" data-bg="#F0E9D8">
        <div className="stack">
          <div className="title-back">{sede.heroBack}</div>
          <Vph className="frame" shot={sede.shotHero} />
          <div className="title-front">{sede.heroFront}</div>
        </div>
        <p className="sub">{sede.descripcion}</p>
        <div className="ctas">
          <a className="btn solid" href={waDiagnostico} target="_blank" rel="noopener">
            Quiero mi sesión de diagnóstico
          </a>
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

      {/* INFO */}
      <section id="info" data-bg="#DCEAEE">
        <div className="wrap grid">
          <div>
            <div className="eyebrow">
              Sede {sede.nombre} · {sede.barrio}
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
                <b>{sede.instagram ?? 'Muy pronto'}</b>
              </div>
            </div>
            <div className="card resena">
              <div className="stars">
                {sede.rating}
                <small>{sede.reviews} opiniones en Google</small>
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

      {/* GALERÍA */}
      <section id="galeria" data-bg="#F8DDE0">
        <h2 className="wrap">Conocé el espacio antes de venir.</h2>
        <div className="rail">
          {sede.galeria.map((shot) => (
            <Vph key={shot} shot={shot} />
          ))}
        </div>
      </section>

      {/* EQUIPO DE LA SEDE */}
      <section id="equipo" data-bg="#F5E3CB">
        <div className="wrap">
          <div className="eyebrow">El equipo de {sede.nombre}</div>
          <h2>Las personas que te van a cuidar.</h2>
          <div className="row">
            <Vph play={false} shot="📷 Retrato instructora · fondo crema" />
            <Vph play={false} shot="📷 Ejecutiva en recepción" />
            <Vph play={false} shot="📷 Instructor corrigiendo postura" />
            <Vph play={false} shot="📷 Equipo completo de la sede" />
          </div>
        </div>
      </section>

      {/* MITOS */}
      <section id="mitos" data-bg={sede.colorFondo}>
        <div className="wrap">
          <div className="eyebrow">Derribando mitos</div>
          <h2>Todo lo que pensás antes de animarte.</h2>
          <Mitos mitos={mitosParaSede(sede)} />
        </div>
      </section>

      {/* CTA FINAL */}
      <section id="final" data-bg="#F0E9D8">
        <div className="eyebrow">Tu primera clase te espera</div>
        <h2>Vení a probar. La llamamos clase de diagnóstico.</h2>
        <p>
          Después de esa clase recibís una devolución personalizada sobre cuáles son las mejores
          clases y planes para vos.
        </p>
        <a
          className="btn solid"
          style={{ fontSize: '1rem', padding: '1rem 2.2rem' }}
          href={waLink(sede.whatsapp, `Hola! Quiero mi clase de diagnóstico en ${sede.nombre}`)}
          target="_blank"
          rel="noopener"
        >
          Reservar mi clase de diagnóstico
        </a>
      </section>

      <Footer />
      <WaFloat numero={sede.whatsapp} />
    </SedeFx>
  );
}
