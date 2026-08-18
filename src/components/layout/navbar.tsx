import Link from "next/link";
import { UserMenu } from "@/components/layout/user-menu";

export function Navbar({ user }: { user: { name?: string | null; email?: string | null } }) {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-surface/85 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/proyectos" className="group flex items-baseline gap-2">
          <span className="h-2 w-2 self-center rounded-full bg-indigo transition-transform group-hover:scale-125" aria-hidden />
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
