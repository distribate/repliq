import { reatomResource, withCache, withStatusesAtom } from "@reatom/async"
import { action, atom } from "@reatom/core"
import { withReset } from "@reatom/framework"
import { forumAdminClient } from "@repo/shared/api/forum-client"
import type { InferResponseType } from "hono/client"

const client = forumAdminClient.admin["get-reports"].$get

export type GetReportsResponse = InferResponseType<typeof client, 200>["data"]
type SelectedReport = GetReportsResponse[number] | null

export const reportsAtom = atom<GetReportsResponse | null>(null, 'reports')

async function getReports() {
  const res = await forumAdminClient.admin["get-reports"].$get()
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

export const selectReportAction = action((ctx, id: GetReportsResponse[number]["id"]) => {
  const target = ctx.get(reportsAtom)?.find(report => report.id === id)

  if (!target) return;

  selectedReportDialogIsOpenAtom(ctx, true)
  selectedReportAtom(ctx, target)
})

export const selectedReportAtom = atom<SelectedReport>(null, "selectedReport").pipe(withReset())
export const selectedReportDialogIsOpenAtom = atom(false, "selectedReportDialogIsOpen")

selectedReportDialogIsOpenAtom.onChange((ctx, value) => 
  !value && selectedReportAtom.reset(ctx)
)