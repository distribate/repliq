import { Typography } from "@repo/ui/src/components/typography.tsx";
import { UserDonateBadge } from "./donate-badge.tsx";
import { DonateVariantsEnum } from '@repo/types/entities/entities-type.ts';
import { DONATE_GROUPS } from '@repo/shared/constants/donate-aliases.ts';
import { reatomComponent } from "@reatom/npm-react";
import { donateTipIsCheckedAtom, validateDonateTipCheckedAction } from "../models/donate-badge.model.ts";
import { lazy, Suspense } from "react";

const getDonateTitle = (donate: DonateVariantsEnum) => DONATE_GROUPS[donate];

const DonateTipPopover = lazy(() => import("./donate-tip-popover.tsx").then(m => ({ default: m.DonateTipPopover })))

const DonateTip = reatomComponent(({ ctx }) => {
  if (ctx.spy(donateTipIsCheckedAtom)) return null;

  return (
    <Suspense>
      <DonateTipPopover />
    </Suspense>
  )
})

export const UserDonate = reatomComponent<{ donate: DonateVariantsEnum }>(({ ctx, donate }) => {
  const title = getDonateTitle(donate);

  return (
    <>
      <DonateTip />
      <UserDonateBadge variant={donate} className="w-fit" onClick={() => validateDonateTipCheckedAction(ctx)}>
        <Typography textColor="shark_white" className="leading-3 font-semibold sm:leading-5 text-[12px] sm:text-[14px]">
          {title}
        </Typography>
      </UserDonateBadge>
    </>
  )
}, "UserDonate")