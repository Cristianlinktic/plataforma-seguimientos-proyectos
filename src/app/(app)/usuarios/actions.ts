"use server";

import { revalidatePath } from "next/cache";
import * as z from "zod";
import { actualizarUsuario, crearUsuario, eliminarUsuario } from "@/data/users";
import { UsuarioEditSchema, UsuarioSchema } from "@/lib/validations";

export type UsuarioFormState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
} | undefined;

export async function crearUsuarioAction(
  _prevState: UsuarioFormState,
  formData: FormData
): Promise<UsuarioFormState> {
  const parsed = UsuarioSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  try {
    await crearUsuario(parsed.data);
  } catch (error) {
    if (error instanceof Error && error.message === "EMAIL_EN_USO") {
      return { fieldErrors: { email: ["Ya existe un usuario con ese correo."] } };
    }
    if (error instanceof Error && error.message.includes("administrador")) {
      return { error: error.message };
    }
    return { error: "No se pudo crear el usuario." };
  }

  revalidatePath("/usuarios");
  return { success: true };
}

export async function actualizarUsuarioAction(
  userId: string,
  _prevState: UsuarioFormState,
  formData: FormData
): Promise<UsuarioFormState> {
  const parsed = UsuarioEditSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password") ?? "",
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  try {
    await actualizarUsuario(userId, parsed.data);
  } catch (error) {
    if (error instanceof Error && error.message === "EMAIL_EN_USO") {
      return { fieldErrors: { email: ["Ya existe un usuario con ese correo."] } };
    }
    if (error instanceof Error && error.message === "NO_AUTODEGRADAR") {
      return { error: "No puedes quitarte a ti mismo el rol de administrador." };
    }
    if (error instanceof Error && error.message.includes("administrador")) {
      return { error: error.message };
    }
    return { error: "No se pudo actualizar el usuario." };
  }

  revalidatePath("/usuarios");
  return { success: true };
}

export async function eliminarUsuarioAction(userId: string) {
  try {
    await eliminarUsuario(userId);
  } catch (error) {
    if (error instanceof Error && error.message === "NO_AUTOELIMINAR") {
      throw new Error("No puedes eliminar tu propio usuario.");
    }
    throw error;
  }
  revalidatePath("/usuarios");
}
