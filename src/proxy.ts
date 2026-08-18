import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";

/**
 * Instancia liviana de NextAuth (sin el provider de Credentials ni Prisma/bcrypt)
 * solo para leer el JWT de la cookie de sesión. Esto es un chequeo OPTIMISTA:
 * la autorización real se vuelve a verificar en cada Server Action / página
 * mediante `requireSession()` en `src/data/session.ts`.
 */
const { auth } = NextAuth(authConfig);

const PUBLIC_ROUTES = ["/login"];

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isPublicRoute = PUBLIC_ROUTES.some((route) => nextUrl.pathname.startsWith(route));

  if (!isLoggedIn && !isPublicRoute) {
    const redirectUrl = new URL("/login", nextUrl);
    redirectUrl.searchParams.set("from", nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (isLoggedIn && isPublicRoute) {
    return NextResponse.redirect(new URL("/proyectos", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)"],
};
