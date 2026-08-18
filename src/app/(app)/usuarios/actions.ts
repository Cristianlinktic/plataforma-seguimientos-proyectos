"use server";

import { revalidatePath } from "next/cache";
import * as z from "zod";
import { crearUsuario } from "@/data/users";
import { UsuarioSchema } from "@/lib/validations";

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
    return { error: "No se pudo crear el usuario." };
  }

  revalidatePath("/usuarios");
  return { success: true };
}
