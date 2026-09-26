import type { Metadata } from 'next';
import { Baloo_Bhaijaan_2, Bebas_Neue } from 'next/font/google';
import localFont from 'next/font/local';
import SmoothScroll from '@/components/SmoothScroll';
import './globals.css';

// Titulares: Momo Trust Display, la del manual de marca (SIL OFL, gratuita).
// Local porque la lista de next/font/google de esta versión aún no la incluye.
const momo = localFont({
  src: './fonts/momo-trust-display-400.woff2',
  weight: '400',
  variable: '--font-disp',
  display: 'swap',
});

// Texto de lectura: Baloo Bhaijaan 2, la del manual de marca
const baloo = Baloo_Bhaijaan_2({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

// Etiquetas en mayúsculas: Bebas Neue, la del manual de marca
const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-label',
  display: 'swap',
});

// Ojo con `??`: una variable creada VACIA en Vercel llega como '' y lo atraviesa
// (`??` solo atrapa null/undefined), y `new URL('')` mata el build entero.
// Por eso se limpia y se valida, en vez de confiar en el operador.
function urlValida(v: string | undefined): string | null {
  const s = v?.trim();
  if (!s) return null;
  const conEsquema = /^https?:\/\//i.test(s) ? s : `https://${s}`;
  try {
    return new URL(conEsquema).origin;
  } catch {
    return null;
  }
}

const siteUrl =
  urlValida(process.env.NEXT_PUBLIC_SITE_URL) ??
  urlValida(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
  'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  // Canonical relativo a metadataBase: cada pagina declara su URL en fosque.com.
  // Sin esto el sitio queda servido igual en fosque.com, www y el .vercel.app, y
  // Google elige el que quiere (venia indexando el .vercel.app).
  alternates: { canonical: './' },
  title: {
    default: 'Fosque — Mejora la Vida',
    template: '%s · Fosque',
  },
  description:
    'Fosque no es un gimnasio. Es el lugar donde sos bienvenida, te acompañamos y transformamos el ejercicio en el gran logro de tu vida. Fosque Reformer en Mataderos y Núñez.',
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    siteName: 'Fosque',
    title: 'Fosque — Mejora la Vida',
    description:
      'Fosque Reformer, la evolución de Pilates. Tres sucursales en Buenos Aires: José Hernández, Emilio Castro y Núñez.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${momo.variable} ${baloo.variable} ${bebas.variable}`}>
      <body>
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
