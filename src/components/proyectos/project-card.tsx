import Link from "next/link";
import type { ProyectoStats } from "@/lib/stats";
import { formatDateEs } from "@/lib/dates";
import { Card } from "@/components/ui/card";

type ProjectCardProps = {
  id: string;
  nombre: string;
  faseActual: string | null;
  fechaCorte: Date | null;
  stats: ProyectoStats;
};

export function ProjectCard({ id, nombre, faseActual, fechaCorte, stats }: ProjectCardProps) {
  return (
    <Link href={`/proyectos/${id}`} className="group block">
      <Card className="h-full p-5 transition-colors group-hover:border-indigo">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl font-semibold text-ink">{nombre}</h3>
          <span className="font-mono text-lg font-semibold tabular-nums text-indigo">
            {stats.avance}%
          </span>
        </div>

        {faseActual && <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{faseActual}</p>}

        <div className="stitch mt-4 h-1.5 w-full overflow-hidden rounded-full bg-paper-dim">
          <div className="h-full rounded-full bg-indigo" style={{ width: `${stats.avance}%` }} />
        </div>

        <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-wide text-ink-faint">Cerradas</dt>
            <dd className="font-mono text-sm font-semibold text-moss">{stats.cerradas}</dd>
          </div>
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-wide text-ink-faint">En curso</dt>
            <dd className="font-mono text-sm font-semibold text-ochre">{stats.enCurso}</dd>
          </div>
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-wide text-ink-faint">Pendientes</dt>
            <dd className="font-mono text-sm font-semibold text-stone">{stats.pendientes}</dd>
          </div>
        </dl>

        {fechaCorte && (
          <p className="mt-4 text-xs text-ink-faint">
            Corte: {formatDateEs(fechaCorte, "d 'de' MMMM yyyy")}
          </p>
        )}
      </Card>
    </Link>
  );
}
