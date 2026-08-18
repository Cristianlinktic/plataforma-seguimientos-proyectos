import Link from "next/link";
import { UserMenu } from "@/components/layout/user-menu";

export function Navbar({ user }: { user: { name?: string | null; email?: string | null } }) {
  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/proyectos" className="flex items-baseline gap-2">
          <span className="font-display text-xl font-semibold tracking-tight text-ink">Seguimientos LU</span>
          <span className="hidden text-xs font-medium uppercase tracking-widest text-ink-faint sm:inline">
            Proyectos
          </span>
        </Link>
        <UserMenu name={user.name ?? "Cuenta"} email={user.email ?? ""} />
      </div>
    </header>
  );
}
