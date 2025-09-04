import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Skeleton } from "@repo/ui/src/components/skeleton";
import { actionButtonVariant, DeleteButton } from "@repo/ui/src/components/detele-button.tsx";
import { reatomComponent } from "@reatom/npm-react";
import { AlertCircle } from "lucide-react";
import { updateVisibilityAction } from "#components/user/components/settings/main/models/update-global-preferences.model"
import { alertsAction } from "./alert-widget.model";
import { action, atom, AtomState } from "@reatom/core";
import { Dialog, DialogContent, DialogTitle } from "@repo/ui/src/components/dialog";
import { onConnect, sleep } from "@reatom/framework";
import { IconMaximize } from "@tabler/icons-react";

type AlertCardProps = NonNullable<AtomState<typeof alertsAction.dataAtom>>

const selectedAlertAtom = atom<AlertCardProps | null>(null, "selectedAlertAtom")
const alertDialogIsOpenAtom = atom(false, "alertDialogIsOpenAtom")

const openAlertDialog = action((ctx, alert: AlertCardProps) => {
  selectedAlertAtom(ctx, alert)
  alertDialogIsOpenAtom(ctx, true)
}, "openAlertDialog")

const closeAlertDialog = action(async (ctx) => {
  alertDialogIsOpenAtom(ctx, false)
  await ctx.schedule(() => sleep(200))
  selectedAlertAtom(ctx, null)
}, "handleAlertDialog")

const AlertDialog = reatomComponent(({ ctx }) => {
  const data = ctx.spy(selectedAlertAtom);

  if (!data) return null;

  return (
    <Dialog open={ctx.spy(alertDialogIsOpenAtom)} onOpenChange={v => closeAlertDialog(ctx)}>
      <DialogContent>
        <DialogTitle className="text-center">{data.title}</DialogTitle>
        <div className="flex flex-col p-2 w-full">
          {data.description}
        </div>
      </DialogContent>
    </Dialog>
  )
}, "AlertDialog")

const AlertCard = reatomComponent<AlertCardProps>(({ ctx, ...alert }) => {
  return (
    <div
      key={alert.id?.toString()}
      className="flex gap-1 group items-center justify-between
        w-full rounded-xl overflow-hidden max-h-18 p-2 md:p-4 bg-primary-color"
    >
      <div className="flex items-center gap-1 sm:gap-2 min-w-0">
        <div className="flex items-center justify-center aspect-square bg-shark-900 rounded-md">
          <AlertCircle size={18} className="text-shark-300 m-1 sm:m-2" />
        </div>
        <Typography className="text-shark-50 truncate text-sm md:text-lg" >
          {alert.title}
        </Typography>
      </div>
      <div className="flex relative gap-1 items-center justify-center">
        <div
          className={actionButtonVariant({ className: "bg-shark-800 h-8 hover:bg-shark-700" })}
          onClick={() => openAlertDialog(ctx, alert)}
        >
          <IconMaximize size={18} />
        </div>
        <DeleteButton size="small" onClick={() => updateVisibilityAction(ctx, "alerts")} />
      </div>
    </div>
  );
}, "AlertCard")

onConnect(alertsAction.dataAtom, alertsAction)

export const Alert = reatomComponent(({ ctx }) => {
  const data = ctx.spy(alertsAction.dataAtom)

  if (ctx.spy(alertsAction.statusesAtom).isPending) {
    return <Skeleton className="w-full h-18" />
  }

  if (!data) return null;

  return (
    <>
      <AlertDialog />
      <AlertCard {...data} />
    </>
  )
}, "Alert")