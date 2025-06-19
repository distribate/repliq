import { reatomComponent } from "@reatom/npm-react";
import { donateTipTypeAtom, validateDonateTipCheckedAction } from "../models/donate-badge.model.ts";
import { lazy, Suspense } from "react";
import { IconSparkles } from "@tabler/icons-react";

const BuyDonateDialog = lazy(() => import("#components/modals/custom/components/buy-donate-modal.tsx").then(m => ({ default: m.BuyDonateModal })))

const DonateTip = reatomComponent(({ ctx }) => {
  const type = ctx.spy(donateTipTypeAtom)

  return (
    <Suspense>
      {type === 'not-buyed' ? <BuyDonateDialog /> : null}
    </Suspense>
  )
})

export const UserDonate = reatomComponent<{ is_donate: boolean }>(({ ctx, is_donate }) => {
  if (!is_donate) return null;

  return (
    <>
      <DonateTip />
      <div
        className="w-fit cursor-pointer mx-1 items-center flex justify-center"
        onClick={() => validateDonateTipCheckedAction(ctx)}
      >
        <IconSparkles size={24} className="fill-gold-500 text-gold-500" />
      </div>
    </>
  )
}, "UserDonate")