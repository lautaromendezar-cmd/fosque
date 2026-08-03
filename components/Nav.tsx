'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { sedes, waLink } from '@/data/sedes';
import Logo from '@/components/logo/Logo';

// URL exacta del login EVO: pendiente de cliente
const EVO_URL = '#';

/** Texto duplicado para el hover "rolling": la copia de abajo sube en terracota */
function Roll({ children }: { children: string }) {
  return (
    <span className="roll">
      <span className="l">{children}</span>
      <span className="l c" aria-hidden="true">
        {children}
      </span>
    </span>
  );
}

export default function Nav({ waNumero, waTexto }: { waNumero: string; waTexto: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const wa = waLink(waNumero, waTexto);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <nav className={scrolled ? 'scrolled' : ''}>
        <Link className="logo" href="/" aria-label="FOSQUE — inicio">
          <Logo />
        </Link>

        <div className="links">
          <div className="nlink has-sub">
            <Link href="/#sedes">
              <Roll>Sedes</Roll>
            </Link>
            <div className="sub">
              {sedes.map((s) => (
                <Link key={s.slug} href={`/${s.slug}/`}>
                  <span className="sub-num">{s.numero}</span>
                  <span>
                    {s.nombre}
                    {s.barrio !== s.nombre && <small>{s.barrio}</small>}
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <Link className="nlink" href="/#programa">
            <Roll>El Programa</Roll>
          </Link>
          <Link className="nlink" href="/#historia">
            <Roll>Historia</Roll>
          </Link>
          <Link className="nlink" href="/novedades/">
            <Roll>Novedades</Roll>
          </Link>
          <a className="nlink" href={wa} target="_blank" rel="noopener">
            <Roll>Contacto</Roll>
          </a>
        </div>

        <div className="right">
          <a className="btn cta" href={wa} target="_blank" rel="noopener">
            Empezá hoy
          </a>
          <button
            className={`burger${open ? ' x' : ''}`}
            aria-label="Menú"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <span />
            <span />
          </button>
        </div>
      </nav>

      <div className={`mobile-menu${open ? ' open' : ''}`} onClick={() => setOpen(false)}>
        <div className="mm-inner">
          <div className="mm-label">Sedes</div>
          {sedes.map((s) => (
            <Link key={s.slug} className="mm-link" href={`/${s.slug}/`}>
              {s.nombre} {s.barrio !== s.nombre && <small>{s.barrio}</small>}
            </Link>
          ))}
          <div className="mm-label">Fosque</div>
          <Link className="mm-link" href="/#programa">
            El Programa
          </Link>
          <Link className="mm-link" href="/#historia">
            Historia
          </Link>
          <Link className="mm-link" href="/novedades/">
            Novedades
          </Link>
          <a className="mm-link" href={wa} target="_blank" rel="noopener">
            Contacto
          </a>
          <a className="btn evo-m" href={EVO_URL}>
            Ingresá a tu Perfil
          </a>
        </div>
      </div>
    </>
  );
}
