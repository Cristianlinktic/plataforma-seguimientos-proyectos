import type { ProyectoStats } from "@/lib/stats";
import { Card } from "@/components/ui/card";

const TILES: { key: keyof ProyectoStats; label: string; accent: string }[] = [
  { key: "total", label: "Totales", accent: "text-ink" },
  { key: "cerradas", label: "Cerradas", accent: "text-moss" },
  { key: "enCurso", label: "En curso", accent: "text-ochre" },
  { key: "pendientes", label: "Pendientes", accent: "text-stone" },
];

export function ProjectStats({ stats }: { stats: ProyectoStats }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      {TILES.map((tile) => (
        <Card key={tile.key} className="px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
            {tile.label}
          </p>
          <p className={`mt-1 font-mono text-2xl font-semibold tabular-nums ${tile.accent}`}>
            {stats[tile.key]}
          </p>
        </Card>
      ))}
      <Card className="col-span-2 px-4 py-3 sm:col-span-1">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">% Avance</p>
        <div className="mt-1 flex items-center gap-2">
          <p className="font-mono text-2xl font-semibold tabular-nums text-indigo">{stats.avance}%</p>
        </div>
        <div className="stitch mt-2 h-1.5 w-full overflow-hidden rounded-full bg-paper-dim">
          <div
            className="h-full rounded-full bg-indigo transition-[width]"
            style={{ width: `${stats.avance}%` }}
          />
        </div>
      </Card>
    </div>
  );
}
