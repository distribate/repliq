import { AlertsPayloadData, getAlerts } from "#shared/models/alerts.model"
import { reatomAsync, withCache, withDataAtom, withStatusesAtom } from "@reatom/async"
import { action, atom } from "@reatom/core"
import { sleep } from "@reatom/framework"

type Alert = AlertsPayloadData[number]

export const selectedAlertAtom = atom<Alert | null>(null, "selectedAlertAtom")
export const alertDialogIsOpenAtom = atom(false, "alertDialogIsOpenAtom")

export const openAlertDialog = action((ctx, alert: Alert) => {
  selectedAlertAtom(ctx, alert)
  alertDialogIsOpenAtom(ctx, true)
}, "openAlertDialog")

export const closeAlertDialog = action(async (ctx) => {
  alertDialogIsOpenAtom(ctx, false)
  await ctx.schedule(() => sleep(300))
  selectedAlertAtom(ctx, null)
}, "handleAlertDialog")

export const alertAction = reatomAsync(async (ctx) => {
  return await ctx.schedule(() => getAlerts(
    { ascending: false, limit: 1 },
    { signal: ctx.controller.signal }
  ))
}, "alertAction").pipe(withDataAtom(), withStatusesAtom(), withCache({ swr: false }))
