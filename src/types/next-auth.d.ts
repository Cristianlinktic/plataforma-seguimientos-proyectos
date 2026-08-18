import type { DefaultSession } from "next-auth";
import type { RolUsuario } from "@/types/db";

declare module "next-auth" {
  interface User {
    role?: RolUsuario;
  }

  interface Session {
    user: {
      id: string;
      role: RolUsuario;
    } & DefaultSession["user"];
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
    role?: RolUsuario;
  }
}
