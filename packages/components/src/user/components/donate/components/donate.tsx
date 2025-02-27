import { Typography } from "@repo/ui/src/components/typography.tsx";
import { UserDonateBadge } from "./donate-badge.tsx";
import { DonateVariantsEnum } from '@repo/types/entities/entities-type.ts';
import { DONATE_GROUPS } from '@repo/shared/constants/donate-aliases.ts';
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { getCookieByKey } from "@repo/lib/helpers/get-cookie-by-key.ts";
import { Button } from "@repo/ui/src/components/button.tsx";
import { Dialog, DialogContent } from "@repo/ui/src/components/dialog.tsx";
import DonateTipPreview from "@repo/assets/images/bzzvanet-omagadd.jpg"

const getDonateTitle = (donate: DonateVariantsEnum) => DONATE_GROUPS[donate];

type UserDonateProps = {
  donate: DonateVariantsEnum
}

const DonateTipPopover = () => {
  const [open, setOpen] = useState<boolean>(true);
  const isShowed = getCookieByKey("donate_tip");
  const navigate = useNavigate()

  if (isShowed === 'hide') return null;

  const close = () => {
    setOpen(false);
    document.cookie = "donate_tip=hide"
  }

  return (
    <Dialog open={open} onOpenChange={(v) => close()}>
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
                <span
                  onClick={() => navigate({ href: "https://fasberry.su/shop", reloadDocument: true })}
                  className="cursor-pointer font-semibold"
                >
                  привилегии
                </span>
                ).
              </Typography>
            </div>
            <div className="flex items-center justify-end w-full">
              <Button variant="positive" onClick={close}>
                <Typography textSize="medium">
                  Понятно
                </Typography>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export const UserDonate = ({
  donate
}: UserDonateProps) => {
  const [clicked, setClicked] = useState<boolean>(false);

  const title = getDonateTitle(donate);

  return (
    <>
      {clicked && <DonateTipPopover />}
      <div onClick={_ => setClicked(true)}>
        <UserDonateBadge variant={donate} className="w-fit">
          <Typography textColor="shark_white" font="minecraft" className="text-[14px]">
            {title}
          </Typography>
        </UserDonateBadge>
      </div>
    </>
  )
};