'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { sedes, waLink } from '@/data/sedes';
import Logo from '@/components/logo/Logo';

// URL exacta del login EVO: pendiente de cliente
const EVO_URL = '#';
// Redes oficiales de Fosque: URLs pendientes de cliente
const IG_URL = '#';
const FB_URL = '#';

function IconIg() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconFb() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.5 1.6-1.5h1.3V4.9c-.2 0-1-.1-1.9-.1-1.9 0-3.2 1.2-3.2 3.3V11H9v3h2.3v7h2.2z" />
    </svg>
  );
}

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
  const [subOpen, setSubOpen] = useState(false);
  const subTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wa = waLink(waNumero, waTexto);

  const openSub = () => {
    if (subTimer.current) clearTimeout(subTimer.current);
    setSubOpen(true);
  };
  const closeSub = (delay = 140) => {
    if (subTimer.current) clearTimeout(subTimer.current);
    subTimer.current = setTimeout(() => setSubOpen(false), delay);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSubOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKey);
      if (subTimer.current) clearTimeout(subTimer.current);
    };
  }, []);

  return (
    <>
      <nav className={`${scrolled ? 'scrolled' : ''}${open ? ' menu-open' : ''}`}>
        <Link className="logo" href="/" aria-label="FOSQUE — inicio">
          <Logo />
        </Link>

        <div className="links">
          <Link className="nlink" href="/#programa">
            <Roll>Método Fosque</Roll>
          </Link>
          {/* <a> nativo: Link de Next pisa el hash cuando hay varios al mismo
              pathname (bug de la caché de prefetch del App Router) */}
          <a className="nlink" href="/equipo/#profe">
            <Roll>Profe Fosque</Roll>
          </a>
          <a className="nlink" href="/equipo/#ejecutiva">
            <Roll>Ejecutiva Fosque</Roll>
          </a>
          <div
            className={`nlink has-sub${subOpen ? ' sub-open' : ''}`}
            onMouseEnter={openSub}
            onMouseLeave={() => closeSub()}
            onFocus={openSub}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) closeSub(0);
            }}
          >
            <Link href="/#sedes" aria-expanded={subOpen} onClick={() => closeSub(0)}>
              <Roll>Tu Sucursal</Roll>
              <svg className="caret" viewBox="0 0 10 6" aria-hidden="true">
                <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </Link>
            <div className="sub">
              {sedes.map((s) => (
                <Link key={s.slug} href={`/${s.slug}/`} onClick={() => closeSub(0)}>
                  <span className="sub-num">{s.numero}</span>
                  <span>
                    {s.nombre}
                    {s.barrio !== s.nombre && <small>{s.barrio}</small>}
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <Link className="nlink" href="/novedades/">
            <Roll>Novedades</Roll>
          </Link>
        </div>

        <div className="right">
          <div className="nav-social">
            <a href={IG_URL} aria-label="Instagram de Fosque">
              <IconIg />
            </a>
            <a href={FB_URL} aria-label="Facebook de Fosque">
              <IconFb />
            </a>
          </div>
          <a className="btn evo" href={EVO_URL}>
            Ingresá a tu Perfil
          </a>
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
          <div className="mm-label">Tu Sucursal</div>
          {sedes.map((s) => (
            <Link key={s.slug} className="mm-link" href={`/${s.slug}/`}>
              {s.nombre} {s.barrio !== s.nombre && <small>{s.barrio}</small>}
            </Link>
          ))}
          <div className="mm-label">Fosque</div>
          <Link className="mm-link" href="/#programa">
            Método Fosque
          </Link>
          <a className="mm-link" href="/equipo/#profe">
            Profe Fosque
          </a>
          <a className="mm-link" href="/equipo/#ejecutiva">
            Ejecutiva Fosque
          </a>
          <Link className="mm-link" href="/novedades/">
            Novedades
          </Link>
          <a className="mm-link" href={wa} target="_blank" rel="noopener">
            Contacto
          </a>
          <a className="btn evo-m" href={EVO_URL}>
            Ingresá a tu Perfil
          </a>
          <div className="mm-social">
            <a href={IG_URL} aria-label="Instagram de Fosque">
              <IconIg />
            </a>
            <a href={FB_URL} aria-label="Facebook de Fosque">
              <IconFb />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
