import type { Metadata } from 'next';
import { Archivo, Quicksand } from 'next/font/google';
import SmoothScroll from '@/components/SmoothScroll';
import './globals.css';

const archivo = Archivo({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['wdth'],
  variable: '--font-disp',
  display: 'swap',
});

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-body',
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
    <html lang="es" className={`${archivo.variable} ${quicksand.variable}`}>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
