import { requireSession } from "@/data/session";
import { Navbar } from "@/components/layout/navbar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireSession();

  return (
    <div className="min-h-dvh bg-paper">
      <Navbar user={user} />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
