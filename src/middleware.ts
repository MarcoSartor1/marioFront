import { NextRequest, NextResponse } from 'next/server';
import { getToken } from '@auth/core/jwt';

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Auth pages: siempre permitir para que el admin pueda iniciar sesión
  if (pathname.startsWith('/auth')) {
    return NextResponse.next();
  }

  // En producción (HTTPS) NextAuth v5 usa el prefijo __Secure- en la cookie
  const cookieName =
    process.env.NODE_ENV === 'production'
      ? '__Secure-authjs.session-token'
      : 'authjs.session-token';

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET!,
    cookieName,
  });
  const isAdmin = (token?.data as any)?.role === 'admin';

  // Si el admin llega a /construction, redirigir al inicio
  if (pathname.startsWith('/construction')) {
    if (isAdmin) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    return NextResponse.next();
  }

  // El admin siempre tiene acceso al resto del sitio
  if (isAdmin) return NextResponse.next();

  // Para usuarios comunes: verificar si el sitio está publicado
  try {
    const resp = await fetch(`${process.env.API_URL}/config`);
    if (resp.ok) {
      const config = await resp.json();
      if (config.isPublished === false) {
        return NextResponse.redirect(new URL('/construction', req.url));
      }
    }
  } catch {
    // Si la API no responde, dejar pasar (fail open)
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
