import type { Metadata } from 'next';
import { Archivo, Baloo_Bhaijaan_2, Bebas_Neue } from 'next/font/google';
import SmoothScroll from '@/components/SmoothScroll';
import './globals.css';

// Titulares: stand-in de Momo Trust Display hasta tener el .woff2 del cliente
const archivo = Archivo({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['wdth'],
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
    <html lang="es" className={`${archivo.variable} ${baloo.variable} ${bebas.variable}`}>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
