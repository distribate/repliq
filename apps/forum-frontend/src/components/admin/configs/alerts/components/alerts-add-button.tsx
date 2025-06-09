import { Plus } from "lucide-react";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { AlertCreateForm } from "#components/admin/configs/alerts/components/create-alert/components/create-alert-form";
import { DynamicModal } from "#components/modals/dynamic-modal/components/dynamic-modal";

export const AlertsAddButton = () => {
  return (
    <DynamicModal
      isPending={false}
      withLoader
      trigger={
        < div className="flex items-center justify-center hover-select-effect w-full h-14 rounded-md" >
          <Plus size={24} className="text-white" />
        </div >
      }
      content={
        < div className="flex flex-col gap-y-6 px-2 items-center w-full" >
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
        </div >
      }
    />
  );
};
