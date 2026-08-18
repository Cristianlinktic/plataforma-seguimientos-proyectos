import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ProyectoStats } from "@/lib/stats";
import { formatDateEs } from "@/lib/dates";
import { Card } from "@/components/ui/card";
import { ProgressRing } from "@/components/ui/progress-ring";

type ProjectCardProps = {
  id: string;
  nombre: string;
  faseActual: string | null;
  fechaCorte: Date | null;
  stats: ProyectoStats;
};

const SEGMENTS: { key: keyof ProyectoStats; label: string; bar: string; dot: string; text: string }[] = [
  { key: "cerradas", label: "Cerradas", bar: "bg-moss", dot: "bg-moss", text: "text-moss" },
  { key: "enCurso", label: "En curso", bar: "bg-ochre", dot: "bg-ochre", text: "text-ochre" },
  { key: "pendientes", label: "Pendientes", bar: "bg-stone", dot: "bg-stone", text: "text-stone" },
];

export function ProjectCard({ id, nombre, faseActual, fechaCorte, stats }: ProjectCardProps) {
  return (
    <Link href={`/proyectos/${id}`} className="group block">
      <Card
        className="relative h-full overflow-hidden p-5 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.015] hover:border-indigo hover:shadow-[var(--shadow-lg)]"
      >
        {/* Barra de acento superior: siempre visible, con degradado en movimiento continuo.
            En hover no se desliza, sino que crece y el flujo se acelera. */}
        <div className="animate-gradient-flow absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo via-thread-ochre-tint to-indigo transition-[height] duration-300 ease-out group-hover:h-1.5" />

        {/* Resplandor decorativo detrás del anillo, solo visible en hover. */}
        <div
          className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-60"
          style={{ background: "radial-gradient(closest-side, var(--indigo-soft), transparent)" }}
        />

        <div className="relative flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-display text-xl font-bold tracking-tight text-ink transition-colors group-hover:text-indigo">
              {nombre}
            </h3>
            {faseActual && <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{faseActual}</p>}
          </div>
          <div className="shrink-0 transition-transform duration-300 group-hover:scale-110">
            <ProgressRing value={stats.avance} />
          </div>
        </div>

        <div className="relative mt-5 border-t border-line pt-4">
          <div className="flex h-2 w-full overflow-hidden rounded-full bg-paper-dim">
            {SEGMENTS.map((seg, i) => {
              const value = stats[seg.key] as number;
              const widthPct = stats.total === 0 ? 0 : (value / stats.total) * 100;
              return (
                <div
                  key={seg.key}
                  className={`animate-grow-x h-full ${seg.bar} first:rounded-l-full last:rounded-r-full`}
                  style={{ width: `${widthPct}%`, animationDelay: `${150 + i * 90}ms` }}
                />
              );
            })}
          </div>

          <dl className="mt-3 grid grid-cols-3 gap-2">
            {SEGMENTS.map((seg) => (
              <div key={seg.key}>
                <dt className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-ink-faint">
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${seg.dot}`} />
                  <span className="truncate">{seg.label}</span>
                </dt>
                <dd className={`mt-0.5 font-mono text-sm font-semibold tabular-nums ${seg.text}`}>
                  {stats[seg.key] as number}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mt-4 flex items-center justify-between">
          {fechaCorte ? (
            <p className="text-xs text-ink-faint">Corte: {formatDateEs(fechaCorte, "d 'de' MMMM yyyy")}</p>
          ) : (
            <span />
          )}
          <span className="flex translate-x-1 items-center gap-1 text-xs font-semibold text-indigo opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
            Ver proyecto
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </Card>
    </Link>
  );
}
