import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CheckCircle2, CircleDashed, Clock3, Layers } from "lucide-react";
import { todayDateOnly } from "@/lib/dates";
import {
  ROW_HEIGHT,
  buildDateTicks,
  buildMonthTicks,
  buildRows,
  computeRange,
  dayOffset,
  estadoChipStyle,
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

const ESTADO_ICON: Record<GanttActividad["estado"], typeof CheckCircle2> = {
  CERRADA: CheckCircle2,
  EN_CURSO: Clock3,
  PENDIENTE: CircleDashed,
};

const HEADER_HEIGHT = 64;
const CHIP_HEIGHT = 30;

const LEGEND: { estado: GanttActividad["estado"]; label: string }[] = [
  { estado: "CERRADA", label: "Cerrada" },
  { estado: "EN_CURSO", label: "En curso" },
  { estado: "PENDIENTE", label: "Pendiente" },
];

export function GanttChart({ frentes, actividades, fechaCorte }: GanttChartProps) {
  if (actividades.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line-strong bg-surface p-10 text-center text-sm text-ink-soft">
        Todavía no hay actividades para dibujar la línea de tiempo. Agrega la primera actividad
        para verla aquí.
      </div>
    );
  }

  const range = computeRange(actividades, fechaCorte);
  const days = totalDays(range);
  const pct = (offsetDays: number) => (offsetDays / days) * 100;
  const monthTicks = buildMonthTicks(range);
  const dateTicks = buildDateTicks(range);

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

  // Una franja de fondo alterna por frente (no por fila) para agrupar visualmente
  // sin depender de líneas horizontales.
  const rowBand: boolean[] = [];
  for (let i = 0, laneIndex = -1; i < rows.length; i++) {
    if (rows[i].kind === "group") laneIndex += 1;
    rowBand.push(laneIndex % 2 === 1);
  }

  const today = todayDateOnly();
  const todayOffset = dayOffset(today, range.start);
  const corteOffset = fechaCorte ? dayOffset(fechaCorte, range.start) : null;

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-[var(--shadow-lg)]">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-line bg-paper-dim/70 px-5 py-3">
        {LEGEND.map((item) => {
          const style = estadoChipStyle(item.estado);
          return (
            <span key={item.estado} className="flex items-center gap-1.5 text-xs font-medium text-ink-soft">
              <span className={`h-2 w-2 rounded-full ${style.dot}`} />
              {item.label}
            </span>
          );
        })}
        <span className="ml-auto flex items-center gap-4 text-xs font-medium text-ink-faint">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-danger" />
            Hoy
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-3 rounded-full border-t-2 border-dashed border-indigo" />
            Fecha de corte
          </span>
        </span>
      </div>

      <div className="grid grid-cols-[minmax(200px,260px)_1fr]">
        {/* Columna de etiquetas */}
        <div className="border-r border-line">
          <div
            className="flex items-end border-b border-line/70 px-5 pb-3 text-[11px] font-semibold uppercase tracking-wide text-ink-faint"
            style={{ height: HEADER_HEIGHT }}
          >
            Actividad
          </div>
          {rows.map((row, i) =>
            row.kind === "group" ? (
              <div
                key={row.key}
                className="flex items-center gap-2 bg-paper-dim/80 px-5"
                style={{ height: ROW_HEIGHT }}
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-indigo-soft text-indigo">
                  <Layers className="h-3.5 w-3.5" strokeWidth={2.25} />
                </span>
                <span className="truncate text-sm font-bold text-ink">{row.frente.nombre}</span>
                <span className="ml-auto shrink-0 font-mono text-[11px] text-ink-faint">{row.count}</span>
              </div>
            ) : (
              <div
                key={row.key}
                className={`flex flex-col justify-center px-5 transition-colors hover:bg-indigo-soft/50 ${rowBand[i] ? "bg-paper-dim/40" : ""}`}
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

        {/* Columna de línea de tiempo: todo en porcentajes, cabe sin scroll horizontal. */}
        <div className="relative">
          <div className="relative border-b border-line/70" style={{ height: HEADER_HEIGHT }}>
            {monthTicks.map((tick) => (
              <div
                key={tick.offsetDays}
                className="absolute top-0 flex h-full flex-col items-center justify-start border-l border-line/70 pt-2 text-center"
                style={{ left: `${pct(tick.offsetDays)}%`, width: `${pct(tick.widthDays)}%` }}
              >
                <span className="font-display text-sm font-bold capitalize text-ink">{tick.label}</span>
              </div>
            ))}
            {dateTicks.map((tick, i) => {
              const nextOffset = dateTicks[i + 1]?.offsetDays ?? days;
              return (
                <div
                  key={tick.offsetDays}
                  className="absolute bottom-0 flex h-5 items-center justify-center border-l border-line/50"
                  style={{ left: `${pct(tick.offsetDays)}%`, width: `${pct(nextOffset - tick.offsetDays)}%` }}
                >
                  <span className="font-mono text-[10px] text-ink-faint">{tick.dayLabel}</span>
                </div>
              );
            })}
          </div>

          <div className="relative">
            {dateTicks.map((tick) => (
              <div
                key={tick.offsetDays}
                className="absolute top-0 bottom-0 border-l border-line/50"
                style={{ left: `${pct(tick.offsetDays)}%` }}
              />
            ))}

            {corteOffset !== null && corteOffset >= 0 && corteOffset <= days && (
              <div
                className="absolute top-0 bottom-0 z-10 w-0 border-l-2 border-dashed border-indigo/60"
                style={{ left: `${pct(corteOffset)}%` }}
                title={`Fecha de corte: ${format(fechaCorte as Date, "d 'de' MMMM yyyy", { locale: es })}`}
              >
                <span className="absolute top-1.5 left-1.5 whitespace-nowrap rounded-full bg-indigo px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white shadow-[var(--shadow-sm)]">
                  Corte
                </span>
              </div>
            )}

            {todayOffset >= 0 && todayOffset <= days && (
              <div
                className="absolute top-0 bottom-0 z-10 w-0"
                style={{ left: `${pct(todayOffset)}%` }}
                title={`Hoy: ${format(today, "d 'de' MMMM yyyy", { locale: es })}`}
              >
                <div className="absolute inset-y-0 w-3 -translate-x-1/2 bg-danger/10 blur-sm" />
                <div className="absolute inset-y-0 border-l-2 border-danger" />
                <span className="absolute top-7 left-1.5 flex items-center gap-1 whitespace-nowrap rounded-full bg-danger px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white shadow-[var(--shadow-sm)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse-soft" />
                  Hoy
                </span>
              </div>
            )}

            {rows.map((row, i) =>
              row.kind === "group" ? (
                <div key={row.key} className="bg-paper-dim/80" style={{ height: ROW_HEIGHT }} />
              ) : (
                <ActivityChipRow
                  key={row.key}
                  actividad={row.actividad}
                  rangeStart={range.start}
                  totalDaysCount={days}
                  band={rowBand[i]}
                  index={i}
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityChipRow({
  actividad,
  rangeStart,
  totalDaysCount,
  band,
  index,
}: {
  actividad: GanttActividad;
  rangeStart: Date;
  totalDaysCount: number;
  band: boolean;
  index: number;
}) {
  const style = estadoChipStyle(actividad.estado);
  const Icon = ESTADO_ICON[actividad.estado];

  const startOffset = dayOffset(actividad.fechaInicio, rangeStart);
  const endOffset = dayOffset(actividad.fechaFin, rangeStart);
  const leftPct = (startOffset / totalDaysCount) * 100;
  const widthPct = ((endOffset - startOffset + 1) / totalDaysCount) * 100;
  const durationDays = endOffset - startOffset + 1;
  const showLabel = durationDays >= 6;

  return (
    <div
      className={`relative transition-colors hover:bg-indigo-soft/50 ${band ? "bg-paper-dim/40" : ""}`}
      style={{ height: ROW_HEIGHT }}
    >
      <div
        className={`animate-chip-in absolute top-1/2 flex -translate-y-1/2 items-center gap-1.5 overflow-hidden rounded-full border px-2.5 shadow-[var(--shadow-sm)] transition-all duration-200 hover:z-20 hover:scale-[1.04] hover:shadow-[var(--shadow-md)] ${style.bg} ${style.border}`}
        style={{
          left: `${leftPct}%`,
          width: `${widthPct}%`,
          minWidth: CHIP_HEIGHT,
          height: CHIP_HEIGHT,
          animationDelay: `${Math.min(index, 24) * 18}ms`,
        }}
        title={`${actividad.nombre} · ${ESTADO_LABEL[actividad.estado]} · ${actividad.porcentaje}% · ${format(actividad.fechaInicio, "d MMM", { locale: es })} – ${format(actividad.fechaFin, "d MMM", { locale: es })}`}
      >
        <Icon className={`h-3 w-3 shrink-0 ${style.text}`} strokeWidth={2.5} />
        {showLabel && (
          <span className={`truncate text-[11px] font-semibold ${style.text}`}>{actividad.nombre}</span>
        )}
        <span className="absolute inset-x-0 bottom-0 h-[3px] bg-black/10">
          <span className={`block h-full ${style.fill}`} style={{ width: `${actividad.porcentaje}%` }} />
        </span>
      </div>
    </div>
  );
}
