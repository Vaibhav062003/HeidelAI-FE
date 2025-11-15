import { clerkMiddleware } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { rootDomain } from "@/lib/utils";

const allowedOrigins: string[] = [
  "https://heidelai.com",
  "https://www.heidelai.com",
  "https://development.heidelai.com",
  "https://testing.heidelai.com",
  "https://testing2.heidelai.com",
];

function applyCors(req: NextRequest, res: NextResponse): NextResponse {
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

function extractSubdomain(request: NextRequest): string | null | NextResponse {
  const url = request.url;
  const host = request.headers.get("host") || "";
  const hostname = host.split(":")[0];
  const { pathname } = request.nextUrl;
  const isDashboard = pathname.startsWith("/dashboard");

  if (url.includes("localhost") || url.includes("127.0.0.1")) {
    const match = url.match(/http:\/\/([^.]+)\.localhost/);

    if (match && match[1]) return match[1];
    if (hostname.includes(".localhost")) return hostname.split(".")[0];

    return null;
  }

  const token = request.cookies.get("session-token")?.value;
  if (isDashboard && !token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  const rootDomainFormatted = rootDomain.split(":")[0];

  if (hostname.includes("---") && hostname.endsWith(".vercel.app")) {
    return hostname.split("---")[0] ?? null;
  }

  const isSubdomain =
    hostname !== rootDomainFormatted &&
    hostname !== `www.${rootDomainFormatted}` &&
    hostname.endsWith(`.${rootDomainFormatted}`);

  if (isSubdomain) {
    return hostname.replace(`.${rootDomainFormatted}`, "");
  }

  return null;
}

export default clerkMiddleware((auth, request: NextRequest): NextResponse => {
  const pathname = request.nextUrl.pathname;

  if (request.method === "OPTIONS" && pathname.startsWith("/api")) {
    return applyCors(request, new NextResponse(null, { status: 204 }));
  }

  let response = NextResponse.next();

  const subdomainResult = extractSubdomain(request);

  // If Dashboard auth returned a redirect
  if (subdomainResult instanceof NextResponse) {
    return subdomainResult;
  }

  // If subdomain exists → rewrite
  if (typeof subdomainResult === "string") {
    response = NextResponse.rewrite(
      new URL(`/s/${subdomainResult}`, request.url)
    );
  }

  if (pathname.startsWith("/api")) {
    response = applyCors(request, response);
  }

  return response;
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API and tRPC
    "/(api|trpc)(.*)",
  ],
};
