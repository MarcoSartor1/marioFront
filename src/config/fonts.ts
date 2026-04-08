import { Inter, Atkinson_Hyperlegible } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Mejora performance
});

export const titleFont = Atkinson_Hyperlegible({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap', // Mejora performance
  fallback: ['system-ui', 'arial', 'sans-serif'], // Fallback explícito
});