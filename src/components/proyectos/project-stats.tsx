import { CheckCircle2, CircleDashed, Clock3, Layers } from "lucide-react";
import type { ProyectoStats } from "@/lib/stats";
import { Card } from "@/components/ui/card";

const TILES: {
  key: keyof ProyectoStats;
  label: string;
  accent: string;
  iconBg: string;
  icon: typeof Layers;
  border: string;
}[] = [
  { key: "total", label: "Totales", accent: "text-ink", iconBg: "bg-paper-dim text-ink-soft", icon: Layers, border: "border-l-line-strong" },
  { key: "cerradas", label: "Cerradas", accent: "text-moss", iconBg: "bg-moss-soft text-moss", icon: CheckCircle2, border: "border-l-moss" },
  { key: "enCurso", label: "En curso", accent: "text-ochre", iconBg: "bg-ochre-soft text-ochre", icon: Clock3, border: "border-l-ochre" },
  { key: "pendientes", label: "Pendientes", accent: "text-stone", iconBg: "bg-stone-soft text-stone", icon: CircleDashed, border: "border-l-stone" },
];

export function ProjectStats({ stats }: { stats: ProyectoStats }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      {TILES.map((tile) => {
        const Icon = tile.icon;
        return (
          <Card
            key={tile.key}
            className={`card-lift border-l-[3px] px-4 py-3.5 ${tile.border}`}
          >
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
                {tile.label}
              </p>
              <span className={`flex h-6 w-6 items-center justify-center rounded-md ${tile.iconBg}`}>
                <Icon className="h-3.5 w-3.5" strokeWidth={2.25} />
              </span>
            </div>
            <p className={`mt-1.5 font-mono text-2xl font-semibold tabular-nums ${tile.accent}`}>
              {stats[tile.key]}
            </p>
          </Card>
        );
      })}

      <Card className="card-lift col-span-2 border-l-[3px] border-l-indigo px-4 py-3.5 sm:col-span-1">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">% Avance</p>
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-soft text-indigo">
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
              <path
                d="M2 12l3.5-4.5 2.5 3L12 5.5"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M9 5.5h3v3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
        <p className="mt-1.5 font-mono text-2xl font-semibold tabular-nums text-indigo">{stats.avance}%</p>
        <div className="stitch mt-2 h-1.5 w-full overflow-hidden rounded-full bg-paper-dim">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo to-indigo-glow transition-[width] duration-500 ease-out"
            style={{ width: `${stats.avance}%` }}
          />
        </div>
      </Card>
    </div>
  );
}
