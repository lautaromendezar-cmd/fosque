'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { sedes, waLink, PLATAFORMA_URL } from '@/data/sedes';
import Logo from '@/components/logo/Logo';

// 26-09: el botón decía "Ingresá a tu Perfil". El cliente pidió que la
// membresía tenga su propio botón ("un botón Membresía F, como la habíamos
// visto"), porque en las landings "quedó relegada".
// URL del login de socios (EVO): PLATAFORMA_URL vive en data/sedes.ts y sigue
// pendiente del cliente; la comparten el nav, el footer y la sección Membresía.

/* Fosque no tiene una cuenta de Instagram general: tiene UNA POR SEDE, y son
   las que están en data/sedes.ts. Por eso el ícono del nav no es un link, es un
   desplegable con las tres — igual que "Tu Sucursal".
   El ícono de Facebook se fue el 4-sep: nunca llegó la URL y quedaba
   apuntando a '#', o sea un link muerto en las 9 páginas. Si algún día manda
   la cuenta, vuelve. */
const sedesConIg = sedes.filter((s) => s.instagram);
const arroba = (url: string) => `@${new URL(url).pathname.replaceAll('/', '')}`;

function IconIg() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
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

/* Abrir en hover y cerrar con un delay de gracia. El delay no es un adorno: sin
   él, el puntero que cruza el hueco entre el disparador y el panel lo cierra a
   mitad de camino. Son dos desplegables (Tu Sucursal e Instagram) con estado
   propio: si compartieran uno, pasar por el ícono abriría también el de sedes. */
function useDesplegable(delayCierre = 140) {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const abrir = () => {
    if (timer.current) clearTimeout(timer.current);
    setOpen(true);
  };
  const cerrar = (delay = delayCierre) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(false), delay);
  };

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  return { open, abrir, cerrar, cerrarYa: () => setOpen(false) };
}

export default function Nav({ waNumero, waTexto }: { waNumero: string; waTexto: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const sub = useDesplegable();
  const ig = useDesplegable();
  const wa = waLink(waNumero, waTexto);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      sub.cerrarYa();
      ig.cerrarYa();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            className={`nlink has-sub${sub.open ? ' sub-open' : ''}`}
            onMouseEnter={sub.abrir}
            onMouseLeave={() => sub.cerrar()}
            onFocus={sub.abrir}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) sub.cerrar(0);
            }}
          >
            <Link href="/#sedes" aria-expanded={sub.open} onClick={() => sub.cerrar(0)}>
              <Roll>Tu Sucursal</Roll>
              <svg className="caret" viewBox="0 0 10 6" aria-hidden="true">
                <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </Link>
            <div className="sub">
              {sedes.map((s) => (
                <Link key={s.slug} href={`/${s.slug}/`} onClick={() => sub.cerrar(0)}>
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
          <Link className="nlink" href="/franquicia/">
            <Roll>Franquicia</Roll>
          </Link>
        </div>

        <div className="right">
          <div
            className={`nav-social has-sub${ig.open ? ' sub-open' : ''}`}
            onMouseEnter={ig.abrir}
            onMouseLeave={() => ig.cerrar()}
            onFocus={ig.abrir}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) ig.cerrar(0);
            }}
          >
            <button
              type="button"
              className="ig-trigger"
              aria-expanded={ig.open}
              aria-haspopup="true"
              aria-label="Instagram de Fosque, por sucursal"
              onClick={() => (ig.open ? ig.cerrarYa() : ig.abrir())}
            >
              <IconIg />
            </button>
            <div className="sub">
              {sedesConIg.map((s) => (
                <a
                  key={s.slug}
                  href={s.instagram as string}
                  target="_blank"
                  rel="noopener"
                  onClick={() => ig.cerrar(0)}
                >
                  <span className="sub-num">{s.numero}</span>
                  <span>
                    {s.nombre}
                    <small>{arroba(s.instagram as string)}</small>
                  </span>
                </a>
              ))}
            </div>
          </div>
          <a className="btn evo" href={PLATAFORMA_URL}>
            Membresía F
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

      <div
        className={`mobile-menu${open ? ' open' : ''}`}
        onClick={() => setOpen(false)}
        /* scrollea por dentro en pantallas bajas: mismo recurso que los raíles */
        data-lenis-prevent
      >
        <div className="mm-inner">
          {/* MEMBRESÍA F, destacada y PRIMERA (26-09). Antes era el último
              ítem del menú, debajo de "Contacto" y fuera de la pantalla: el
              cliente la veía "como una cosa más, chiquita" siendo lo más
              importante que vende. Ahora abre el menú, explica qué es y separa
              las dos intenciones: sacarla y entrar a la tuya. */}
          <div className="mm-membresia">
            <div className="mm-label">Membresía F</div>
            <p>Tu pasaporte a un nuevo estilo de vida para sentirte mejor todos los días.</p>
            <a className="btn solid" href={wa} target="_blank" rel="noopener">
              Quiero mi Membresía F
            </a>
            <a className="btn" href={PLATAFORMA_URL}>
              Ingresar a mi Membresía F
            </a>
          </div>

          {/* El Instagram de cada sede va acá, al lado de la sede, y no en una
              sección aparte: el menú ya lista las tres, y repetirlas abajo lo
              estiraba 166px — el tercer Instagram quedaba abajo del borde y
              había que descubrir que el menú scrollea. */}
          <div className="mm-label">Tu Sucursal</div>
          {sedes.map((s) => (
            <div key={s.slug} className="mm-row">
              <Link className="mm-link" href={`/${s.slug}/`}>
                {s.nombre} {s.barrio !== s.nombre && <small>{s.barrio}</small>}
              </Link>
              {s.instagram && (
                <a
                  className="mm-ig"
                  href={s.instagram}
                  target="_blank"
                  rel="noopener"
                  aria-label={`Instagram de Fosque ${s.nombre}, ${arroba(s.instagram)}`}
                >
                  <IconIg />
                </a>
              )}
            </div>
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
          <Link className="mm-link" href="/franquicia/">
            Franquicia
          </Link>
          <a className="mm-link" href={wa} target="_blank" rel="noopener">
            Contacto
          </a>
        </div>
      </div>
    </>
  );
}
