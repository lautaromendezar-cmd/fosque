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

export const metadata: Metadata = {
  title: {
    default: 'Fosque — Mejora la Vida',
    template: '%s · Fosque',
  },
  description:
    'Fosque no es un gimnasio. Es el lugar donde sos bienvenida, te acompañamos y transformamos el ejercicio en el gran logro de tu vida. Fosque Reformer en Mataderos y Núñez.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${momo.variable} ${baloo.variable} ${bebas.variable}`}>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
