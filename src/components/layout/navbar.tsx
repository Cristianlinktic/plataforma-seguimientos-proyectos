import Link from "next/link";
import { UserMenu } from "@/components/layout/user-menu";

export function Navbar({ user }: { user: { name?: string | null; email?: string | null } }) {
  return (
    <header className="sticky top-0 z-20 border-b border-black/20 bg-chrome/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/proyectos" className="group flex items-baseline gap-2.5">
          <span
            className="h-2 w-2 self-center rounded-full bg-thread-ochre-tint transition-transform group-hover:scale-125"
            aria-hidden
          />
          <span className="font-display text-xl font-bold tracking-tight text-white">Seguimientos LU</span>
          <span className="hidden text-xs font-medium uppercase tracking-widest text-white/40 sm:inline">
            Proyectos
          </span>
        </Link>
        <UserMenu name={user.name ?? "Cuenta"} email={user.email ?? ""} />
      </div>
    </header>
  );
}
