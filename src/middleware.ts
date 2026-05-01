import { NextResponse } from 'next/server';
import { auth } from '@/auth.config';

export default auth(async function middleware(req) {
  const pathname = req.nextUrl.pathname;
  const isAdmin = (req.auth?.user as any)?.role === 'admin';

  if (pathname.startsWith('/auth')) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/construction')) {
    if (isAdmin) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    return NextResponse.next();
  }

  if (isAdmin) return NextResponse.next();

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
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
