"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { LoginSchema } from "@/lib/validations";

export type LoginState = {
  error?: string;
} | undefined;

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Ingresa un correo y una contraseña válidos." };
  }

  const redirectTo = (formData.get("redirectTo") as string) || "/proyectos";

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Correo o contraseña incorrectos." };
    }
    throw error;
  }
}
