import "server-only";
import { randomUUID } from "node:crypto";
import { supabaseAdmin, TABLES } from "@/lib/supabase";
import { requireSession } from "@/data/session";
import {
  ActividadSchema,
  FrenteSchema,
  type ActividadInput,
  type FrenteInput,
} from "@/lib/validations";
import type { EstadoActividad } from "@/types/db";

async function assertActividadEnProyecto(actividadId: string, proyectoId: string) {
  const { data, error } = await supabaseAdmin
    .from(TABLES.actividad)
    .select("proyectoId")
    .eq("id", actividadId)
    .maybeSingle();
  if (error) throw new Error(error.message);

  if (!data || data.proyectoId !== proyectoId) {
    throw new Error("La actividad no pertenece a este proyecto.");
  }
}

async function assertFrenteEnProyecto(frenteId: string, proyectoId: string) {
  const { data, error } = await supabaseAdmin
    .from(TABLES.frente)
    .select("proyectoId")
    .eq("id", frenteId)
    .maybeSingle();
  if (error) throw new Error(error.message);

  if (!data || data.proyectoId !== proyectoId) {
    throw new Error("El frente no pertenece a este proyecto.");
  }
}

export async function crearFrente(proyectoId: string, input: FrenteInput) {
  await requireSession();
  const data = FrenteSchema.parse(input);

  const { count, error: countError } = await supabaseAdmin
    .from(TABLES.frente)
    .select("*", { count: "exact", head: true })
    .eq("proyectoId", proyectoId);
  if (countError) throw new Error(countError.message);

  const { data: frente, error } = await supabaseAdmin
    .from(TABLES.frente)
    .insert({ id: randomUUID(), nombre: data.nombre, proyectoId, orden: count ?? 0 })
    .select("*")
    .single();
  if (error) throw new Error(error.message);

  return frente;
}

function actividadToRow(data: ReturnType<typeof ActividadSchema.parse>) {
  return {
    nombre: data.nombre,
    responsable: data.responsable,
    estado: data.estado,
    porcentaje: data.porcentaje,
    fechaInicio: new Date(data.fechaInicio).toISOString(),
    fechaFin: new Date(data.fechaFin).toISOString(),
    frenteId: data.frenteId || null,
  };
}

export async function crearActividad(proyectoId: string, input: ActividadInput) {
  await requireSession();
  const data = ActividadSchema.parse(input);

  if (data.frenteId) {
    await assertFrenteEnProyecto(data.frenteId, proyectoId);
  }

  const { data: ultima, error: ultimaError } = await supabaseAdmin
    .from(TABLES.actividad)
    .select("numero")
    .eq("proyectoId", proyectoId)
    .order("numero", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (ultimaError) throw new Error(ultimaError.message);

  const now = new Date().toISOString();

  const { data: actividad, error } = await supabaseAdmin
    .from(TABLES.actividad)
    .insert({
      id: randomUUID(),
      numero: (ultima?.numero ?? 0) + 1,
      ...actividadToRow(data),
      proyectoId,
      createdAt: now,
      updatedAt: now,
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);

  return actividad;
}

export async function actualizarActividad(
  proyectoId: string,
  actividadId: string,
  input: ActividadInput
) {
  await requireSession();
  const data = ActividadSchema.parse(input);
  await assertActividadEnProyecto(actividadId, proyectoId);

  if (data.frenteId) {
    await assertFrenteEnProyecto(data.frenteId, proyectoId);
  }

  const { data: actividad, error } = await supabaseAdmin
    .from(TABLES.actividad)
    .update({ ...actividadToRow(data), updatedAt: new Date().toISOString() })
    .eq("id", actividadId)
    .select("*")
    .single();
  if (error) throw new Error(error.message);

  return actividad;
}

export async function actualizarEstadoActividad(
  proyectoId: string,
  actividadId: string,
  estado: EstadoActividad
) {
  await requireSession();
  await assertActividadEnProyecto(actividadId, proyectoId);

  const { data: actividad, error } = await supabaseAdmin
    .from(TABLES.actividad)
    .update({
      estado,
      ...(estado === "CERRADA" ? { porcentaje: 100 } : {}),
      updatedAt: new Date().toISOString(),
    })
    .eq("id", actividadId)
    .select("*")
    .single();
  if (error) throw new Error(error.message);

  return actividad;
}

export async function eliminarActividad(proyectoId: string, actividadId: string) {
  await requireSession();
  await assertActividadEnProyecto(actividadId, proyectoId);

  const { error } = await supabaseAdmin.from(TABLES.actividad).delete().eq("id", actividadId);
  if (error) throw new Error(error.message);
}
