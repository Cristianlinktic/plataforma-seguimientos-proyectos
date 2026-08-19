"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { UserFormDialog, type UsuarioTarget } from "@/components/usuarios/user-form-dialog";
import { eliminarUsuarioAction } from "@/app/(app)/usuarios/actions";

export function UserRowActions({ usuario, canDelete }: { usuario: NonNullable<UsuarioTarget>; canDelete: boolean }) {
  const [dialog, setDialog] = useState<"edit" | "delete" | null>(null);

  return (
    <div className="flex items-center justify-end gap-1">
      <button
        type="button"
        aria-label={`Editar ${usuario.name}`}
        onClick={() => setDialog("edit")}
        className="rounded-md p-1.5 text-ink-faint transition-colors hover:bg-indigo-soft hover:text-indigo"
      >
        <Pencil className="h-3.5 w-3.5" />
      </button>
      {canDelete && (
        <button
          type="button"
          aria-label={`Eliminar ${usuario.name}`}
          onClick={() => setDialog("delete")}
          className="rounded-md p-1.5 text-ink-faint transition-colors hover:bg-danger-soft hover:text-danger"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}

      {dialog === "edit" && <UserFormDialog usuario={usuario} onClose={() => setDialog(null)} />}

      {dialog === "delete" && (
        <ConfirmDialog
          title="Eliminar usuario"
          description={`¿Seguro que quieres eliminar a "${usuario.name}"? Esta acción no se puede deshacer.`}
          onClose={() => setDialog(null)}
          onConfirm={async () => {
            await eliminarUsuarioAction(usuario.id);
            setDialog(null);
          }}
        />
      )}
    </div>
  );
}
