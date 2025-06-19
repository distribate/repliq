import { Avatar } from "#components/user/avatar/components/avatar.tsx"
import { Separator } from "@repo/ui/src/components/separator"
import { Skeleton } from "@repo/ui/src/components/skeleton"
import { Typography } from "@repo/ui/src/components/typography"
import dayjs from "@repo/lib/constants/dayjs-instance"
import { Button } from "@repo/ui/src/components/button"
import { SelectedReport } from "./admin-reports-selected-report"
import { reatomComponent } from "@reatom/npm-react"
import { onConnect } from "@reatom/framework"
import { GetReportsResponse, reportsAction, reportsAtom, selectReportAction } from "../models/reports.model"

const SelectReportButton = reatomComponent<{ id: GetReportsResponse[number]["id"] }>(({ ctx, id }) => {
  return (
    <Button
      variant="positive"
      onClick={() => selectReportAction(ctx, id)}
    >
      <Typography>
        Решить
      </Typography>
    </Button>
  )
}, "SelectReportButton")

const ReportItem = ({
  id, user_nickname, target_user_nickname, created_at, user_avatar, description, reason, report_type
}: GetReportsResponse[number]) => {
  return (
    <div className="flex items-center w-full p-2 bg-shark-900 hover:bg-shark-800 rounded-lg">
      <div className="flex items-center gap-2">
        <Avatar url={user_avatar} nickname={user_nickname} propWidth={54} propHeight={54} />
        <div className="flex flex-col">
          <Typography>{user_nickname}</Typography>
          <div className="flex items-center gap-2">
            <Typography>
              Причина: <span>{reason}</span>
            </Typography>
            <Separator orientation="vertical" />
            <Typography>Cоздана:
              <span>{dayjs(created_at).format("DD.MM.YYYY HH:mm")}</span>
            </Typography>
            <Separator orientation="vertical" />
            <Typography>
              Цель: <span>{target_user_nickname}</span>
            </Typography>
            <Separator orientation="vertical" />
            <Typography>
              Описание: <span>{description}</span>
            </Typography>
            <Separator orientation="vertical" />
            <Typography>
              Тип: <span>{report_type}</span>
            </Typography>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <SelectReportButton id={id} />
        </div>
      </div>
    </div>
  )
}

onConnect(reportsAtom, reportsAction)

export const AdminReportsList = reatomComponent(({ ctx }) => {
  const reports = ctx.spy(reportsAtom)

  if (ctx.spy(reportsAction.statusesAtom).isPending) return (
    <div className="flex flex-col gap-4 w-full h-full">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  )

  if (!reports) return null

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <SelectedReport />
      {reports.map(report => <ReportItem key={report.id} {...report} />)}
    </div>
  )
}, "AdminReportsList")