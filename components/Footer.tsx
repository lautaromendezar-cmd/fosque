import Link from 'next/link';
import { sedes } from '@/data/sedes';
import Logo from '@/components/logo/Logo';
import RingsDeco from '@/components/RingsDeco';
import FooterFx from '@/components/FooterFx';

export default function Footer() {
  return (
    <FooterFx>
      <footer>
        <RingsDeco id="footer" from="#F2B778" to="#E8927C" className="br" />
        <div className="cols">
          <div>
            <div className="fw">
              <Logo iso={44} word={19} />
            </div>
            <p className="claim">Mejora la Vida. Desde el año 2000.</p>
          </div>
          <div>
            <h4 className="h-sedes">SEDES</h4>
            {sedes.map((s) => (
              <Link key={s.slug} href={`/${s.slug}/`}>
                {s.nombre}
              </Link>
            ))}
          </div>
          <div>
            <h4 className="h-fosque">FOSQUE</h4>
            <Link href="/#historia">Historia</Link>
            <Link href="/#programa">El Programa</Link>
            <Link href="/novedades/">Novedades</Link>
          </div>
          <div>
            <h4 className="h-socios">SOCIOS</h4>
            <a href="#">Ingresá a tu Perfil</a>
            <a href="#">Instagram</a>
          </div>
        </div>
      </footer>
    </FooterFx>
  );
}
