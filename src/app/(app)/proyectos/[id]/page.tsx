import type { Metadata } from "next";
import { getProyecto } from "@/data/projects";
import { dateOnly, toDateInputValue } from "@/lib/dates";
import { ProjectHeader } from "@/components/proyectos/project-header";
import { ProjectStats } from "@/components/proyectos/project-stats";
import { GanttChart } from "@/components/gantt/gantt-chart";
import { ActivityTable } from "@/components/proyectos/activity-table";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const proyecto = await getProyecto(id);
  return { title: proyecto.nombre };
}

export default async function ProyectoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const proyecto = await getProyecto(id);

  const frentes = proyecto.frentes.map((f) => ({ id: f.id, nombre: f.nombre }));

  return (
    <div className="space-y-8">
      <ProjectHeader
        proyectoId={proyecto.id}
        nombre={proyecto.nombre}
        descripcion={proyecto.descripcion}
        faseActual={proyecto.faseActual}
        fechaCorte={proyecto.fechaCorte ? toDateInputValue(proyecto.fechaCorte) : null}
      />

      <ProjectStats stats={proyecto.stats} />

      <section>
        <div className="flex items-center gap-3">
          <h2 className="font-display text-lg font-semibold text-ink">Línea de tiempo</h2>
          <span className="stitch h-px flex-1" aria-hidden />
        </div>
        <div className="mt-3">
          <GanttChart
            frentes={frentes}
            fechaCorte={proyecto.fechaCorte ? dateOnly(proyecto.fechaCorte) : null}
            actividades={proyecto.actividades.map((a) => ({
              id: a.id,
              numero: a.numero,
              nombre: a.nombre,
              responsable: a.responsable,
              estado: a.estado,
              porcentaje: a.porcentaje,
              fechaInicio: dateOnly(a.fechaInicio),
              fechaFin: dateOnly(a.fechaFin),
              frenteId: a.frenteId,
            }))}
          />
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3">
          <h2 className="font-display text-lg font-semibold text-ink">Actividades</h2>
          <span className="stitch h-px flex-1" aria-hidden />
        </div>
        <div className="mt-3">
          <ActivityTable
            proyectoId={proyecto.id}
            frentes={frentes}
            actividades={proyecto.actividades.map((a) => ({
              id: a.id,
              numero: a.numero,
              nombre: a.nombre,
              responsable: a.responsable,
              estado: a.estado,
              porcentaje: a.porcentaje,
              fechaInicio: toDateInputValue(a.fechaInicio),
              fechaFin: toDateInputValue(a.fechaFin),
              frenteId: a.frenteId,
            }))}
          />
        </div>
      </section>
    </div>
  );
}
