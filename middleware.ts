import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Note: Since we are using client-side Zustand for auth (mock), 
    // server-side middleware can't access that state directly.
    // However, for a real app, we would check cookies/tokens here.
    // For this mock implementation, we'll rely on client-side checks in the components
    // but I'll leave this structure here as a placeholder for where real auth would go.

    // In a real app:
    // const token = request.cookies.get('token');
    // if (!token && request.nextUrl.pathname.startsWith('/admin')) {
    //   return NextResponse.redirect(new URL('/login', request.url));
    // }

    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*',
};
