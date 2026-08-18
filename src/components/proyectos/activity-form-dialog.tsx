"use client";

import { useActionState, useEffect } from "react";
import { Modal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label, Select } from "@/components/ui/field";
import {
  actualizarActividadAction,
  crearActividadAction,
  type ActividadFormState,
} from "@/app/(app)/proyectos/[id]/actions";
import type { EstadoActividad } from "@/generated/prisma/enums";

export type ActividadTarget = {
  id: string;
  nombre: string;
  responsable: string;
  estado: EstadoActividad;
  porcentaje: number;
  fechaInicio: string;
  fechaFin: string;
  frenteId: string | null;
} | null;

type ActivityFormDialogProps = {
  proyectoId: string;
  frentes: { id: string; nombre: string }[];
  actividad: ActividadTarget;
  defaultFrenteId?: string;
  onClose: () => void;
};

export function ActivityFormDialog({
  proyectoId,
  frentes,
  actividad,
  defaultFrenteId,
  onClose,
}: ActivityFormDialogProps) {
  const boundAction = actividad
    ? actualizarActividadAction.bind(null, proyectoId, actividad.id)
    : crearActividadAction.bind(null, proyectoId);

  const [state, action, pending] = useActionState<ActividadFormState, FormData>(
    boundAction,
    undefined
  );

  useEffect(() => {
    if (state?.success) onClose();
  }, [state, onClose]);

  return (
    <Modal
      open
      onClose={onClose}
      title={actividad ? "Editar actividad" : "Nueva actividad"}
      description={actividad ? actividad.nombre : "Agrega una actividad a este proyecto."}
    >
      <form action={action} className="space-y-4">
        <div>
          <Label htmlFor="nombre">Actividad</Label>
          <Input
            id="nombre"
            name="nombre"
            required
            defaultValue={actividad?.nombre}
            placeholder="Ej. Producción de piezas gráficas"
          />
          <FieldError>{state?.fieldErrors?.nombre}</FieldError>
        </div>

        <div>
          <Label htmlFor="responsable">Responsable</Label>
          <Input
            id="responsable"
            name="responsable"
            required
            defaultValue={actividad?.responsable}
            placeholder="Ej. Natalia Ochoa - CM"
          />
          <FieldError>{state?.fieldErrors?.responsable}</FieldError>
        </div>

        <div>
          <Label htmlFor="frenteId">Frente</Label>
          <Select id="frenteId" name="frenteId" defaultValue={actividad?.frenteId ?? defaultFrenteId ?? ""}>
            <option value="">Sin frente</option>
            {frentes.map((frente) => (
              <option key={frente.id} value={frente.id}>
                {frente.nombre}
              </option>
            ))}
          </Select>
          <FieldError>{state?.fieldErrors?.frenteId}</FieldError>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fechaInicio">Inicio</Label>
            <Input
              id="fechaInicio"
              name="fechaInicio"
              type="date"
              required
              defaultValue={actividad?.fechaInicio}
            />
            <FieldError>{state?.fieldErrors?.fechaInicio}</FieldError>
          </div>
          <div>
            <Label htmlFor="fechaFin">Fin</Label>
            <Input id="fechaFin" name="fechaFin" type="date" required defaultValue={actividad?.fechaFin} />
            <FieldError>{state?.fieldErrors?.fechaFin}</FieldError>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="estado">Estado</Label>
            <Select id="estado" name="estado" defaultValue={actividad?.estado ?? "PENDIENTE"}>
              <option value="PENDIENTE">Pendiente</option>
              <option value="EN_CURSO">En curso</option>
              <option value="CERRADA">Cerrada</option>
            </Select>
            <FieldError>{state?.fieldErrors?.estado}</FieldError>
          </div>
          <div>
            <Label htmlFor="porcentaje">% Avance</Label>
            <Input
              id="porcentaje"
              name="porcentaje"
              type="number"
              min={0}
              max={100}
              required
              defaultValue={actividad?.porcentaje ?? 0}
            />
            <FieldError>{state?.fieldErrors?.porcentaje}</FieldError>
          </div>
        </div>

        {state?.error && (
          <p role="alert" className="rounded-md bg-danger-soft px-3 py-2 text-sm text-danger">
            {state.error}
          </p>
        )}

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" disabled={pending}>
            {pending ? "Guardando…" : actividad ? "Guardar cambios" : "Crear actividad"}
          </Button>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </form>
    </Modal>
  );
}
