import { reatomComponent } from "@reatom/npm-react";
import { donateTipTypeAtom, validateDonateTipCheckedAction } from "../models/donate-badge.model.ts";
import { BuyDonateModal } from "#components/modals/custom/components/buy-donate-modal.tsx"

const DonateTip = reatomComponent(({ ctx }) => {
  const type = ctx.spy(donateTipTypeAtom)
  return type === 'not-buyed' ? <BuyDonateModal /> : null
}, "DonateTip")

export const DonateIcon = () => <span>🌟</span>

export const UserDonate = reatomComponent<{ is_donate: boolean }>(({ ctx, is_donate }) => {
  if (!is_donate) return null;

  return (
    <>
      <DonateTip />
      <div
        className="w-fit cursor-pointer mx-1 items-center flex justify-center"
        onClick={() => validateDonateTipCheckedAction(ctx)}
      >
        <DonateIcon/>
      </div>
    </>
  )
}, "UserDonate")