import { reatomResource, withCache, withStatusesAtom } from "@reatom/async"
import { action, atom, AtomState } from "@reatom/core"
import { withReset } from "@reatom/framework"
import { forumAdminClient } from "@repo/shared/api/forum-client"
import { ReportType } from "@repo/types/db/forum-database-types"

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

export const reportsAtom = atom<SelectedReport[] | null>(null, 'reports')

async function getReports() {
  const res = await forumAdminClient.private["get-reports"].$get()
  const data = await res.json()

  if ("error" in data) return null

  return data.data
}

export const reportsAction = reatomResource(async (ctx) => {
  return await ctx.schedule(async () => {
    const res = await getReports()

    reportsAtom(ctx, res)
  })
}).pipe(withStatusesAtom(), withCache())

export const selectReportAction = action((ctx, id: SelectedReport["id"]) => {
  const reports = ctx.get(reportsAtom)
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