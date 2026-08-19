import "server-only";
import { randomUUID } from "node:crypto";
import { cache } from "react";
import bcrypt from "bcryptjs";
import { supabaseAdmin, TABLES } from "@/lib/supabase";
import { requireAdmin } from "@/data/session";
import { UsuarioEditSchema, UsuarioSchema, type UsuarioEditInput, type UsuarioInput } from "@/lib/validations";
import type { UserRow } from "@/types/db";

export const listUsuarios = cache(async () => {
  await requireAdmin();

  const { data, error } = await supabaseAdmin
    .from(TABLES.user)
    .select("id, name, email, role, createdAt")
    .order("createdAt", { ascending: true });
  if (error) throw new Error(error.message);

  return data as Omit<UserRow, "passwordHash">[];
});

export async function crearUsuario(input: UsuarioInput) {
  await requireAdmin();

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
    role: data.role,
    createdAt: new Date().toISOString(),
  });
  if (error) throw new Error(error.message);
}

export async function actualizarUsuario(id: string, input: UsuarioEditInput) {
  const admin = await requireAdmin();
  const data = UsuarioEditSchema.parse(input);

  if (admin.id === id && data.role !== "ADMIN") {
    throw new Error("NO_AUTODEGRADAR");
  }

  const { data: existente, error: findError } = await supabaseAdmin
    .from(TABLES.user)
    .select("id")
    .eq("email", data.email)
    .neq("id", id)
    .maybeSingle();
  if (findError) throw new Error(findError.message);
  if (existente) throw new Error("EMAIL_EN_USO");

  const update: { name: string; email: string; role: UsuarioEditInput["role"]; passwordHash?: string } = {
    name: data.name,
    email: data.email,
    role: data.role,
  };
  if (data.password) {
    update.passwordHash = await bcrypt.hash(data.password, 12);
  }

  const { error } = await supabaseAdmin.from(TABLES.user).update(update).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function eliminarUsuario(id: string) {
  const admin = await requireAdmin();
  if (admin.id === id) {
    throw new Error("NO_AUTOELIMINAR");
  }

  const { error } = await supabaseAdmin.from(TABLES.user).delete().eq("id", id);
  if (error) throw new Error(error.message);
}
