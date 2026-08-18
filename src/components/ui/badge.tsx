import type { EstadoActividad } from "@/types/db";
import { cn } from "@/lib/utils";

const ESTADO_CONFIG: Record<EstadoActividad, { label: string; className: string }> = {
  CERRADA: { label: "Cerrada", className: "bg-moss-soft text-moss" },
  EN_CURSO: { label: "En curso", className: "bg-ochre-soft text-ochre" },
  PENDIENTE: { label: "Pendiente", className: "bg-stone-soft text-stone" },
};

export function EstadoBadge({ estado, className }: { estado: EstadoActividad; className?: string }) {
  const config = ESTADO_CONFIG[estado];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        config.className,
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  );
}

export function FrenteBadge({ nombre, className }: { nombre: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-line-strong bg-paper px-2.5 py-1 text-xs font-medium text-ink-soft",
        className
      )}
    >
      {nombre}
    </span>
  );
}
