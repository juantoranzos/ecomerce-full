import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Check if the route is an admin route
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // Retrieve the secure HttpOnly cookies set by our login API
        const sessionToken = request.cookies.get('auth_session')?.value;
        const userRole = request.cookies.get('user_role')?.value;

        // Verify session exists and role is 'admin'
        if (!sessionToken || userRole !== 'admin') {
            const loginUrl = new URL('/login', request.url);
            // Optional: Pass the original requested URL to redirect back after login
            loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);

            console.log(`[Middleware] Unauthorized attempt to access admin area: ${request.nextUrl.pathname}`);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
