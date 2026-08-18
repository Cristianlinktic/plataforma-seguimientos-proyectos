"use client";

import { useTransition } from "react";
import { LogOut } from "lucide-react";
import { signOutAction } from "@/app/(app)/actions";

export function UserMenu({ name, email }: { name: string; email: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-3">
      <div className="hidden text-right sm:block">
        <p className="text-sm font-medium leading-tight text-white">{name}</p>
        <p className="text-xs leading-tight text-white/40">{email}</p>
      </div>
      <button
        type="button"
        disabled={isPending}
        onClick={() => startTransition(() => signOutAction())}
        className="inline-flex h-9 items-center gap-1.5 rounded-md border border-white/15 px-3 text-xs font-medium text-white/70 transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white disabled:opacity-60"
      >
        <LogOut className="h-3.5 w-3.5" />
        Salir
      </button>
    </div>
  );
}
