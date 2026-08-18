"use client";

import { useActionState, useEffect } from "react";
import { Modal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label, Select } from "@/components/ui/field";
import { crearUsuarioAction, type UsuarioFormState } from "@/app/(app)/usuarios/actions";

export function UserFormDialog({ onClose }: { onClose: () => void }) {
  const [state, action, pending] = useActionState<UsuarioFormState, FormData>(
    crearUsuarioAction,
    undefined
  );

  useEffect(() => {
    if (state?.success) onClose();
  }, [state, onClose]);

  return (
    <Modal open onClose={onClose} title="Nuevo usuario" description="Crea una cuenta de acceso para tu equipo.">
      <form action={action} className="space-y-4">
        <div>
          <Label htmlFor="user-name">Nombre</Label>
          <Input id="user-name" name="name" required placeholder="Ej. Natalia Ochoa" />
          <FieldError>{state?.fieldErrors?.name}</FieldError>
        </div>

        <div>
          <Label htmlFor="user-email">Correo</Label>
          <Input id="user-email" name="email" type="email" required placeholder="natalia@empresa.com" />
          <FieldError>{state?.fieldErrors?.email}</FieldError>
        </div>

        <div>
          <Label htmlFor="user-password">Contraseña</Label>
          <Input id="user-password" name="password" type="password" required minLength={8} />
          <p className="mt-1 text-xs text-ink-faint">Mínimo 8 caracteres.</p>
          <FieldError>{state?.fieldErrors?.password}</FieldError>
        </div>

        <div>
          <Label htmlFor="user-role">Rol</Label>
          <Select id="user-role" name="role" defaultValue="LECTOR">
            <option value="LECTOR">Lector — solo puede ver</option>
            <option value="ADMIN">Administrador — puede crear y editar</option>
          </Select>
          <FieldError>{state?.fieldErrors?.role}</FieldError>
        </div>

        {state?.error && (
          <p role="alert" className="rounded-md bg-danger-soft px-3 py-2 text-sm text-danger">
            {state.error}
          </p>
        )}

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" disabled={pending}>
            {pending ? "Creando…" : "Crear usuario"}
          </Button>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </form>
    </Modal>
  );
}
