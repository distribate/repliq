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
import { DialogLoader } from "../templates/dialog-loader.tsx";

type DynamicModalProps = {
  trigger: ReactNode;
  content: ReactNode;
  mutationKey: MutationKey;
  status?: MutationStatus;
  contentClassName?: string;
  withLoader?: boolean;
  freeze?: boolean;
};

export const DynamicModal = ({
  content,
  trigger,
  mutationKey,
  contentClassName,
  withLoader,
  freeze = false,
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

  const handleOpen = (o: boolean) => {
    if (freeze && !o) {
      return;
    }

    setOpen(o);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
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
