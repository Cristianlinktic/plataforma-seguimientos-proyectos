"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserFormDialog } from "@/components/usuarios/user-form-dialog";

export function NewUserButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus className="h-3.5 w-3.5" />
        Nuevo usuario
      </Button>
      {open && <UserFormDialog onClose={() => setOpen(false)} />}
    </>
  );
}
