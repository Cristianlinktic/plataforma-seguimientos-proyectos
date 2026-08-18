import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/data/session";
import { ProjectForm } from "./project-form";

export const metadata: Metadata = {
  title: "Nuevo proyecto",
};

export default async function NuevoProyectoPage() {
  const user = await getCurrentUser();
  if (user?.role !== "ADMIN") {
    redirect("/proyectos");
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-display text-2xl font-semibold text-ink">Nuevo proyecto</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Crea un proyecto y luego agrega sus frentes y actividades.
      </p>
      <Card className="mt-6 p-6">
        <ProjectForm />
      </Card>
    </div>
  );
}
