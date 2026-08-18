import "server-only";
import { randomUUID } from "node:crypto";
import { cache } from "react";
import bcrypt from "bcryptjs";
import { supabaseAdmin, TABLES } from "@/lib/supabase";
import { requireSession } from "@/data/session";
import { UsuarioSchema, type UsuarioInput } from "@/lib/validations";
import type { UserRow } from "@/types/db";

export const listUsuarios = cache(async () => {
  await requireSession();

  const { data, error } = await supabaseAdmin
    .from(TABLES.user)
    .select("id, name, email, createdAt")
    .order("createdAt", { ascending: true });
  if (error) throw new Error(error.message);

  return data as Omit<UserRow, "passwordHash">[];
});

export async function crearUsuario(input: UsuarioInput) {
  await requireSession();

  const data = UsuarioSchema.parse(input);

  const { data: existente, error: findError } = await supabaseAdmin
    .from(TABLES.user)
    .select("id")
    .eq("email", data.email)
    .maybeSingle();
  if (findError) throw new Error(findError.message);
  if (existente) throw new Error("EMAIL_EN_USO");

  const passwordHash = await bcrypt.hash(data.password, 12);

  const { error } = await supabaseAdmin.from(TABLES.user).insert({
    id: randomUUID(),
    name: data.name,
    email: data.email,
    passwordHash,
    createdAt: new Date().toISOString(),
  });
  if (error) throw new Error(error.message);
}
