import { addDays, differenceInCalendarDays, endOfWeek, format, isWithinInterval, startOfWeek } from "date-fns";
import { es } from "date-fns/locale";
import type { EstadoActividad } from "@/generated/prisma/enums";

export const PX_PER_DAY = 26;
export const ROW_HEIGHT = 44;

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

export function computeRange(
  actividades: GanttActividad[],
  fechaCorte: Date | null
): { start: Date; end: Date } {
  const dates = actividades.flatMap((a) => [a.fechaInicio, a.fechaFin]);
  if (fechaCorte) dates.push(fechaCorte);
  if (dates.length === 0) {
    const today = new Date();
    return { start: startOfWeek(today, { weekStartsOn: 1 }), end: endOfWeek(addDays(today, 30), { weekStartsOn: 1 }) };
  }

  const min = new Date(Math.min(...dates.map((d) => d.getTime())));
  const max = new Date(Math.max(...dates.map((d) => d.getTime())));

  return {
    start: startOfWeek(min, { weekStartsOn: 1 }),
    end: endOfWeek(max, { weekStartsOn: 1 }),
  };
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
      label: format(monthStart, "MMMM yyyy", { locale: es }),
      offsetDays: dayOffset(monthStart, range.start),
      widthDays: differenceInCalendarDays(segmentEnd, monthStart) + 1,
    });

    cursor = nextMonth;
  }

  return ticks;
}

export function buildWeekLines(range: { start: Date; end: Date }): number[] {
  const lines: number[] = [];
  const days = totalDays(range);

  for (let i = 0; i <= days; i += 7) {
    lines.push(i);
  }

  return lines;
}

export function isTodayWithinRange(range: { start: Date; end: Date }, today: Date): boolean {
  return isWithinInterval(today, { start: range.start, end: range.end });
}

const ESTADO_BAR_CLASS: Record<EstadoActividad, string> = {
  CERRADA: "bg-moss",
  EN_CURSO: "bg-ochre",
  PENDIENTE: "bg-stone",
};

export function barColorClass(estado: EstadoActividad): string {
  return ESTADO_BAR_CLASS[estado];
}
