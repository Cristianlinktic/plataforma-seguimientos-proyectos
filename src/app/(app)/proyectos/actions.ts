"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import * as z from "zod";
import { crearProyecto, eliminarProyecto } from "@/data/projects";
import { ProyectoSchema } from "@/lib/validations";

export type ProyectoFormState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
} | undefined;

export async function crearProyectoAction(
  _prevState: ProyectoFormState,
  formData: FormData
): Promise<ProyectoFormState> {
  const parsed = ProyectoSchema.safeParse({
    nombre: formData.get("nombre"),
    descripcion: formData.get("descripcion"),
    faseActual: formData.get("faseActual"),
    fechaCorte: formData.get("fechaCorte"),
  });

  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  let proyectoId: string;
  try {
    const proyecto = await crearProyecto(parsed.data);
    proyectoId = proyecto.id;
  } catch {
    return { error: "No se pudo crear el proyecto. Intenta de nuevo." };
  }

  revalidatePath("/proyectos");
  redirect(`/proyectos/${proyectoId}`);
}

export async function eliminarProyectoAction(proyectoId: string) {
  await eliminarProyecto(proyectoId);
  revalidatePath("/proyectos");
  redirect("/proyectos");
}
