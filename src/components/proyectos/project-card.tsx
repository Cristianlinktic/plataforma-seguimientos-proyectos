import Link from "next/link";
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

export function ProjectCard({ id, nombre, faseActual, fechaCorte, stats }: ProjectCardProps) {
  return (
    <Link href={`/proyectos/${id}`} className="group block">
      <Card className="card-lift relative h-full overflow-hidden p-5">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo via-thread-ochre-tint to-indigo opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-display text-xl font-semibold text-ink">{nombre}</h3>
            {faseActual && <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{faseActual}</p>}
          </div>
          <ProgressRing value={stats.avance} />
        </div>

        <dl className="mt-5 grid grid-cols-3 gap-2 border-t border-line pt-4 text-center">
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
