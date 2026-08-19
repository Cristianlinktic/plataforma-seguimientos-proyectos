import { requireSession } from "@/data/session";
import { Navbar } from "@/components/layout/navbar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireSession();

  return (
    <div className="mesh-chrome grain relative min-h-dvh">
      <div className="relative z-10">
        <Navbar user={user} />
        <main className="animate-rise-in mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
