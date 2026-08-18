"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { formatDateEs } from "@/lib/dates";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ProjectEditDialog } from "@/components/proyectos/project-edit-dialog";
import { FrenteFormDialog } from "@/components/proyectos/frente-form-dialog";
import { eliminarProyectoAction } from "@/app/(app)/proyectos/[id]/actions";

type ProjectHeaderProps = {
  proyectoId: string;
  nombre: string;
  descripcion: string | null;
  faseActual: string | null;
  fechaCorte: string | null;
};

export function ProjectHeader({ proyectoId, nombre, descripcion, faseActual, fechaCorte }: ProjectHeaderProps) {
  const [dialog, setDialog] = useState<"edit" | "frente" | "delete" | null>(null);

  return (
    <div className="relative overflow-hidden rounded-xl border border-line bg-gradient-to-br from-surface to-indigo-soft/40 px-6 py-6 sm:px-8 sm:py-7">
      <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-indigo">Proyecto</p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {nombre}
          </h1>
          {descripcion && <p className="mt-1 max-w-2xl text-sm text-ink-faint">{descripcion}</p>}
          {fechaCorte && (
            <p className="mt-3 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-ink-faint">
              <span className="stitch h-px w-6" aria-hidden />
              Fecha de corte: {formatDateEs(new Date(fechaCorte), "d 'de' MMMM yyyy")}
            </p>
          )}
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <Button size="sm" variant="secondary" onClick={() => setDialog("frente")}>
            <Plus className="h-3.5 w-3.5" />
            Nuevo frente
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setDialog("edit")}>
            <Pencil className="h-3.5 w-3.5" />
            Editar
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setDialog("delete")} className="text-danger hover:bg-danger-soft">
            <Trash2 className="h-3.5 w-3.5" />
            Eliminar
          </Button>
        </div>
      </div>

      {dialog === "edit" && (
        <ProjectEditDialog
          proyectoId={proyectoId}
          proyecto={{ nombre, descripcion, faseActual, fechaCorte }}
          onClose={() => setDialog(null)}
        />
      )}

      {dialog === "frente" && <FrenteFormDialog proyectoId={proyectoId} onClose={() => setDialog(null)} />}

      {dialog === "delete" && (
        <ConfirmDialog
          title="Eliminar proyecto"
          description={`¿Seguro que quieres eliminar "${nombre}"? Se eliminarán también sus frentes y actividades. Esta acción no se puede deshacer.`}
          onClose={() => setDialog(null)}
          onConfirm={() => eliminarProyectoAction(proyectoId)}
        />
      )}
    </div>
  );
}
