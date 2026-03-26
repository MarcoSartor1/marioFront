import { Inter, Montserrat_Alternates } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Mejora performance
});

export const titleFont = Montserrat_Alternates({
  subsets: ['latin'],
  weight: ['500', '700'],
  display: 'swap', // Mejora performance
  fallback: ['system-ui', 'arial', 'sans-serif'], // Fallback explícito
});