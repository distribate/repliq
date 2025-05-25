import { Dialog, DialogContent } from "@repo/ui/src/components/dialog"
import { Typography } from "@repo/ui/src/components/typography"
import { reatomComponent } from "@reatom/npm-react"
import { selectedReportAtom, selectedReportDialogIsOpenAtom } from "../models/reports.model"

export const SelectedReport = reatomComponent(({ ctx }) => {
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
            Заявка #{report.id} от {report.user_nickname}
          </Typography>
          <div className="flex flex-col gap-2 w-full p-2">
            {report.reason} from {report.target_user_nickname} to {report.user_nickname}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}, "SelectedReport")