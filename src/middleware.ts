import { NextRequest, NextResponse } from "next/server";
import { readSession } from "@/lib/session";

const protectedRoutes = ["/portfolio", "/account"];
const publicRoutes = ["/auth"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const session = await readSession();

  if (isProtectedRoute && (!session?.userId || !session?.isLoggedin)) {
    return NextResponse.redirect(new URL("/auth", req.nextUrl));
  }

  if (isPublicRoute && session?.userId && session?.isLoggedin) {
    return NextResponse.redirect(new URL("/portfolio", req.nextUrl));
  }

  return NextResponse.next();
}

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
