import type { EstadoActividad } from "@/types/db";

export type ActividadStats = {
  estado: EstadoActividad;
  porcentaje: number;
};

export type ProyectoStats = {
  total: number;
  cerradas: number;
  enCurso: number;
  pendientes: number;
  avance: number;
};

export function computeProyectoStats(actividades: ActividadStats[]): ProyectoStats {
  const total = actividades.length;
  const cerradas = actividades.filter((a) => a.estado === "CERRADA").length;
  const enCurso = actividades.filter((a) => a.estado === "EN_CURSO").length;
  const pendientes = actividades.filter((a) => a.estado === "PENDIENTE").length;
  const avance =
    total === 0 ? 0 : Math.round(actividades.reduce((sum, a) => sum + a.porcentaje, 0) / total);

  return { total, cerradas, enCurso, pendientes, avance };
}
