import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

/**
 * Chequeo SEGURO de sesión: valida el JWT firmado por NextAuth en cada llamada.
 * Memoizado por render con React.cache para no repetir trabajo dentro del mismo request.
 * Úsalo en toda página, Server Action o Route Handler que toque datos del proyecto —
 * el chequeo optimista del proxy no es suficiente por sí solo (ver docs/data-security).
 */
export const getCurrentUser = cache(async () => {
  const session = await auth();
  return session?.user ?? null;
});

export async function requireSession() {
  const user = await getCurrentUser();
  if (!user?.id) {
    redirect("/login");
  }
  return user;
}
