import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import WaFloat from '@/components/WaFloat';
import { getNovedades } from '@/lib/novedades';
import { WA_GENERAL } from '@/data/sedes';

export const metadata: Metadata = {
  title: 'Novedades',
  description: 'Promos, eventos especiales y novedades de Fosque.',
};

export default function NovedadesPage() {
  const novedades = getNovedades();

  return (
    <>
      <Nav waNumero={WA_GENERAL} waTexto="Hola Fosque! Quiero saber más" />
      <section id="novedades">
        <div className="wrap">
          <div className="eyebrow">Cartelera</div>
          <h1>Novedades Fosque</h1>
          <p className="intro">
            Promos, eventos especiales y todo lo que pasa en tus sedes, contado por nosotras.
          </p>
          {novedades.length === 0 ? (
            <p>Muy pronto vas a encontrar acá todas las novedades.</p>
          ) : (
            <div className="cartelera">
              {novedades.map((n) => (
                <article key={n.slug} className="novedad">
                  <div className="fecha">{n.fechaDisplay}</div>
                  <h2>{n.titulo}</h2>
                  <div className="cuerpo" dangerouslySetInnerHTML={{ __html: n.html }} />
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
      <WaFloat numero={WA_GENERAL} />
    </>
  );
}
