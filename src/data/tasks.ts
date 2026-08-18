import "server-only";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/data/session";
import {
  ActividadSchema,
  FrenteSchema,
  type ActividadInput,
  type FrenteInput,
} from "@/lib/validations";
import type { EstadoActividad } from "@/generated/prisma/enums";

async function assertActividadEnProyecto(actividadId: string, proyectoId: string) {
  const actividad = await prisma.actividad.findUnique({
    where: { id: actividadId },
    select: { proyectoId: true },
  });

  if (!actividad || actividad.proyectoId !== proyectoId) {
    throw new Error("La actividad no pertenece a este proyecto.");
  }
}

export async function crearFrente(proyectoId: string, input: FrenteInput) {
  await requireSession();
  const data = FrenteSchema.parse(input);

  const count = await prisma.frente.count({ where: { proyectoId } });

  return prisma.frente.create({
    data: { nombre: data.nombre, proyectoId, orden: count },
  });
}

export async function crearActividad(proyectoId: string, input: ActividadInput) {
  await requireSession();
  const data = ActividadSchema.parse(input);

  if (data.frenteId) {
    await assertFrenteEnProyecto(data.frenteId, proyectoId);
  }

  const ultima = await prisma.actividad.findFirst({
    where: { proyectoId },
    orderBy: { numero: "desc" },
    select: { numero: true },
  });

  return prisma.actividad.create({
    data: {
      numero: (ultima?.numero ?? 0) + 1,
      nombre: data.nombre,
      responsable: data.responsable,
      estado: data.estado,
      porcentaje: data.porcentaje,
      fechaInicio: new Date(data.fechaInicio),
      fechaFin: new Date(data.fechaFin),
      proyectoId,
      frenteId: data.frenteId || null,
    },
  });
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

  return prisma.actividad.update({
    where: { id: actividadId },
    data: {
      nombre: data.nombre,
      responsable: data.responsable,
      estado: data.estado,
      porcentaje: data.porcentaje,
      fechaInicio: new Date(data.fechaInicio),
      fechaFin: new Date(data.fechaFin),
      frenteId: data.frenteId || null,
    },
  });
}

export async function actualizarEstadoActividad(
  proyectoId: string,
  actividadId: string,
  estado: EstadoActividad
) {
  await requireSession();
  await assertActividadEnProyecto(actividadId, proyectoId);

  return prisma.actividad.update({
    where: { id: actividadId },
    data: {
      estado,
      ...(estado === "CERRADA" ? { porcentaje: 100 } : {}),
    },
  });
}

export async function eliminarActividad(proyectoId: string, actividadId: string) {
  await requireSession();
  await assertActividadEnProyecto(actividadId, proyectoId);
  await prisma.actividad.delete({ where: { id: actividadId } });
}

async function assertFrenteEnProyecto(frenteId: string, proyectoId: string) {
  const frente = await prisma.frente.findUnique({
    where: { id: frenteId },
    select: { proyectoId: true },
  });

  if (!frente || frente.proyectoId !== proyectoId) {
    throw new Error("El frente no pertenece a este proyecto.");
  }
}
