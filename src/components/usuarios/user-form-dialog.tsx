"use client";

import { useActionState, useEffect } from "react";
import { Modal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label, Select } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import {
  actualizarUsuarioAction,
  crearUsuarioAction,
  type UsuarioFormState,
} from "@/app/(app)/usuarios/actions";
import type { RolUsuario } from "@/types/db";

export type UsuarioTarget = { id: string; name: string; email: string; role: RolUsuario } | null;

export function UserFormDialog({
  usuario = null,
  onClose,
}: {
  usuario?: UsuarioTarget;
  onClose: () => void;
}) {
  const boundAction = usuario ? actualizarUsuarioAction.bind(null, usuario.id) : crearUsuarioAction;

  const [state, action, pending] = useActionState<UsuarioFormState, FormData>(boundAction, undefined);

  useEffect(() => {
    if (state?.success) onClose();
  }, [state, onClose]);

  return (
    <Modal
      open
      onClose={onClose}
      title={usuario ? "Editar usuario" : "Nuevo usuario"}
      description={usuario ? usuario.email : "Crea una cuenta de acceso para tu equipo."}
    >
      <form action={action} className="space-y-4">
        <div>
          <Label htmlFor="user-name">Nombre</Label>
          <Input id="user-name" name="name" required defaultValue={usuario?.name} placeholder="Ej. Natalia Ochoa" />
          <FieldError>{state?.fieldErrors?.name}</FieldError>
        </div>

        <div>
          <Label htmlFor="user-email">Correo</Label>
          <Input
            id="user-email"
            name="email"
            type="email"
            required
            defaultValue={usuario?.email}
            placeholder="natalia@empresa.com"
          />
          <FieldError>{state?.fieldErrors?.email}</FieldError>
        </div>

        <div>
          <Label htmlFor="user-password">Contraseña{usuario && " (opcional)"}</Label>
          <PasswordInput id="user-password" name="password" required={!usuario} minLength={8} />
          <p className="mt-1 text-xs text-ink-faint">
            {usuario ? "Déjala en blanco para mantener la actual." : "Mínimo 8 caracteres."}
          </p>
          <FieldError>{state?.fieldErrors?.password}</FieldError>
        </div>

        <div>
          <Label htmlFor="user-role">Rol</Label>
          <Select id="user-role" name="role" defaultValue={usuario?.role ?? "LECTOR"}>
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
            {pending ? "Guardando…" : usuario ? "Guardar cambios" : "Crear usuario"}
          </Button>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </form>
    </Modal>
  );
}
