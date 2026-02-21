import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that should be inaccessible to authenticated users
const authRoutes = ['/login', '/register', '/forgot-password'];

// Public routes that don't require authentication
const publicRoutes = [...authRoutes, '/api/auth/session', '/api/auth/login', '/api/auth/logout'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));
  const isApiRoute = pathname.startsWith('/api/');

  // 1. If the user has a token and tries to access an auth route,
  // redirect them to the dashboard/home page.
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 2. If the user DOES NOT have a token and tries to access a protected route 
  // (anything not in publicRoutes), redirect them to /login
  if (!token && !isPublicRoute) {
    // If it's an API route, return 401 JSON instead of redirecting to a page
    if (isApiRoute) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // We'll let middleware run on all API routes so it can protect them natively
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
