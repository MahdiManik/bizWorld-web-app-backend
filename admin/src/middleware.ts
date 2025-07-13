import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Check if the path is public (login, register, etc.)
  const isPublicPath =
    path === "/" ||
    path === "/login" ||
    path === "/register" ||
    path === "/forgot-password" ||
    path === "/reset-password" ||
    path === "/new-password" ||
    path === "/reset-complete" ||
    path === "/verify-email" ||
    path === "/otp-verification" ||
    path === "/set-password";

  // Get the session cookie
  const authSession = request.cookies.get("authToken")?.value;

  // If the path is not public and there's no session, redirect to login
  if (!isPublicPath && !authSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If the path is public and there's a session, redirect to dashboard
  if (isPublicPath && authSession && path !== "/verify-email") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
