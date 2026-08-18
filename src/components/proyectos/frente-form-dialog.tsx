"use client";

import { useActionState, useEffect } from "react";
import { Modal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label } from "@/components/ui/field";
import { crearFrenteAction, type FrenteFormState } from "@/app/(app)/proyectos/[id]/actions";

export function FrenteFormDialog({ proyectoId, onClose }: { proyectoId: string; onClose: () => void }) {
  const boundAction = crearFrenteAction.bind(null, proyectoId);
  const [state, action, pending] = useActionState<FrenteFormState, FormData>(boundAction, undefined);

  useEffect(() => {
    if (state?.success) onClose();
  }, [state, onClose]);

  return (
    <Modal open onClose={onClose} title="Nuevo frente" description="Agrupa actividades relacionadas.">
      <form action={action} className="space-y-4">
        <div>
          <Label htmlFor="frente-nombre">Nombre del frente</Label>
          <Input id="frente-nombre" name="nombre" required placeholder="Ej. Producto" />
          <FieldError>{state?.fieldErrors?.nombre}</FieldError>
        </div>

        {state?.error && (
          <p role="alert" className="rounded-md bg-danger-soft px-3 py-2 text-sm text-danger">
            {state.error}
          </p>
        )}

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" disabled={pending}>
            {pending ? "Creando…" : "Crear frente"}
          </Button>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </form>
    </Modal>
  );
}
