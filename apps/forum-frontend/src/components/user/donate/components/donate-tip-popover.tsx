import { Dialog, DialogClose, DialogContent } from "@repo/ui/src/components/dialog"
import { checkDonateTipAction, donateTipPopoverIsOpenAtom } from "../models/donate-badge.model"
import { reatomComponent } from "@reatom/npm-react"
import { Button } from "@repo/ui/src/components/button"
import { Typography } from "@repo/ui/src/components/typography"
import DonateTipPreview from "@repo/assets/images/bzzvanet-omagadd.jpg"

export const DonateTipPopover = reatomComponent(({ ctx }) => {
  return (
    <Dialog open={ctx.spy(donateTipPopoverIsOpenAtom)} onOpenChange={(value) => checkDonateTipAction(ctx, value)}>
      <DialogContent className="!max-w-80">
        <div className="flex flex-col items-center gap-y-2 w-full">
          <Typography variant="dialogTitle">
            Возможности привилегий
          </Typography>
          <div className="flex flex-col gap-y-4 p-4 w-full items-center">
            <img src={DonateTipPreview} alt="" width={400} height={400} className="w-full rounded-lg" draggable={false} />
            <div className="flex flex-col w-full">
              <Typography textSize="large" textColor="shark_white">
                Привилегии дают доступ к большим возможностям на форуме и в самой игре
                (cм.&nbsp;
                <a href="https://fasberry.su/shop" target="_blank" rel="noreferrer" className="cursor-pointer font-semibold">
                  привилегии
                </a>
                ).
              </Typography>
            </div>
            <div className="flex items-center justify-end w-full">
              <DialogClose asChild>
                <Button variant="positive">
                  <Typography textSize="medium">
                    Понятно
                  </Typography>
                </Button>
              </DialogClose>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}, "DonateTipPopover")