"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { loginAction, type LoginState } from "./actions";

export function LoginForm({ redirectTo }: { redirectTo: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, undefined);

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="redirectTo" value={redirectTo} />

      <div>
        <Label htmlFor="email">Correo</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required placeholder="tu@empresa.com" />
      </div>

      <div>
        <Label htmlFor="password">Contraseña</Label>
        <PasswordInput id="password" name="password" autoComplete="current-password" required />
      </div>

      {state?.error && (
        <p role="alert" className="rounded-md bg-danger-soft px-3 py-2 text-sm text-danger">
          {state.error}
        </p>
      )}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Ingresando…" : "Ingresar"}
      </Button>
    </form>
  );
}
