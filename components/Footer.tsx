import Link from 'next/link';
import { sedes } from '@/data/sedes';
import Logo from '@/components/logo/Logo';

export default function Footer() {
  return (
    <footer>
      <div className="cols">
        <div>
          <div className="fw">
            <Logo iso={44} word={19} />
          </div>
          <p className="claim">Mejora la Vida. Desde el año 2000.</p>
        </div>
        <div>
          <h4>SEDES</h4>
          {sedes.map((s) => (
            <Link key={s.slug} href={`/${s.slug}/`}>
              {s.nombre}
            </Link>
          ))}
        </div>
        <div>
          <h4>FOSQUE</h4>
          <Link href="/#historia">Historia</Link>
          <Link href="/#programa">El Programa</Link>
          <Link href="/novedades/">Novedades</Link>
        </div>
        <div>
          <h4>SOCIOS</h4>
          <a href="#">Ingresá a tu Perfil</a>
          <a href="#">Instagram</a>
        </div>
      </div>
    </footer>
  );
}
