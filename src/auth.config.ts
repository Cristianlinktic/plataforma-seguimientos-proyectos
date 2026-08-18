import type { NextAuthConfig } from "next-auth";

/**
 * Config sin acceso a Prisma/bcrypt: es la que puede cargar el proxy (Edge/Node
 * runtime ligero) para hacer el chequeo optimista de sesión sin tocar la base de datos.
 */
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
