import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { listProyectos } from "@/data/projects";
import { ProjectCard } from "@/components/proyectos/project-card";
import { buttonClassName } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Proyectos · Materan",
};

export default async function ProyectosPage() {
  const proyectos = await listProyectos();

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Proyectos</h1>
          <p className="mt-1 text-sm text-ink-soft">Seguimiento de todos los proyectos en curso.</p>
        </div>
        <Link href="/proyectos/nuevo" className={buttonClassName({ className: "shrink-0" })}>
          <Plus className="h-4 w-4" />
          Nuevo proyecto
        </Link>
      </div>

      {proyectos.length === 0 ? (
        <div className="mt-10 rounded-lg border border-dashed border-line-strong bg-surface p-12 text-center">
          <p className="text-sm text-ink-soft">Todavía no hay proyectos.</p>
          <Link href="/proyectos/nuevo" className="mt-3 inline-block text-sm font-semibold text-indigo hover:underline">
            Crea el primero →
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {proyectos.map((proyecto) => (
            <ProjectCard
              key={proyecto.id}
              id={proyecto.id}
              nombre={proyecto.nombre}
              faseActual={proyecto.faseActual}
              fechaCorte={proyecto.fechaCorte}
              stats={proyecto.stats}
            />
          ))}
        </div>
      )}
    </div>
  );
}
