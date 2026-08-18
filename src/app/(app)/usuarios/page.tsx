import type { Metadata } from "next";
import { Users } from "lucide-react";
import { listUsuarios } from "@/data/users";
import { getCurrentUser } from "@/data/session";
import { formatDateEs } from "@/lib/dates";
import { Card } from "@/components/ui/card";
import { NewUserButton } from "@/components/usuarios/new-user-button";

export const metadata: Metadata = {
  title: "Usuarios",
};

export default async function UsuariosPage() {
  const [usuarios, currentUser] = await Promise.all([listUsuarios(), getCurrentUser()]);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-indigo">Panel</p>
          <h1 className="mt-1 font-display text-4xl font-extrabold tracking-tight text-ink">
            Usuarios
          </h1>
          <p className="mt-1.5 text-sm text-ink-soft">
            Cuentas de acceso de tu equipo a la plataforma.
          </p>
        </div>
        <NewUserButton />
      </div>

      <Card className="mt-6 overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-line bg-paper-dim text-left text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
              <th className="px-4 py-3 font-semibold">Nombre</th>
              <th className="px-4 py-3 font-semibold">Correo</th>
              <th className="px-4 py-3 font-semibold">Desde</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id} className="border-b border-line/70 last:border-0 hover:bg-indigo-soft/40">
                <td className="px-4 py-3 text-ink">
                  {usuario.name}
                  {usuario.id === currentUser?.id && (
                    <span className="ml-2 rounded-full bg-indigo-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo">
                      Tú
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-ink-soft">{usuario.email}</td>
                <td className="px-4 py-3 font-mono text-xs text-ink-faint">
                  {formatDateEs(new Date(usuario.createdAt), "d MMM yyyy")}
                </td>
              </tr>
            ))}

            {usuarios.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-10 text-center text-sm text-ink-faint">
                  <Users className="mx-auto mb-2 h-6 w-6" strokeWidth={1.5} />
                  Todavía no hay usuarios.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
