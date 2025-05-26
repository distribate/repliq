import { Typography } from "@repo/ui/src/components/typography.tsx";
import { UserDonateBadge } from "./donate-badge.tsx";
import { DonateVariantsEnum } from '@repo/types/entities/entities-type.ts';
import { DONATE_GROUPS } from '@repo/shared/constants/donate-aliases.ts';
import { Button } from "@repo/ui/src/components/button.tsx";
import { Dialog, DialogClose, DialogContent } from "@repo/ui/src/components/dialog.tsx";
import DonateTipPreview from "@repo/assets/images/bzzvanet-omagadd.jpg"
import { action, atom } from "@reatom/core";
import { withLocalStorage } from "@reatom/persist-web-storage";
import { reatomComponent } from "@reatom/npm-react";

const getDonateTitle = (donate: DonateVariantsEnum) => DONATE_GROUPS[donate];

type UserDonateProps = {
  donate: DonateVariantsEnum
}

const donateTipIsCheckedAtom = atom(false, "donateTipIsChecked").pipe(
  withLocalStorage("donate-tip")
)

const donateTipPopoverIsOpenAtom = atom(false, "donateTipPopoverIsOpen")

const validateDonateTipCheckedAction = action((ctx) => {
  const donateTipIsChecked = ctx.get(donateTipIsCheckedAtom)

  if (donateTipIsChecked) return;

  donateTipPopoverIsOpenAtom(ctx, true)
})

const checkDonateTipAction = action((ctx, value: boolean) => {
  if (!value) {
    donateTipIsCheckedAtom(ctx, true)
    donateTipPopoverIsOpenAtom(ctx, false)
  }
})

const DonateTipPopover = reatomComponent(({ ctx }) => {
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

export const UserDonate = reatomComponent<UserDonateProps>(({ ctx, donate }) => {
  const title = getDonateTitle(donate);

  return (
    <>
      <DonateTipPopover />
      <UserDonateBadge
        variant={donate}
        className="w-fit"
        onClick={() => validateDonateTipCheckedAction(ctx)}
      >
        <Typography textColor="shark_white" font="minecraft" className="leading-3 sm:leading-4 text-[12px] sm:text-[14px]">
          {title}
        </Typography>
      </UserDonateBadge>
    </>
  )
}, "UserDonate")