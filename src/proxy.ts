import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse, userAgent } from 'next/server'

// 1. Define which routes are "Dashboard" routes
const isDashboardRoute = createRouteMatcher(['/dashboard'])

export default clerkMiddleware(async (auth, req) => {
  const { device } = userAgent(req)
  const url = req.nextUrl.clone()

  // 2. Check if the user is visiting a dashboard route
  if (isDashboardRoute(req)) {

    // 3. Block mobile devices
    if (device.type === 'mobile' || device.type === 'tablet') {
      url.pathname = '/desktop-required'
      return NextResponse.rewrite(url)
    }

    // 4. Optional: Protect the route with Clerk (Force Login)
    // await auth.protect() 
  }
})

export const config = {
  matcher: [
    // Standard Next.js/Clerk matcher logic
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}