import type { Metadata } from "next";
import Link from "next/link";
import { FolderKanban, Plus } from "lucide-react";
import { listProyectos } from "@/data/projects";
import { getCurrentUser } from "@/data/session";
import { ProjectCard } from "@/components/proyectos/project-card";
import { buttonClassName } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Proyectos",
};

export default async function ProyectosPage() {
  const [proyectos, currentUser] = await Promise.all([listProyectos(), getCurrentUser()]);
  const isAdmin = currentUser?.role === "ADMIN";

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-indigo-glow">Panel</p>
          <h1 className="mt-1 font-display text-4xl font-extrabold tracking-tight text-white">
            Proyectos
          </h1>
          <p className="mt-1.5 text-sm text-white/60">
            {proyectos.length === 0
              ? "Seguimiento de todos los proyectos en curso."
              : `${proyectos.length} ${proyectos.length === 1 ? "proyecto activo" : "proyectos activos"} en seguimiento.`}
          </p>
        </div>
        {isAdmin && (
          <Link
            href="/proyectos/nuevo"
            className={buttonClassName({
              className: "shrink-0 transition-transform duration-200 hover:-translate-y-0.5",
            })}
          >
            <Plus className="h-4 w-4" />
            Nuevo proyecto
          </Link>
        )}
      </div>

      {proyectos.length === 0 ? (
        <div className="animate-rise-in mt-10 rounded-2xl border border-dashed border-line-strong bg-surface p-14 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-soft text-indigo">
            <FolderKanban className="h-6 w-6" strokeWidth={2} />
          </span>
          <p className="mt-4 text-sm font-medium text-ink">Todavía no hay proyectos.</p>
          <p className="mt-1 text-sm text-ink-faint">
            {isAdmin ? "Crea el primero para empezar a hacer seguimiento." : "Todavía no hay proyectos para mostrar."}
          </p>
          {isAdmin && (
            <Link
              href="/proyectos/nuevo"
              className={buttonClassName({ className: "mt-5 inline-flex" })}
            >
              <Plus className="h-4 w-4" />
              Crear proyecto
            </Link>
          )}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {proyectos.map((proyecto, index) => (
            <div
              key={proyecto.id}
              className="animate-rise-in"
              style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
            >
              <ProjectCard
                id={proyecto.id}
                nombre={proyecto.nombre}
                faseActual={proyecto.faseActual}
                fechaCorte={proyecto.fechaCorte}
                stats={proyecto.stats}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
