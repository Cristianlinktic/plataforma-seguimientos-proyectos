import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/data/session";
import { TimelineHero } from "@/components/login/timeline-hero";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Ingresar",
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
    <div className="mesh-chrome grain relative grid min-h-dvh lg:grid-cols-[1.15fr_1fr]">
      <div className="relative z-10 hidden flex-col justify-between overflow-hidden px-14 py-12 text-white lg:flex">
        <div
          className="animate-float-slow pointer-events-none absolute -right-24 -top-24 h-[26rem] w-[26rem] rounded-full opacity-50 blur-3xl"
          style={{ background: "radial-gradient(closest-side, var(--indigo-glow), transparent)" }}
        />
        <div
          className="animate-float-slow pointer-events-none absolute -bottom-32 -left-16 h-96 w-96 rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(closest-side, var(--thread-ochre-tint), transparent)", animationDelay: "-4s" }}
        />

        <span className="relative z-10 font-display text-2xl font-extrabold tracking-tight">
          Seguimientos <span className="text-thread-ochre-tint">LU</span>
        </span>

        <div className="relative z-10">
          <div className="mb-8 w-16 border-t-2 border-dashed border-white/30" aria-hidden />
          <h1 className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-balance">
            Cada proyecto, cada frente, cada actividad —
            <span className="text-thread-ochre-tint"> en una sola línea de tiempo.</span>
          </h1>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
            Organiza tus proyectos por frentes y actividades, con estado, % de avance y fechas —
            todo en un solo lugar.
          </p>

          <div className="mt-10 max-w-sm">
            <TimelineHero />
          </div>
        </div>

        <p className="relative z-10 text-xs uppercase tracking-widest text-white/40">
          Plataforma de Seguimientos de Proyectos
        </p>
      </div>

      <div className="relative z-10 flex items-center justify-center px-6 py-16">
        <div className="animate-rise-in w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <span className="font-display text-2xl font-extrabold tracking-tight text-white">
              Seguimientos LU
            </span>
          </div>

          <div className="relative">
            <div
              className="pointer-events-none absolute -inset-5 rounded-[2rem] opacity-60 blur-2xl"
              style={{ background: "radial-gradient(closest-side, var(--indigo-glow), transparent)" }}
              aria-hidden
            />
            <div className="relative overflow-hidden rounded-2xl border border-line bg-surface p-8 shadow-[var(--shadow-lg)]">
              <div className="animate-gradient-flow absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo via-thread-ochre-tint to-indigo" />
              <h2 className="font-display text-2xl font-bold text-ink">Ingresar</h2>
              <p className="mt-1 text-sm text-ink-soft">
                Usa el correo y la contraseña de tu cuenta de equipo.
              </p>
              <div className="mt-7">
                <LoginForm redirectTo={from && from !== "/login" ? from : "/proyectos"} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
