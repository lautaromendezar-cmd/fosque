import Link from 'next/link';
import { sedes, PLATAFORMA_URL } from '@/data/sedes';
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
            <h4 className="h-sedes">SUCURSALES</h4>
            {sedes.map((s) => (
              <Link key={s.slug} href={`/${s.slug}/`}>
                {s.nombre}
              </Link>
            ))}
          </div>
          <div>
            <h4 className="h-fosque">FOSQUE</h4>
            <Link href="/#historia">Historia</Link>
            <Link href="/#programa">Método Fosque</Link>
            <Link href="/equipo/">El Equipo</Link>
            <Link href="/novedades/">Novedades</Link>
            <Link href="/franquicia/">Franquicia</Link>
          </div>
          <div>
            <h4 className="h-socios">SOCIOS</h4>
            {/* 26-09: mismo nombre que el botón del nav, a pedido del cliente */}
            <a href={PLATAFORMA_URL}>Membresía F</a>
            {sedes.map(
              (s) =>
                s.instagram && (
                  <a key={s.slug} href={s.instagram} target="_blank" rel="noopener">
                    Instagram {s.nombre}
                  </a>
                ),
            )}
          </div>
        </div>
      </footer>
      <div className="subfooter">Diseño Web: Lautaro Mendez</div>
    </FooterFx>
  );
}
