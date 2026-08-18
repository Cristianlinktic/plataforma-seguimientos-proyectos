"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label, Textarea } from "@/components/ui/field";
import { crearProyectoAction, type ProyectoFormState } from "../actions";

export function ProjectForm() {
  const [state, action, pending] = useActionState<ProyectoFormState, FormData>(
    crearProyectoAction,
    undefined
  );

  return (
    <form action={action} className="space-y-5">
      <div>
        <Label htmlFor="nombre">Nombre del proyecto</Label>
        <Input id="nombre" name="nombre" required placeholder="Ej. Lanzamiento colección 2027" />
        <FieldError>{state?.fieldErrors?.nombre}</FieldError>
      </div>

      <div>
        <Label htmlFor="faseActual">Fase actual</Label>
        <Input id="faseActual" name="faseActual" placeholder="Ej. Creación, expectativa y lanzamiento de marca" />
        <FieldError>{state?.fieldErrors?.faseActual}</FieldError>
      </div>

      <div>
        <Label htmlFor="fechaCorte">Fecha de corte</Label>
        <Input id="fechaCorte" name="fechaCorte" type="date" />
        <FieldError>{state?.fieldErrors?.fechaCorte}</FieldError>
      </div>

      <div>
        <Label htmlFor="descripcion">Descripción (opcional)</Label>
        <Textarea id="descripcion" name="descripcion" placeholder="Contexto breve del proyecto" />
        <FieldError>{state?.fieldErrors?.descripcion}</FieldError>
      </div>

      {state?.error && (
        <p role="alert" className="rounded-md bg-danger-soft px-3 py-2 text-sm text-danger">
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Creando…" : "Crear proyecto"}
        </Button>
        <Link href="/proyectos" className="text-sm font-medium text-ink-soft hover:text-ink">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
