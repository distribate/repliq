import { reatomAsync, withDataAtom, withStatusesAtom } from "@reatom/async"
import { action, atom, AtomState } from "@reatom/core"
import { sleep, withReset } from "@reatom/framework"
import { adminClient } from "#shared/api/forum-client"
import { toast } from "sonner"
import { validateResponse } from "#shared/api/validation"

export type Report = NonNullable<AtomState<typeof reportsAction.dataAtom>>[number]

export const reportsAction = reatomAsync(async (ctx) => {
  await ctx.schedule(() => sleep(140));

  return await ctx.schedule(async () => {
    const res = await adminClient.private["reports"].$get({}, { init: { signal: ctx.controller.signal } })
    return validateResponse<typeof res>(res);
  })
}, {
  name: "reportsAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      toast.error(e.message)
      console.error(e.message)
    }
  },
}).pipe(withStatusesAtom(), withDataAtom())

export const selectReportAction = action((ctx, id: Report["id"]) => {
  const reports = ctx.get(reportsAction.dataAtom)
  if (!reports) return;

  let target: Report | null = null;

  if (reports.length >= 1) {
    const finded = reports.find(report => report.id === id)

    if (finded) {
      target = finded
    }
  }

  if (!target) return;

  selectedReportDialogIsOpenAtom(ctx, true)
  selectedReportAtom(ctx, target)
})

export const selectedReportAtom = atom<Report | null>(null, "selectedReport").pipe(withReset())
export const selectedReportDialogIsOpenAtom = atom(false, "selectedReportDialogIsOpen")

selectedReportDialogIsOpenAtom.onChange(async (ctx, state) => {
  if (!state) {
    await ctx.schedule(() => sleep(100))
    selectedReportAtom.reset(ctx)
  }
})