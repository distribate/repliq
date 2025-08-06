import dayjs from "dayjs";
import { Avatar } from "#components/user/avatar/components/avatar.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { reatomComponent } from "@reatom/npm-react";
import { DeleteButton } from "@repo/ui/src/components/detele-button.tsx";
import { alertsResource } from "#components/layout/components/widgets/alert/alert-widget.model.ts";
import { Plus } from "lucide-react";
import { AlertCreateForm } from "#components/admin/configs/alerts/components/create-alert/components/create-alert-form";
import { DynamicModal } from "#components/modals/dynamic-modal/components/dynamic-modal";
import { AlertEntity } from "@repo/types/entities/entities-type.ts";
import { PenLine } from "lucide-react";
import { Button } from "@repo/ui/src/components/button.tsx";
import { AlertUpdateForm } from "#components/admin/configs/alerts/components/create-alert/components/update-alert-form";

const AlertItemEditButton = reatomComponent<Omit<AlertEntity, "created_at" | "creator">>(({ ...currentAlert }) => {
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

const AlertsAddButton = () => {
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


const AlertItemDeleteButton = ({ id }: Pick<AlertEntity, "id">) => {
  return <DeleteButton title="Удалить" disabled={false} onClick={() => {}} />;
};

export const Alerts = reatomComponent(({ ctx }) => {
  const alert = ctx.spy(alertsResource.dataAtom)?.data[0];

  if (!alert) return null;

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex h-14 bg-shark-900 rounded-md p-2 justify-between items-center">
          <div className="flex items-center gap-2">
            <Avatar nickname={alert.creator.nickname} url={alert.creator.avatar} propWidth={36} propHeight={36} />
            <div className="flex flex-col">
              <Typography>{alert.title.slice(0, 64)}</Typography>
              <Typography textSize="small" className="text-shark-300">
                опубликовано{" "}
                {dayjs(alert.created_at).format("HH:mm:ss DD.MM.YYYY")}
              </Typography>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-8">
            <AlertItemEditButton {...alert} />
            <AlertItemDeleteButton id={alert.id} />
          </div>
        </div>
        <AlertsAddButton />
      </div>
    </>
  );
}, "Alerts");
