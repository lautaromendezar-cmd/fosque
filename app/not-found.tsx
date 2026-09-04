import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import WaFloat from '@/components/WaFloat';
import RingsDeco from '@/components/RingsDeco';
import { sedes, waLink, WA_GENERAL } from '@/data/sedes';

// Google todavía tiene indexado el sitio viejo de Bitrix24 (URLs tipo
// /nunez/home/, /emiliocastro/home/, y las de las franquicias que este sitio no
// cubre). Esta página es la que reciben: no se indexa, pero tiene que devolverle
// al visitante el camino a su sede.
export const metadata: Metadata = {
  title: 'Esta página no existe',
  description: 'La página que buscabas se mudó o ya no existe. Entrá por tu sede de Fosque.',
  // Next ya le pone el noindex al not-found, no hace falta repetirlo. Lo que SÍ
  // hace falta es matar el canonical heredado del layout: dejaba el 404
  // apuntando a /_not-found/, una URL que no existe.
  alternates: { canonical: null },
};

export default function NotFound() {
  return (
    <>
      <Nav waNumero={WA_GENERAL} waTexto="Hola Fosque! Quiero saber más" />
      <section id="e404">
        <RingsDeco id="e404" from="#F2B778" to="#E8927C" className="br" />
        <div className="wrap">
          <div className="e404-head">
            <div className="eyebrow">Error 404</div>
            <h1>
              Esta página
              <br />
              se mudó.
            </h1>
            <p className="intro">
              Renovamos el sitio y algunas direcciones viejas quedaron dando vueltas por
              internet. La información sigue estando: elegí tu sede y te llevamos.
            </p>
          </div>

          <div className="e404-sedes">
            {sedes.map((s) => (
              <Link key={s.slug} className="e404-sede" href={`/${s.slug}/`}>
                <span className="num">{s.numero}</span>
                <span className="txt">
                  <strong>Fosque {s.nombre}</strong>
                  <small>
                    {s.barrio} · {s.direccion}
                  </small>
                </span>
                <span className="arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            ))}
          </div>

          <div className="e404-mas">
            <Link className="btn solid" href="/">
              Volver al inicio
            </Link>
            <Link className="btn" href="/#programa">
              Método Fosque
            </Link>
            <Link className="btn" href="/novedades/">
              Novedades
            </Link>
            <Link className="btn" href="/franquicia/">
              Franquicia
            </Link>
            <a
              className="btn"
              href={waLink(WA_GENERAL, 'Hola Fosque! Entré por un link viejo y no encontré la página')}
              target="_blank"
              rel="noopener"
            >
              Escribinos por WhatsApp
            </a>
          </div>
        </div>
      </section>
      <Footer />
      <WaFloat numero={WA_GENERAL} />
    </>
  );
}
