import { AlertEntity } from "@repo/types/entities/entities-type.ts";
import { PenLine } from "lucide-react";
import { Button } from "@repo/ui/src/components/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@repo/ui/src/components/dialog.tsx";
import { AlertUpdateForm } from "#components/forms/create-alert/components/update-alert-form.tsx";
import { useEffect, useState } from "react";
import { useMutationState } from "@tanstack/react-query";
import { ALERT_UPDATE_MUTATION_KEY } from "#components/forms/create-alert/hooks/use-alerts.ts";
import { DialogLoader } from "#components/templates/dialog-loader.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";

export const AlertItemEditButton = ({
  ...currentAlert
}: Omit<AlertEntity, "created_at" | "creator">) => {
  const [isShow, setIsShow] = useState<boolean>(false);

  const data = useMutationState({
    filters: { mutationKey: ALERT_UPDATE_MUTATION_KEY },
    select: (mutation) => mutation.state.status,
  });

  const alertUpdatingMutationStatus = data[data.length - 1];

  useEffect(() => {
    if (alertUpdatingMutationStatus === "success") setIsShow(false);
  }, [alertUpdatingMutationStatus]);

  return (
    <Dialog onOpenChange={setIsShow} open={isShow}>
      <DialogTrigger>
        <Button
          title="Редактировать"
          className="h-7 w-7 hover:bg-shark-600 bg-shark-700/70 rounded-md duration-300"
        >
          <PenLine size={18} className="text-shark-300" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        {alertUpdatingMutationStatus === "pending" ? (
          <DialogLoader />
        ) : (
          <div className="flex flex-col gap-y-6 px-2 items-center w-full">
            <Typography variant="dialogTitle">Обновление объявления</Typography>
            <AlertUpdateForm {...currentAlert} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
