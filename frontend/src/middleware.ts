import { NextRequest, NextResponse } from "next/server";

const protectedPaths = ["/dashboard", "/account"];
const publicPaths = ["/login", "/signup", "/reset-password"];
const publicPathPrefixes = ["/api/", "/_next/", "/favicon.ico"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (publicPathPrefixes.some(prefix => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("accessToken");
  const idToken = request.cookies.get("idToken");
  
  if (
    (protectedPaths.includes(pathname) || pathname.startsWith("/api/protected/")) && 
    (!accessToken || !idToken)
  ) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("returnUrl", encodeURI(pathname));
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/") {
    if (accessToken && idToken) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - Static files (such as images, js, css)
     * - API routes that should be public
     */
    "/((?!.*\\.[\\w]+$|_next).*)",
    "/(api/(?!auth).*)$",
  ],
};