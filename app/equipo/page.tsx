import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import WaFloat from '@/components/WaFloat';
import Media from '@/components/Media';
import RingsDeco from '@/components/RingsDeco';
import { WA_GENERAL } from '@/data/sedes';

export const metadata: Metadata = {
  title: 'El Equipo Fosque',
  description:
    'Profe Fosque, Ejecutiva Fosque y el personal de cada sede: las personas que te van a cuidar.',
};

export default function EquipoPage() {
  return (
    <>
      <Nav waNumero={WA_GENERAL} waTexto="Hola Fosque! Quiero saber más" />
      <section id="equipo" className="page clip">
        <RingsDeco id="equipo-pg" from="#F3A6C8" to="#CDB6D9" className="br" />
        <div className="wrap">
          <div className="eyebrow">El Equipo Fosque</div>
          <h1>Las personas que te van a cuidar.</h1>
          <p className="intro">
            Detrás de cada clase hay un equipo que te conoce por tu nombre: quienes te entrenan,
            quienes te acompañan y quienes preparan cada sede para recibirte.
          </p>

          <div className="grupo" id="profe">
            <div className="g-head">
              <h2>Profe Fosque</h2>
              <p className="g-desc">
                Instructores y profesores de sala: te guían en cada clase para que cada movimiento
                sea seguro y efectivo.
              </p>
            </div>
            <div className="row">
              <Media file="equipo-1.jpg" shot="📷 Retrato instructora · fondo crema" />
              <Media file="equipo-3.jpg" shot="📷 Instructor corrigiendo postura" />
              <Media file="equipo-4.jpg" shot="📷 Profes de sala de una sede" />
            </div>
          </div>

          <div className="grupo" id="ejecutiva">
            <div className="g-head">
              <h2>Ejecutiva Fosque</h2>
              <p className="g-desc">
                El equipo comercial y de atención personalizada: tu ejecutiva te acompaña desde el
                primer mensaje y te cuida en todo momento.
              </p>
            </div>
            <div className="row">
              <Media file="equipo-2.jpg" shot="📷 Ejecutiva en recepción" />
              <Media file="galeria-recepcion.jpg" shot="📷 Recepción con ejecutiva sonriendo" />
            </div>
          </div>

          <div className="grupo" id="mantenimiento">
            <div className="g-head">
              <h2>Personal de Mantenimiento</h2>
              <p className="g-desc">
                Los responsables de que cada sede esté siempre limpia e impecable para recibirte.
              </p>
            </div>
            <div className="row">
              <Media
                file="equipo-mantenimiento.jpg"
                shot="📷 Retrato personal de mantenimiento · sede impecable"
              />
              <Media file="galeria-detalle.jpg" shot="📷 Detalle de sala impecable" />
            </div>
          </div>
        </div>
      </section>
      <Footer />
      <WaFloat numero={WA_GENERAL} />
    </>
  );
}
