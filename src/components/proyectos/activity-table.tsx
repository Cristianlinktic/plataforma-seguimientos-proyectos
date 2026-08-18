"use client";

import { useMemo, useState, useTransition } from "react";
import { differenceInCalendarDays, format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/field";
import { EstadoBadge, FrenteBadge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  ActivityFormDialog,
  type ActividadTarget,
} from "@/components/proyectos/activity-form-dialog";
import {
  actualizarEstadoActividadAction,
  eliminarActividadAction,
} from "@/app/(app)/proyectos/[id]/actions";
import type { EstadoActividad } from "@/types/db";

export type ActividadRow = {
  id: string;
  numero: number;
  nombre: string;
  responsable: string;
  estado: EstadoActividad;
  porcentaje: number;
  fechaInicio: string;
  fechaFin: string;
  frenteId: string | null;
};

type ActivityTableProps = {
  proyectoId: string;
  frentes: { id: string; nombre: string }[];
  actividades: ActividadRow[];
};

const ESTADOS: { value: EstadoActividad | "TODOS"; label: string }[] = [
  { value: "TODOS", label: "Todos los estados" },
  { value: "PENDIENTE", label: "Pendiente" },
  { value: "EN_CURSO", label: "En curso" },
  { value: "CERRADA", label: "Cerrada" },
];

export function ActivityTable({ proyectoId, frentes, actividades }: ActivityTableProps) {
  const [frenteFiltro, setFrenteFiltro] = useState("TODOS");
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoActividad | "TODOS">("TODOS");
  const [formTarget, setFormTarget] = useState<"create" | ActividadTarget>(null);
  const [deleteTarget, setDeleteTarget] = useState<ActividadRow | null>(null);
  const [pendingEstadoId, startEstadoTransition] = useTransition();

  const frenteById = useMemo(() => new Map(frentes.map((f) => [f.id, f.nombre])), [frentes]);

  const filtradas = useMemo(() => {
    return actividades.filter((a) => {
      if (frenteFiltro !== "TODOS" && a.frenteId !== frenteFiltro) return false;
      if (estadoFiltro !== "TODOS" && a.estado !== estadoFiltro) return false;
      return true;
    });
  }, [actividades, frenteFiltro, estadoFiltro]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Select
            aria-label="Filtrar por frente"
            className="h-9 w-auto text-sm"
            value={frenteFiltro}
            onChange={(e) => setFrenteFiltro(e.target.value)}
          >
            <option value="TODOS">Todos los frentes</option>
            {frentes.map((f) => (
              <option key={f.id} value={f.id}>
                {f.nombre}
              </option>
            ))}
          </Select>
          <Select
            aria-label="Filtrar por estado"
            className="h-9 w-auto text-sm"
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value as EstadoActividad | "TODOS")}
          >
            {ESTADOS.map((e) => (
              <option key={e.value} value={e.value}>
                {e.label}
              </option>
            ))}
          </Select>
        </div>
        <Button size="sm" onClick={() => setFormTarget("create")}>
          <Plus className="h-3.5 w-3.5" />
          Nueva actividad
        </Button>
      </div>

      <div className="mt-4 overflow-x-auto rounded-lg border border-line bg-surface">
        <table className="w-full min-w-[860px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line bg-paper-dim text-left text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
              <th className="px-3 py-2.5 font-semibold">#</th>
              <th className="px-3 py-2.5 font-semibold">Actividad</th>
              <th className="px-3 py-2.5 font-semibold">Frente</th>
              <th className="px-3 py-2.5 font-semibold">Responsable</th>
              <th className="px-3 py-2.5 font-semibold">Estado</th>
              <th className="px-3 py-2.5 font-semibold">Avance</th>
              <th className="px-3 py-2.5 font-semibold">Fechas</th>
              <th className="px-3 py-2.5 font-semibold">Días</th>
              <th className="px-3 py-2.5 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtradas.map((actividad) => {
              const inicio = parseISO(actividad.fechaInicio);
              const fin = parseISO(actividad.fechaFin);
              const dias = differenceInCalendarDays(fin, inicio) + 1;

              return (
                <tr key={actividad.id} className="border-b border-line/70 last:border-0 hover:bg-paper-dim/50">
                  <td className="px-3 py-2.5 font-mono text-xs text-ink-faint">
                    {String(actividad.numero).padStart(2, "0")}
                  </td>
                  <td className="px-3 py-2.5 text-ink">{actividad.nombre}</td>
                  <td className="px-3 py-2.5">
                    {actividad.frenteId && frenteById.has(actividad.frenteId) ? (
                      <FrenteBadge nombre={frenteById.get(actividad.frenteId)!} />
                    ) : (
                      <span className="text-xs text-ink-faint">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-ink-soft">{actividad.responsable}</td>
                  <td className="px-3 py-2.5">
                    <label className="sr-only" htmlFor={`estado-${actividad.id}`}>
                      Estado de {actividad.nombre}
                    </label>
                    <select
                      id={`estado-${actividad.id}`}
                      value={actividad.estado}
                      disabled={pendingEstadoId}
                      onChange={(e) =>
                        startEstadoTransition(() =>
                          actualizarEstadoActividadAction(
                            proyectoId,
                            actividad.id,
                            e.target.value as EstadoActividad
                          )
                        )
                      }
                      className="rounded-md border border-transparent bg-transparent text-xs focus:border-line-strong focus:outline-none"
                    >
                      <option value="PENDIENTE">Pendiente</option>
                      <option value="EN_CURSO">En curso</option>
                      <option value="CERRADA">Cerrada</option>
                    </select>
                    <div className="mt-1">
                      <EstadoBadge estado={actividad.estado} />
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-paper-dim">
                        <div
                          className="h-full rounded-full bg-indigo"
                          style={{ width: `${actividad.porcentaje}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs tabular-nums text-ink-soft">
                        {actividad.porcentaje}%
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 whitespace-nowrap font-mono text-xs text-ink-soft">
                    {format(inicio, "d MMM", { locale: es })} – {format(fin, "d MMM", { locale: es })}
                  </td>
                  <td className="px-3 py-2.5 font-mono text-xs text-ink-soft">{dias}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        aria-label={`Editar ${actividad.nombre}`}
                        onClick={() => setFormTarget(actividad)}
                        className="rounded-md p-1.5 text-ink-faint hover:bg-paper-dim hover:text-ink"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        aria-label={`Eliminar ${actividad.nombre}`}
                        onClick={() => setDeleteTarget(actividad)}
                        className="rounded-md p-1.5 text-ink-faint hover:bg-danger-soft hover:text-danger"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {filtradas.length === 0 && (
              <tr>
                <td colSpan={9} className="px-3 py-10 text-center text-sm text-ink-faint">
                  Ninguna actividad coincide con los filtros seleccionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {formTarget !== null && (
        <ActivityFormDialog
          key={formTarget === "create" ? "create" : formTarget.id}
          proyectoId={proyectoId}
          frentes={frentes}
          actividad={formTarget === "create" ? null : formTarget}
          defaultFrenteId={frenteFiltro !== "TODOS" ? frenteFiltro : undefined}
          onClose={() => setFormTarget(null)}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Eliminar actividad"
          description={`¿Seguro que quieres eliminar "${deleteTarget.nombre}"? Esta acción no se puede deshacer.`}
          onClose={() => setDeleteTarget(null)}
          onConfirm={async () => {
            await eliminarActividadAction(proyectoId, deleteTarget.id);
            setDeleteTarget(null);
          }}
        />
      )}
    </div>
  );
}
