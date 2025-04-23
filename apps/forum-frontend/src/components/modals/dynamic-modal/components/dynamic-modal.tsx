import { ReactNode, useEffect, useState } from "react";
import {
  MutationKey,
  MutationStatus,
  useMutationState,
} from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@repo/ui/src/components/dialog.tsx";
import { DialogLoader } from "#components/templates/components/dialog-loader";

type DynamicModalProps = {
  trigger: ReactNode;
  content: ReactNode;
  mutationKey: MutationKey;
  status?: MutationStatus;
  contentClassName?: string;
  withLoader?: boolean;
};

export const DynamicModal = ({
  content,
  trigger,
  mutationKey,
  contentClassName,
  withLoader,
  status = "success",
}: DynamicModalProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const data = useMutationState({
    filters: { mutationKey },
    select: (mutation) => mutation.state.status,
  });

  const mutationStatus = data[data.length - 1];

  useEffect(() => {
    if (mutationStatus === status) {
      setOpen(false);
    }
  }, [mutationStatus]);
  
  return (
    <Dialog open={open} onOpenChange={o => setOpen(o)}>
      <DialogTrigger>{trigger}</DialogTrigger>
      <DialogContent className={contentClassName}>
        {withLoader ? (
          <>{mutationStatus === "pending" ? <DialogLoader /> : content}</>
        ) : (
          content
        )}
      </DialogContent>
    </Dialog>
  );
};
