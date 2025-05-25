import { AlertEntity } from "@repo/types/entities/entities-type.ts";
import { PenLine } from "lucide-react";
import { Button } from "@repo/ui/src/components/button.tsx";
import { AlertUpdateForm } from "#components/forms/create-alert/components/update-alert-form.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { DynamicModal } from "#components/modals/dynamic-modal/components/dynamic-modal";
import { reatomComponent } from "@reatom/npm-react";

export const AlertItemEditButton = reatomComponent<Omit<AlertEntity, "created_at" | "creator">>(({ ctx, ...currentAlert}) => {
  return (
    <DynamicModal
      autoClose
      withLoader
      isPending={false}
      trigger={
        <Button
          title="Редактировать"
          className="h-7 w-7 hover:bg-shark-600 bg-shark-700/70 rounded-md duration-300"
        >
          <PenLine size={18} className="text-shark-300" />
        </Button>
      }
      content={
        <div className="flex flex-col gap-y-6 px-2 items-center w-full">
        <Typography variant="dialogTitle">Обновление объявления</Typography>
        <AlertUpdateForm {...currentAlert} />
      </div>
      }
    />
  );
}, "AlertItemEditButton")