import { addDays, differenceInCalendarDays, format } from "date-fns";
import { es } from "date-fns/locale";
import type { EstadoActividad } from "@/types/db";

export const ROW_HEIGHT = 56;

export type GanttActividad = {
  id: string;
  numero: number;
  nombre: string;
  responsable: string;
  estado: EstadoActividad;
  porcentaje: number;
  fechaInicio: Date;
  fechaFin: Date;
  frenteId: string | null;
};

export type GanttFrente = {
  id: string;
  nombre: string;
};

export type GanttRow =
  | { kind: "group"; key: string; frente: GanttFrente; count: number }
  | { kind: "task"; key: string; actividad: GanttActividad };

// El rango es exactamente [fecha mínima, fecha máxima] de las actividades
// (más la fecha de corte si aplica) — sin redondear a semanas completas, para
// que los meses mostrados correspondan 1:1 con las fechas reales y no aparezcan
// meses "fantasma" sin ninguna actividad.
export function computeRange(
  actividades: GanttActividad[],
  fechaCorte: Date | null
): { start: Date; end: Date } {
  const dates = actividades.flatMap((a) => [a.fechaInicio, a.fechaFin]);
  if (fechaCorte) dates.push(fechaCorte);
  if (dates.length === 0) {
    const today = new Date();
    return { start: today, end: addDays(today, 30) };
  }

  const min = new Date(Math.min(...dates.map((d) => d.getTime())));
  const max = new Date(Math.max(...dates.map((d) => d.getTime())));

  return { start: min, end: max };
}

export function buildRows(
  frentes: GanttFrente[],
  actividadesPorFrente: Map<string, GanttActividad[]>,
  sinFrente: GanttActividad[]
): GanttRow[] {
  const rows: GanttRow[] = [];

  for (const frente of frentes) {
    const actividades = actividadesPorFrente.get(frente.id) ?? [];
    rows.push({ kind: "group", key: `g-${frente.id}`, frente, count: actividades.length });
    for (const actividad of actividades) {
      rows.push({ kind: "task", key: actividad.id, actividad });
    }
  }

  if (sinFrente.length > 0) {
    rows.push({
      kind: "group",
      key: "g-sin-frente",
      frente: { id: "sin-frente", nombre: "Sin frente" },
      count: sinFrente.length,
    });
    for (const actividad of sinFrente) {
      rows.push({ kind: "task", key: actividad.id, actividad });
    }
  }

  return rows;
}

export function dayOffset(date: Date, rangeStart: Date): number {
  return differenceInCalendarDays(date, rangeStart);
}

export function totalDays(range: { start: Date; end: Date }): number {
  return differenceInCalendarDays(range.end, range.start) + 1;
}

export type MonthTick = { label: string; offsetDays: number; widthDays: number };

export function buildMonthTicks(range: { start: Date; end: Date }): MonthTick[] {
  const ticks: MonthTick[] = [];
  let cursor = new Date(range.start);

  while (cursor <= range.end) {
    const monthStart = cursor;
    const nextMonth = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 1);
    const segmentEnd = nextMonth < range.end ? addDays(nextMonth, -1) : range.end;

    ticks.push({
      label: format(monthStart, "MMMM", { locale: es }),
      offsetDays: dayOffset(monthStart, range.start),
      widthDays: differenceInCalendarDays(segmentEnd, monthStart) + 1,
    });

    cursor = nextMonth;
  }

  return ticks;
}

export type DateTick = { offsetDays: number; dayLabel: string; date: Date };

/**
 * Marcas de fecha bajo la banda de meses. La densidad se adapta a qué tan
 * largo es el rango total: rangos cortos muestran cada semana, rangos muy
 * largos saltan a cada dos semanas para no amontonar los números de día.
 */
export function buildDateTicks(range: { start: Date; end: Date }): DateTick[] {
  const days = totalDays(range);
  const stepDays = days > 210 ? 14 : 7;
  const ticks: DateTick[] = [];

  for (let offset = 0; offset <= days; offset += stepDays) {
    const date = addDays(range.start, offset);
    ticks.push({ offsetDays: offset, dayLabel: format(date, "d"), date });
  }

  return ticks;
}

export type EstadoChipStyle = {
  bg: string;
  border: string;
  text: string;
  dot: string;
  fill: string;
};

const ESTADO_CHIP_STYLE: Record<EstadoActividad, EstadoChipStyle> = {
  CERRADA: { bg: "bg-moss-soft", border: "border-moss/40", text: "text-moss", dot: "bg-moss", fill: "bg-moss" },
  EN_CURSO: { bg: "bg-ochre-soft", border: "border-ochre/40", text: "text-ochre", dot: "bg-ochre", fill: "bg-ochre" },
  PENDIENTE: { bg: "bg-stone-soft", border: "border-stone/40", text: "text-stone", dot: "bg-stone", fill: "bg-stone" },
};

export function estadoChipStyle(estado: EstadoActividad): EstadoChipStyle {
  return ESTADO_CHIP_STYLE[estado];
}
