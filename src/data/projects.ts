import "server-only";
import { cache } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/data/session";
import { ProyectoSchema, type ProyectoInput } from "@/lib/validations";
import { computeProyectoStats } from "@/lib/stats";

export const listProyectos = cache(async () => {
  await requireSession();

  const proyectos = await prisma.proyecto.findMany({
    orderBy: { createdAt: "desc" },
    include: { actividades: { select: { estado: true, porcentaje: true } } },
  });

  return proyectos.map(({ actividades, ...proyecto }) => ({
    ...proyecto,
    stats: computeProyectoStats(actividades),
  }));
});

// cache() memoiza por request: generateMetadata y la page comparten esta misma
// consulta sin golpear la base de datos dos veces para la misma navegación.
export const getProyecto = cache(async (id: string) => {
  await requireSession();

  const proyecto = await prisma.proyecto.findUnique({
    where: { id },
    include: {
      frentes: { orderBy: { orden: "asc" } },
      actividades: { orderBy: { numero: "asc" } },
    },
  });

  if (!proyecto) notFound();

  return { ...proyecto, stats: computeProyectoStats(proyecto.actividades) };
});

export async function crearProyecto(input: ProyectoInput) {
  await requireSession();

  const data = ProyectoSchema.parse(input);

  const proyecto = await prisma.proyecto.create({
    data: {
      nombre: data.nombre,
      descripcion: data.descripcion || null,
      faseActual: data.faseActual || null,
      fechaCorte: data.fechaCorte ? new Date(data.fechaCorte) : null,
    },
  });

  return proyecto;
}

export async function actualizarProyecto(id: string, input: ProyectoInput) {
  await requireSession();

  const data = ProyectoSchema.parse(input);

  await prisma.proyecto.update({
    where: { id },
    data: {
      nombre: data.nombre,
      descripcion: data.descripcion || null,
      faseActual: data.faseActual || null,
      fechaCorte: data.fechaCorte ? new Date(data.fechaCorte) : null,
    },
  });
}

export async function eliminarProyecto(id: string) {
  await requireSession();
  await prisma.proyecto.delete({ where: { id } });
}
