import "server-only";
import { randomUUID } from "node:crypto";
import { cache } from "react";
import { notFound } from "next/navigation";
import { supabaseAdmin, TABLES } from "@/lib/supabase";
import { requireSession } from "@/data/session";
import { ProyectoSchema, type ProyectoInput } from "@/lib/validations";
import { computeProyectoStats } from "@/lib/stats";
import { hydrateActividad, hydrateProyecto, type ActividadRow, type ProyectoRow } from "@/types/db";

function proyectoToInsert(data: ReturnType<typeof ProyectoSchema.parse>) {
  return {
    nombre: data.nombre,
    descripcion: data.descripcion || null,
    faseActual: data.faseActual || null,
    fechaCorte: data.fechaCorte ? new Date(data.fechaCorte).toISOString() : null,
  };
}

export const listProyectos = cache(async () => {
  await requireSession();

  const { data: proyectos, error } = await supabaseAdmin
    .from(TABLES.proyecto)
    .select("*")
    .order("createdAt", { ascending: false });
  if (error) throw new Error(error.message);

  const { data: actividades, error: actError } = await supabaseAdmin
    .from(TABLES.actividad)
    .select("proyectoId, estado, porcentaje");
  if (actError) throw new Error(actError.message);

  return (proyectos as ProyectoRow[]).map((row) => {
    const propias = (actividades as { proyectoId: string; estado: string; porcentaje: number }[]).filter(
      (a) => a.proyectoId === row.id
    );
    return {
      ...hydrateProyecto(row),
      stats: computeProyectoStats(propias as { estado: ActividadRow["estado"]; porcentaje: number }[]),
    };
  });
});

// cache() memoiza por request: generateMetadata y la page comparten esta misma
// consulta sin golpear la base de datos dos veces para la misma navegación.
export const getProyecto = cache(async (id: string) => {
  await requireSession();

  const { data: proyectoRow, error } = await supabaseAdmin
    .from(TABLES.proyecto)
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!proyectoRow) notFound();

  const [{ data: frentes, error: frentesError }, { data: actividades, error: actividadesError }] =
    await Promise.all([
      supabaseAdmin.from(TABLES.frente).select("*").eq("proyectoId", id).order("orden", { ascending: true }),
      supabaseAdmin
        .from(TABLES.actividad)
        .select("*")
        .eq("proyectoId", id)
        .order("numero", { ascending: true }),
    ]);
  if (frentesError) throw new Error(frentesError.message);
  if (actividadesError) throw new Error(actividadesError.message);

  const actividadesHidratadas = (actividades as ActividadRow[]).map(hydrateActividad);

  return {
    ...hydrateProyecto(proyectoRow as ProyectoRow),
    frentes: frentes ?? [],
    actividades: actividadesHidratadas,
    stats: computeProyectoStats(actividadesHidratadas),
  };
});

export async function crearProyecto(input: ProyectoInput) {
  await requireSession();

  const data = ProyectoSchema.parse(input);
  const now = new Date().toISOString();

  const { data: proyecto, error } = await supabaseAdmin
    .from(TABLES.proyecto)
    .insert({ id: randomUUID(), ...proyectoToInsert(data), createdAt: now, updatedAt: now })
    .select("*")
    .single();
  if (error) throw new Error(error.message);

  return proyecto as ProyectoRow;
}

export async function actualizarProyecto(id: string, input: ProyectoInput) {
  await requireSession();

  const data = ProyectoSchema.parse(input);

  const { error } = await supabaseAdmin
    .from(TABLES.proyecto)
    .update({ ...proyectoToInsert(data), updatedAt: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function eliminarProyecto(id: string) {
  await requireSession();
  const { error } = await supabaseAdmin.from(TABLES.proyecto).delete().eq("id", id);
  if (error) throw new Error(error.message);
}
