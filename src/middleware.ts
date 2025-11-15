import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { rootDomain } from "@/lib/utils";

const allowedOrigins = [
  "https://heidelai.com",
  "https://www.heidelai.com",
  "https://development.heidelai.com",
  "https://testing.heidelai.com",
  "https://testing2.heidelai.com",
];

function applyCors(req: NextRequest, res: NextResponse) {
  const origin = req.headers.get("origin") || "";

  if (allowedOrigins.includes(origin)) {
    res.headers.set("Access-Control-Allow-Origin", origin);
    res.headers.set(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,DELETE,OPTIONS"
    );
    res.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    res.headers.set("Access-Control-Max-Age", "86400");
  }

  return res;
}

function extractSubdomain(request: NextRequest): string | null {
  const url = request.url;
  const host = request.headers.get("host") || "";
  const hostname = host.split(":")[0];
  const { pathname } = request.nextUrl;
  const isDashboard = pathname.startsWith("/dashboard");

  // Local development
  if (url.includes("localhost") || url.includes("127.0.0.1")) {
    const fullUrlMatch = url.match(/http:\/\/([^.]+)\.localhost/);
    if (fullUrlMatch && fullUrlMatch[1]) {
      return fullUrlMatch[1];
    }

    if (hostname.includes(".localhost")) {
      return hostname.split(".")[0];
    }

    return null;
  }

  // Dashboard auth check
  const token = request.cookies.get("session-token")?.value;
  if (isDashboard && !token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl) as any;
  }

  // Production
  const rootDomainFormatted = rootDomain.split(":")[0];

  // Preview deployments (tenant---branch.vercel.app)
  if (hostname.includes("---") && hostname.endsWith(".vercel.app")) {
    const parts = hostname.split("---");
    return parts.length > 0 ? parts[0] : null;
  }

  // Regular subdomain detection
  const isSubdomain =
    hostname !== rootDomainFormatted &&
    hostname !== `www.${rootDomainFormatted}` &&
    hostname.endsWith(`.${rootDomainFormatted}`);

  return isSubdomain ? hostname.replace(`.${rootDomainFormatted}`, "") : null;
}

export default clerkMiddleware((auth, request) => {
  const { pathname } = request.nextUrl;

  if (request.method === "OPTIONS" && pathname.startsWith("/api")) {
    return applyCors(request, new NextResponse(null, { status: 204 }));
  }

  let response = NextResponse.next();

  const subdomain = extractSubdomain(request);

  // Subdomain rewrite
  if (typeof subdomain === "string") {
    response = NextResponse.rewrite(
      new URL(`/s/${subdomain}`, request.url)
    );
  } else if (subdomain instanceof NextResponse) {
    // Dashboard redirect case
    return subdomain;
  }

  if (pathname.startsWith("/api")) {
    response = applyCors(request, response);
  }

  return response;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
