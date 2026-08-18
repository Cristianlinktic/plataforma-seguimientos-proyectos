import { format } from "date-fns";
import { es } from "date-fns/locale";
import { todayDateOnly } from "@/lib/dates";
import {
  PX_PER_DAY,
  ROW_HEIGHT,
  barColorClass,
  buildMonthTicks,
  buildRows,
  buildWeekLines,
  computeRange,
  dayOffset,
  totalDays,
  type GanttActividad,
  type GanttFrente,
} from "./gantt-utils";

type GanttChartProps = {
  frentes: GanttFrente[];
  // fechaInicio/fechaFin/fechaCorte deben venir ya normalizadas con dateOnly()
  // (ver src/lib/dates.ts) antes de llegar aquí.
  actividades: GanttActividad[];
  fechaCorte: Date | null;
};

const ESTADO_LABEL: Record<GanttActividad["estado"], string> = {
  PENDIENTE: "Pendiente",
  EN_CURSO: "En curso",
  CERRADA: "Cerrada",
};

export function GanttChart({ frentes, actividades, fechaCorte }: GanttChartProps) {
  if (actividades.length === 0) {
    return (
      <div className="rounded-lg border border-line bg-surface p-10 text-center text-sm text-ink-soft">
        Todavía no hay actividades para dibujar el Gantt. Agrega la primera actividad para ver la
        línea de tiempo.
      </div>
    );
  }

  const range = computeRange(actividades, fechaCorte);
  const days = totalDays(range);
  const width = days * PX_PER_DAY;
  const monthTicks = buildMonthTicks(range);
  const weekLines = buildWeekLines(range);

  const actividadesPorFrente = new Map<string, GanttActividad[]>();
  const sinFrente: GanttActividad[] = [];

  for (const frente of frentes) {
    actividadesPorFrente.set(frente.id, []);
  }
  for (const actividad of actividades) {
    if (actividad.frenteId && actividadesPorFrente.has(actividad.frenteId)) {
      actividadesPorFrente.get(actividad.frenteId)!.push(actividad);
    } else {
      sinFrente.push(actividad);
    }
  }

  const rows = buildRows(frentes, actividadesPorFrente, sinFrente);

  const today = todayDateOnly();
  const todayOffset = dayOffset(today, range.start);
  const corteOffset = fechaCorte ? dayOffset(fechaCorte, range.start) : null;

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-[var(--shadow-md)]">
      <div className="grid grid-cols-[minmax(220px,280px)_1fr]">
        {/* Columna de etiquetas */}
        <div className="border-r border-line">
          <div
            className="flex items-center border-b border-line px-4 text-[11px] font-semibold uppercase tracking-wide text-ink-faint"
            style={{ height: 56 }}
          >
            Frente / Actividad
          </div>
          {rows.map((row) =>
            row.kind === "group" ? (
              <div
                key={row.key}
                className="flex items-center justify-between bg-paper-dim px-4 text-xs font-semibold uppercase tracking-wide text-ink-soft"
                style={{ height: ROW_HEIGHT }}
              >
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo" aria-hidden />
                  {row.frente.nombre}
                </span>
                <span className="font-mono text-[11px] font-normal text-ink-faint">{row.count}</span>
              </div>
            ) : (
              <div
                key={row.key}
                className="flex flex-col justify-center border-b border-line/70 px-4 transition-colors hover:bg-indigo-soft/40"
                style={{ height: ROW_HEIGHT }}
              >
                <span className="truncate text-sm text-ink" title={row.actividad.nombre}>
                  <span className="mr-1.5 font-mono text-[11px] text-ink-faint">
                    {String(row.actividad.numero).padStart(2, "0")}
                  </span>
                  {row.actividad.nombre}
                </span>
                <span className="truncate text-xs text-ink-faint">{row.actividad.responsable}</span>
              </div>
            )
          )}
        </div>

        {/* Columna de línea de tiempo */}
        <div className="overflow-x-auto">
          <div style={{ width, minWidth: "100%" }}>
            <div className="relative border-b border-line" style={{ height: 56 }}>
              {monthTicks.map((tick) => (
                <div
                  key={tick.label}
                  className="absolute top-0 flex h-full items-center border-l border-line px-3 text-xs font-medium capitalize text-ink-soft"
                  style={{ left: tick.offsetDays * PX_PER_DAY, width: tick.widthDays * PX_PER_DAY }}
                >
                  {tick.label}
                </div>
              ))}
            </div>

            <div className="relative">
              {weekLines.map((offset) => (
                <div
                  key={offset}
                  className="absolute top-0 bottom-0 border-l border-line/60"
                  style={{ left: offset * PX_PER_DAY }}
                />
              ))}

              {corteOffset !== null && corteOffset >= 0 && corteOffset <= days && (
                <div
                  className="absolute top-0 bottom-0 z-10 w-0 border-l-2 border-dashed border-indigo/70"
                  style={{ left: corteOffset * PX_PER_DAY }}
                  title={`Fecha de corte: ${format(fechaCorte as Date, "d 'de' MMMM yyyy", { locale: es })}`}
                >
                  <span className="absolute top-1.5 left-1.5 rounded-full bg-indigo px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-paper shadow-[var(--shadow-sm)]">
                    Corte
                  </span>
                </div>
              )}

              {todayOffset >= 0 && todayOffset <= days && (
                <div
                  className="absolute top-0 bottom-0 z-10 w-0 border-l-2 border-danger"
                  style={{ left: todayOffset * PX_PER_DAY }}
                  title={`Hoy: ${format(today, "d 'de' MMMM yyyy", { locale: es })}`}
                >
                  <span className="absolute -top-0.5 left-1.5 flex items-center gap-1 rounded-full bg-danger px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-paper shadow-[var(--shadow-sm)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-paper animate-pulse-soft" />
                    Hoy
                  </span>
                </div>
              )}

              {rows.map((row) =>
                row.kind === "group" ? (
                  <div key={row.key} className="bg-paper-dim" style={{ height: ROW_HEIGHT }} />
                ) : (
                  <div
                    key={row.key}
                    className="relative border-b border-line/70 transition-colors hover:bg-indigo-soft/40"
                    style={{ height: ROW_HEIGHT }}
                  >
                    <div
                      className={`absolute top-1/2 h-2.5 -translate-y-1/2 overflow-hidden rounded-full shadow-[var(--shadow-sm)] transition-transform duration-200 hover:scale-y-125 ${barColorClass(row.actividad.estado)}`}
                      style={{
                        left: dayOffset(row.actividad.fechaInicio, range.start) * PX_PER_DAY,
                        width: Math.max(
                          (dayOffset(row.actividad.fechaFin, range.start) -
                            dayOffset(row.actividad.fechaInicio, range.start) +
                            1) *
                            PX_PER_DAY,
                          8
                        ),
                      }}
                      title={`${row.actividad.nombre} · ${ESTADO_LABEL[row.actividad.estado]} · ${row.actividad.porcentaje}% · ${format(row.actividad.fechaInicio, "d MMM", { locale: es })} – ${format(row.actividad.fechaFin, "d MMM", { locale: es })}`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-white/25 to-transparent" />
                      <div
                        className="relative h-full bg-ink/20"
                        style={{ width: `${row.actividad.porcentaje}%` }}
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
