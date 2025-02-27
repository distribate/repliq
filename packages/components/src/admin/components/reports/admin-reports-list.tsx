import { Avatar } from "#user/components/avatar/components/avatar.tsx"
import { createQueryKey } from "@repo/lib/helpers/query-key-builder"
import { forumAdminClient } from "@repo/shared/api/forum-client"
import { Separator } from "@repo/ui/src/components/separator"
import { Skeleton } from "@repo/ui/src/components/skeleton"
import { Typography } from "@repo/ui/src/components/typography"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Suspense, useEffect, useState } from "react"
import dayjs from "@repo/lib/constants/dayjs-instance"
import { Dialog, DialogContent } from "@repo/ui/src/components/dialog"
import type { InferResponseType } from "hono/client"
import { Button } from "@repo/ui/src/components/button"

const client = forumAdminClient.admin["get-reports"].$get

type GetReportsResponse = InferResponseType<typeof client, 200>["data"]

async function getReports() {
  const res = await forumAdminClient.admin["get-reports"].$get()

  const data = await res.json()

  if ("error" in data) {
    return null
  }

  return data.data
}

const reportsQuery = () => useQuery({
  queryKey: createQueryKey("ui", ["reports"]),
  queryFn: getReports,
  refetchOnWindowFocus: false,
  refetchOnMount: false
})

type SelectedReportQuery = GetReportsResponse[number]

export const SELECTED_REPORT_QUERY_KEY = createQueryKey("ui", ["selected-report"])

const selectedReportQuery = () => useQuery<SelectedReportQuery, Error>({
  queryKey: SELECTED_REPORT_QUERY_KEY,
  refetchOnWindowFocus: false,
  refetchOnMount: false
})

const SelectedReport = () => {
  const qc = useQueryClient()
  const { data } = selectedReportQuery()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (data?.id && !open) {
      setOpen(true)
    }
  }, [data])

  const handleClose = (v: boolean) => {
    if (!v) {
      setOpen(false)
      qc.resetQueries({ queryKey: SELECTED_REPORT_QUERY_KEY })
    }

    setOpen(true)
  }

  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <div className="flex flex-col gap-4 items-center justify-center w-full h-full">
          <Typography variant="dialogTitle">
            Заявка #{data.id} от {data.user_nickname}
          </Typography>
          <div className="flex flex-col gap-2 w-full p-2">

          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export const AdminReportsList = () => {
  const qc = useQueryClient()
  const { data: reports } = reportsQuery()

  if (!reports) return null

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <SelectedReport />
      {/* @ts-ignore */}
      {reports.map(report => (
        <div key={report.id} className="flex items-center w-full p-2 bg-shark-900 hover:bg-shark-800 rounded-lg">
          <div className="flex items-center gap-2">
            <Suspense fallback={<Skeleton className="w-[54px] h-[54px]" />}>
              <Avatar nickname={report.user_nickname} propWidth={54} propHeight={54} />
            </Suspense>
            <div className="flex flex-col">
              <Typography>{report.user_nickname}</Typography>
              <div className="flex items-center gap-2">
                Причина: <Typography>{report.reason}</Typography>
                <Separator orientation="vertical" />
                Создана: <Typography>{dayjs(report.created_at).format("DD.MM.YYYY HH:mm")}</Typography>
                <Separator orientation="vertical" />
                Цель: <Typography>{report.target_user_nickname}</Typography>
                <Separator orientation="vertical" />
                Описание: <Typography>{report.description}</Typography>
                <Separator orientation="vertical" />
                Тип: <Typography>{report.report_type}</Typography>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* @ts-ignore */}
              <Button variant="positive" onClick={() => qc.setQueryData(SELECTED_REPORT_QUERY_KEY, report)}>
                <Typography>
                  Решить
                </Typography>
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}