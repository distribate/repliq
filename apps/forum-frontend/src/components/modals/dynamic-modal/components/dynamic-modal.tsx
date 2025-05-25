import { ReactNode, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@repo/ui/src/components/dialog.tsx";
import { DialogLoader } from "#components/templates/components/dialog-loader";

type DynamicModalProps = {
  trigger: ReactNode;
  content: ReactNode;
  contentClassName?: string;
  autoClose?: boolean
} & (
    {
      withLoader?: true, isPending: boolean,
    }
    | { withLoader?: false, isPending?: never }
  )

export const DynamicModal = ({
  content, trigger, contentClassName, withLoader, isPending, autoClose = false,
}: DynamicModalProps) => {
  const [open, setOpen] = useState(false)
  const [operationWasPending, setOperationWasPending] = useState(false);

  useEffect(() => {
    if (open) {
      if (withLoader && isPending) {
        setOperationWasPending(true);
      }
    } else {
      setOperationWasPending(false);
    }
  }, [open, withLoader, isPending]);

  useEffect(() => {
    if (
      withLoader &&
      operationWasPending &&
      !isPending && 
      autoClose && 
      open 
    ) {
      setOpen(false);
    }
  }, [withLoader, isPending, autoClose, operationWasPending, open]);

  return (
    <Dialog open={open} onOpenChange={value => setOpen(value)}>
      <DialogTrigger>{trigger}</DialogTrigger>
      <DialogContent forceMount className={contentClassName}>
        {withLoader ? isPending ? <DialogLoader /> : content : content}
      </DialogContent>
    </Dialog>
  );
};