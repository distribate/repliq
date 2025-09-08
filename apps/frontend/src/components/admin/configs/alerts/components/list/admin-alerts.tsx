import dayjs from "@repo/shared/constants/dayjs-instance";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { reatomComponent } from "@reatom/npm-react";
import { DeleteButton } from "@repo/ui/src/components/detele-button.tsx";
import { alertsAction, AlertsPayloadData } from "#shared/models/alerts.model";
import { CreateAlertForm } from "#components/admin/configs/alerts/components/create-alert/create-alert-form";
import { DynamicModal } from "#shared/components/dynamic-modal";
import { PenLine } from "lucide-react";
import { Button } from "@repo/ui/src/components/button.tsx";
import { AlertUpdateForm } from "#components/admin/configs/alerts/components/create-alert/update-alert-form";
import { IconPlus } from "@tabler/icons-react";
import { SectionSkeleton } from "#components/templates/components/section-skeleton";
import { ContentNotFound } from "#components/templates/components/content-not-found";
import { onConnect } from "@reatom/framework";

type Alert = AlertsPayloadData[number]

type AlertEditButtonProps = Omit<Alert, "created_at" | "creator">

const AlertEditButton = reatomComponent<AlertEditButtonProps>((currentAlert) => {
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
        <div className="flex items-center justify-center hover-select-effect w-full h-14 rounded-md" >
          <IconPlus size={24} className="text-white" />
        </div >
      }
      content={
        <div className="flex flex-col gap-y-6 px-2 items-center w-full" >
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
          <CreateAlertForm />
        </div >
      }
    />
  );
};

const AlertItem = reatomComponent<Alert>(({ ctx, ...alert }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex h-14 bg-shark-900 rounded-md p-2 justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <Typography>{alert.title.slice(0, 64)}</Typography>
            <Typography textSize="small" className="text-shark-300">
              опубликовано{" "}
              {dayjs(alert.created_at).format("HH:mm:ss DD.MM.YYYY")}
            </Typography>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-8">
          <AlertEditButton {...alert} />
          <DeleteButton
            title="Удалить"
            disabled={false}
            onClick={() => { }}
          />
        </div>
      </div>
      <AlertsAddButton />
    </div>
  )
}, "AlertItem")

onConnect(alertsAction.dataAtom, alertsAction)

export const AdminAlerts = reatomComponent(({ ctx }) => {
  const data = ctx.spy(alertsAction.dataAtom)?.data

  if (ctx.spy(alertsAction.statusesAtom).isPending) {
    return <SectionSkeleton />
  }

  if (!data) {
    return <ContentNotFound title="Объявлений нет" />
  }

  return (
    data.map(alert => <AlertItem key={alert.id} {...alert} />)
  );
}, "AdminAlerts");