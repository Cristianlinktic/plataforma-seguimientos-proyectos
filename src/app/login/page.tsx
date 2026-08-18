import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/data/session";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Ingresar · Materan",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const user = await getCurrentUser();
  if (user) redirect("/proyectos");

  const { from } = await searchParams;

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-indigo px-12 py-10 text-paper lg:flex">
        <span className="font-display text-2xl font-semibold tracking-tight">Materan</span>
        <div>
          <div className="mb-6 w-16 border-t-2 border-dashed border-paper/40" aria-hidden />
          <h1 className="font-display text-4xl font-semibold leading-tight text-balance">
            Cada frente, cada actividad, en una sola línea de tiempo.
          </h1>
          <p className="mt-4 max-w-sm text-sm text-paper/70">
            Seguimiento de estrategia, digital, e-commerce, producto, packaging y legal — desde el
            lanzamiento de marca hasta la salida a producción.
          </p>
        </div>
        <p className="text-xs uppercase tracking-widest text-paper/50">Plataforma de seguimientos</p>
      </div>

      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <span className="font-display text-2xl font-semibold tracking-tight text-ink">Materan</span>
          </div>
          <h2 className="font-display text-2xl font-semibold text-ink">Ingresar</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Usa el correo y la contraseña de tu cuenta de equipo.
          </p>
          <div className="mt-6">
            <LoginForm redirectTo={from && from !== "/login" ? from : "/proyectos"} />
          </div>
        </div>
      </div>
    </div>
  );
}
