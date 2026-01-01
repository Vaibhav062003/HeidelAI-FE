import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export default clerkMiddleware((auth, request) => {
    const { pathname } = request.nextUrl;

    const isDashboard = pathname.startsWith('/dashboard');
    const token = request.cookies.get('session-token')?.value;

    if (isDashboard && !token) {
        // Redirect to login if not authenticated
        const loginUrl = new URL('/login', request.url);
        NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};