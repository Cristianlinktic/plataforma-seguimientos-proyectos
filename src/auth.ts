import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "@/auth.config";
import { supabaseAdmin, TABLES } from "@/lib/supabase";
import { LoginSchema } from "@/lib/validations";
import type { UserRow } from "@/types/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Correo", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        const parsed = LoginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const { data: user } = await supabaseAdmin
          .from(TABLES.user)
          .select("*")
          .eq("email", email)
          .maybeSingle<UserRow>();
        if (!user) return null;

        const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
        if (!passwordsMatch) return null;

        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
});
