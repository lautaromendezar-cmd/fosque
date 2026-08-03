import Link from 'next/link';
import { waLink } from '@/data/sedes';

// URL exacta del login EVO: pendiente de cliente
const EVO_URL = '#';

export default function Nav({
  backLink,
  waNumero,
  waTexto,
}: {
  backLink?: { href: string; label: string };
  waNumero: string;
  waTexto: string;
}) {
  return (
    <nav>
      <Link className="logo" href="/">
        FOSQUE
      </Link>
      <div className="right">
        {backLink && (
          <Link className="back" href={backLink.href}>
            ← {backLink.label}
          </Link>
        )}
        <a className="btn" href={EVO_URL} title="Login EVO">
          Ingresá a tu Perfil
        </a>
        <a className="btn solid" href={waLink(waNumero, waTexto)} target="_blank" rel="noopener">
          Empezá hoy
        </a>
      </div>
    </nav>
  );
}
