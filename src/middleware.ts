import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Allow static assets, images, next internals, and login/auth APIs
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/admin/login') ||
    pathname === '/admin/login' ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. Protect ALL /admin and /admin/* routes
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    const token = req.cookies.get('wbk_admin_token')?.value;

    if (!token) {
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const jwtSecret = process.env.JWT_SECRET || 'woolberry_super_secret_signing_key_32_chars';
      const secret = new TextEncoder().encode(jwtSecret);
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch (err) {
      // Invalid / expired token -> clear cookie and redirect
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('from', pathname);
      const res = NextResponse.redirect(loginUrl);
      res.cookies.delete('wbk_admin_token');
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};