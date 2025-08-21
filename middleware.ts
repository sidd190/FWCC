import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(request: NextRequest) {
  // Check if the request is for a dashboard route
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
      return NextResponse.next();
    } catch (error) {
      console.log('JWT verification failed:', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Redirect authenticated users away from auth pages
  if (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup')) {
    const token = request.cookies.get('auth-token')?.value;

    if (token) {
      try {
        jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
        return NextResponse.redirect(new URL('/dashboard', request.url));
      } catch (error) {
        // Invalid token, allow access to auth pages
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup']
};