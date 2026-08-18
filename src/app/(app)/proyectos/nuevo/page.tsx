import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { ProjectForm } from "./project-form";

export const metadata: Metadata = {
  title: "Nuevo proyecto",
};

export default function NuevoProyectoPage() {
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
