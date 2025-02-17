import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@repo/ui/src/components/dialog.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { useEffect, useState } from "react";
import { DialogLoader } from "../../../../../templates/dialog-loader.tsx";
import { useMutationState } from "@tanstack/react-query";
import { AlertCreateForm } from "../../../../../forms/create-alert/components/create-alert-form.tsx";
import { ALERT_CREATE_MUTATION_KEY } from "../../../../../forms/create-alert/hooks/use-alerts.ts";

export const AlertsAddButton = () => {
  const [isShow, setIsShow] = useState<boolean>(false);

  const data = useMutationState({
    filters: { mutationKey: ALERT_CREATE_MUTATION_KEY },
    select: (mutation) => mutation.state.status,
  });

  const alertCreatingMutationStatus = data[data.length - 1];

  useEffect(() => {
    if (alertCreatingMutationStatus === "success") setIsShow(false);
  }, [alertCreatingMutationStatus]);

  return (
    <Dialog onOpenChange={setIsShow} open={isShow}>
      <DialogTrigger>
        <div className="flex items-center justify-center hover-select-effect w-full h-14 rounded-md">
          <Plus size={24} className="text-white" />
        </div>
      </DialogTrigger>
      <DialogContent>
        {alertCreatingMutationStatus === "pending" ? (
          <DialogLoader />
        ) : (
          <div className="flex flex-col gap-y-6 px-2 items-center w-full">
            <Typography variant="dialogTitle">Создание объявления</Typography>
            <div className="flex flex-col gap-1 w-full">
              <Typography textSize="large">Ограничения:</Typography>
              <Typography textColor="gray" textSize="medium">
                - название может содержать максимум 100 символов
              </Typography>
              <Typography textColor="gray" textSize="medium">
                - описание опционально и может содержать максимум 256 символов
              </Typography>
              <Typography textColor="gray" textSize="medium">
                - ссылка опциональна
              </Typography>
            </div>
            <AlertCreateForm />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
