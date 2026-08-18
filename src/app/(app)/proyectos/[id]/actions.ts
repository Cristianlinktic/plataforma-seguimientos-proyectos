"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as z from "zod";
import {
  actualizarActividad,
  actualizarEstadoActividad,
  crearActividad,
  crearFrente,
  eliminarActividad,
} from "@/data/tasks";
import { actualizarProyecto, eliminarProyecto } from "@/data/projects";
import { ActividadSchema, FrenteSchema, ProyectoSchema } from "@/lib/validations";
import type { EstadoActividad } from "@/types/db";

export type ActividadFormState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
} | undefined;

export async function crearActividadAction(
  proyectoId: string,
  _prevState: ActividadFormState,
  formData: FormData
): Promise<ActividadFormState> {
  const parsed = ActividadSchema.safeParse({
    nombre: formData.get("nombre"),
    responsable: formData.get("responsable"),
    estado: formData.get("estado"),
    porcentaje: formData.get("porcentaje"),
    fechaInicio: formData.get("fechaInicio"),
    fechaFin: formData.get("fechaFin"),
    frenteId: formData.get("frenteId"),
  });

  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  try {
    await crearActividad(proyectoId, parsed.data);
  } catch {
    return { error: "No se pudo crear la actividad." };
  }

  revalidatePath(`/proyectos/${proyectoId}`);
  return { success: true };
}

export async function actualizarActividadAction(
  proyectoId: string,
  actividadId: string,
  _prevState: ActividadFormState,
  formData: FormData
): Promise<ActividadFormState> {
  const parsed = ActividadSchema.safeParse({
    nombre: formData.get("nombre"),
    responsable: formData.get("responsable"),
    estado: formData.get("estado"),
    porcentaje: formData.get("porcentaje"),
    fechaInicio: formData.get("fechaInicio"),
    fechaFin: formData.get("fechaFin"),
    frenteId: formData.get("frenteId"),
  });

  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  try {
    await actualizarActividad(proyectoId, actividadId, parsed.data);
  } catch {
    return { error: "No se pudo actualizar la actividad." };
  }

  revalidatePath(`/proyectos/${proyectoId}`);
  return { success: true };
}

export async function actualizarEstadoActividadAction(
  proyectoId: string,
  actividadId: string,
  estado: EstadoActividad
) {
  await actualizarEstadoActividad(proyectoId, actividadId, estado);
  revalidatePath(`/proyectos/${proyectoId}`);
}

export async function eliminarActividadAction(proyectoId: string, actividadId: string) {
  await eliminarActividad(proyectoId, actividadId);
  revalidatePath(`/proyectos/${proyectoId}`);
}

export type FrenteFormState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
} | undefined;

export async function crearFrenteAction(
  proyectoId: string,
  _prevState: FrenteFormState,
  formData: FormData
): Promise<FrenteFormState> {
  const parsed = FrenteSchema.safeParse({ nombre: formData.get("nombre") });

  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  try {
    await crearFrente(proyectoId, parsed.data);
  } catch {
    return { error: "No se pudo crear el frente." };
  }

  revalidatePath(`/proyectos/${proyectoId}`);
  return { success: true };
}

export type ProyectoFormState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
} | undefined;

export async function actualizarProyectoAction(
  proyectoId: string,
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

  try {
    await actualizarProyecto(proyectoId, parsed.data);
  } catch {
    return { error: "No se pudo actualizar el proyecto." };
  }

  revalidatePath(`/proyectos/${proyectoId}`);
  revalidatePath("/proyectos");
  return { success: true };
}

export async function eliminarProyectoAction(proyectoId: string) {
  await eliminarProyecto(proyectoId);
  revalidatePath("/proyectos");
  redirect("/proyectos");
}
