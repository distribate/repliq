import dayjs from "@repo/shared/constants/dayjs-instance"
import { Avatar } from "#components/user/components/avatar/components/avatar"
import { Typography } from "@repo/ui/src/components/typography"
import { Button } from "@repo/ui/src/components/button"
import { reatomComponent } from "@reatom/npm-react"
import { onConnect } from "@reatom/framework"
import { Report, reportsAction, selectReportAction } from "../models/reports.model"
import { SectionSkeleton } from "#components/templates/components/section-skeleton"
import { UserNickname } from "#components/user/components/name/nickname"
import { Dialog, DialogContent } from "@repo/ui/src/components/dialog"
import { selectedReportAtom, selectedReportDialogIsOpenAtom } from "../models/reports.model"
import { ContentNotFound } from "#components/templates/components/content-not-found"

const SelectedReport = reatomComponent(({ ctx }) => {
  const report = ctx.spy(selectedReportAtom)
  if (!report) return null;

  return (
    <Dialog
      open={ctx.spy(selectedReportDialogIsOpenAtom)}
      onOpenChange={(v) => selectedReportDialogIsOpenAtom(ctx, v)}
    >
      <DialogContent>
        <div className="flex flex-col gap-4 items-center justify-center w-full h-full">
          <Typography variant="dialogTitle">
            Заявка #{report.id} от {report.nickname}
          </Typography>
          <div className="flex flex-col gap-2 w-full p-2">
            {report.reason} from {report.nickname} to {report.target_user_nickname}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}, "SelectedReport")

const SelectReportButton = reatomComponent<{ id: Report["id"] }>(({ ctx, id }) => {
  return (
    <Button
      className="bg-shark-50 px-4 py-1"
      onClick={() => selectReportAction(ctx, id)}
    >
      <Typography className="text-base font-semibold text-shark-950">
        Подробнее
      </Typography>
    </Button>
  )
}, "SelectReportButton")

const ReportItem = ({
  id, nickname, target_user_nickname, created_at, user_avatar, description, reason, report_type
}: Report) => {
  return (
    <div className="flex  flex-col w-full gap-2 p-2 bg-shark-900/40 rounded-lg">
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <Avatar
          url={user_avatar}
          nickname={nickname}
          propWidth={54}
          propHeight={54}
          className="min-h-[54px] h-[54px] max-h-[54px] aspect-square"
        />
        <div className="flex flex-col justify-center sm:justify-start">
          <UserNickname nickname={nickname} />
          <Typography className="hidden sm:inline text-shark-300 text-base">
            Cоздана: <span>{dayjs(created_at).format("DD.MM.YYYY HH:mm")}</span>
          </Typography>
        </div>
      </div>
      <div className="flex flex-col items-center sm:items-start justify-between">
        <Typography>
          Причина: {reason}
        </Typography>
        <Typography>
          Цель: {target_user_nickname}
        </Typography>
        <Typography>
          Тип: {report_type}
        </Typography>
      </div>
      <div className="flex flex-col sm:flex-row items-center w-full justify-end gap-2">
        <SelectReportButton id={id} />
        <Button
          className="bg-red-700 px-4 py-1"
        >
          <Typography className="text-base font-semibold text-shark-50">
            Отказать
          </Typography>
        </Button>
      </div>
    </div>
  )
}

onConnect(reportsAction.dataAtom, reportsAction)

export const AdminReports = reatomComponent(({ ctx }) => {
  const data = ctx.spy(reportsAction.dataAtom)

  if (ctx.spy(reportsAction.statusesAtom).isPending) {
    return <SectionSkeleton />
  }

  if (!data) {
    return <ContentNotFound title="Активных репортов нет" />
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 auto-rows-auto gap-2 w-full">
      <SelectedReport />
      {data.map(report => <ReportItem key={report.id} {...report} />)}
    </div>
  )
}, "AdminReports")