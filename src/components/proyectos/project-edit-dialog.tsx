"use client";

import { useActionState, useEffect } from "react";
import { Modal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label, Textarea } from "@/components/ui/field";
import { actualizarProyectoAction, type ProyectoFormState } from "@/app/(app)/proyectos/[id]/actions";

type ProjectEditDialogProps = {
  proyectoId: string;
  proyecto: {
    nombre: string;
    descripcion: string | null;
    faseActual: string | null;
    fechaCorte: string | null;
  };
  onClose: () => void;
};

export function ProjectEditDialog({ proyectoId, proyecto, onClose }: ProjectEditDialogProps) {
  const boundAction = actualizarProyectoAction.bind(null, proyectoId);
  const [state, action, pending] = useActionState<ProyectoFormState, FormData>(boundAction, undefined);

  useEffect(() => {
    if (state?.success) onClose();
  }, [state, onClose]);

  return (
    <Modal open onClose={onClose} title="Editar proyecto">
      <form action={action} className="space-y-4">
        <div>
          <Label htmlFor="edit-nombre">Nombre del proyecto</Label>
          <Input id="edit-nombre" name="nombre" required defaultValue={proyecto.nombre} />
          <FieldError>{state?.fieldErrors?.nombre}</FieldError>
        </div>

        <div>
          <Label htmlFor="edit-faseActual">Fase actual</Label>
          <Input id="edit-faseActual" name="faseActual" defaultValue={proyecto.faseActual ?? ""} />
          <FieldError>{state?.fieldErrors?.faseActual}</FieldError>
        </div>

        <div>
          <Label htmlFor="edit-fechaCorte">Fecha de corte</Label>
          <Input id="edit-fechaCorte" name="fechaCorte" type="date" defaultValue={proyecto.fechaCorte ?? ""} />
          <FieldError>{state?.fieldErrors?.fechaCorte}</FieldError>
        </div>

        <div>
          <Label htmlFor="edit-descripcion">Descripción</Label>
          <Textarea id="edit-descripcion" name="descripcion" defaultValue={proyecto.descripcion ?? ""} />
          <FieldError>{state?.fieldErrors?.descripcion}</FieldError>
        </div>

        {state?.error && (
          <p role="alert" className="rounded-md bg-danger-soft px-3 py-2 text-sm text-danger">
            {state.error}
          </p>
        )}

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" disabled={pending}>
            {pending ? "Guardando…" : "Guardar cambios"}
          </Button>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </form>
    </Modal>
  );
}
