import { reatomAsync, withDataAtom, withStatusesAtom } from "@reatom/async"
import { action, atom } from "@reatom/core"
import { withReset } from "@reatom/framework"
import { forumAdminClient } from "#shared/forum-client"
import { ReportType } from "@repo/types/db/forum-database-types"
import { toast } from "sonner"

type SelectedReport = {
  user_avatar: string | null;
  user_nickname: string;
  created_at: string;
  description: string | null;
  id: string;
  reason: "dont-like" | "offensive" | "spam";
  report_type: ReportType | null;
  reported_item: any;
  target_user_nickname: string;
}

export type GetReportsResponse = SelectedReport[]

async function getReports(init?: RequestInit) {
  const res = await forumAdminClient.private["get-reports"].$get({}, { init })
  const data = await res.json()
  if ("error" in data) throw new Error(data.error)

  return data.data
}

export const reportsAction = reatomAsync(async (ctx) => {
  // @ts-expect-error
  return await ctx.schedule(() => getReports({ signal: ctx.controller.signal }))
}, {
  name: "reportsAction",
  onReject: (_, e) => {
    if (e instanceof Error) toast.error(e.message)
  },
}).pipe(withStatusesAtom(), withDataAtom())

export const selectReportAction = action((ctx, id: SelectedReport["id"]) => {
  const reports = ctx.get(reportsAction.dataAtom)
  if (!reports) return;

  let target: SelectedReport | null = null;

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

export const selectedReportAtom = atom<SelectedReport | null>(null, "selectedReport").pipe(withReset())
export const selectedReportDialogIsOpenAtom = atom(false, "selectedReportDialogIsOpen")

selectedReportDialogIsOpenAtom.onChange((ctx, value) =>
  !value && selectedReportAtom.reset(ctx)
)