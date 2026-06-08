import { NextResponse } from 'next/server';

export function middleware(request) {
  if (process.env.NODE_ENV === 'development') return NextResponse.next();
  
  const { pathname, searchParams } = request.nextUrl;
  if (pathname === '/' && searchParams.get('x') !== 'kdr_9f2x$Bm#4qL8vZ') {
    return NextResponse.redirect(new URL('/soon', request.url));
  }
}

export const config = {
  matcher: '/',
};