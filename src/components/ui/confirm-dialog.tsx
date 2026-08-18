"use client";

import { useTransition } from "react";
import { Modal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type ConfirmDialogProps = {
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => Promise<void> | void;
  onClose: () => void;
};

export function ConfirmDialog({
  title,
  description,
  confirmLabel = "Eliminar",
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <Modal open onClose={onClose} title={title} description={description}>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="danger"
          disabled={isPending}
          onClick={() => startTransition(async () => onConfirm())}
        >
          {isPending ? "Eliminando…" : confirmLabel}
        </Button>
        <Button type="button" variant="ghost" onClick={onClose} disabled={isPending}>
          Cancelar
        </Button>
      </div>
    </Modal>
  );
}
