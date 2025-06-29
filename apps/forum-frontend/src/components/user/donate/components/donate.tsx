import { reatomComponent } from "@reatom/npm-react";
import { donateTipTypeAtom, validateDonateTipCheckedAction } from "../models/donate-badge.model.ts";
import { lazy, Suspense } from "react";

const BuyDonateDialog = lazy(() => import("#components/modals/custom/components/buy-donate-modal.tsx").then(m => ({ default: m.BuyDonateModal })))

const DonateTip = reatomComponent(({ ctx }) => {
  const type = ctx.spy(donateTipTypeAtom)

  return (
    <Suspense>
      {type === 'not-buyed' ? <BuyDonateDialog /> : null}
    </Suspense>
  )
})

export const IconFasberryPlus = ({ size = 24, color = "currentColor", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* Гранёная малина или драгоценный камень */}
    <path d="M12 2L16 8l-4 10L8 8z" />
    {/* Плюс на фоне */}
    <path d="M12 9v6" />
    <path d="M9 12h6" />
  </svg>
);

export const UserDonate = reatomComponent<{ is_donate: boolean }>(({ ctx, is_donate }) => {
  if (!is_donate) return null;

  return (
    <>
      <DonateTip />
      <div
        className="w-fit cursor-pointer mx-1 items-center flex justify-center"
        onClick={() => validateDonateTipCheckedAction(ctx)}
      >
        <IconFasberryPlus size={24} className="" />
      </div>
    </>
  )
}, "UserDonate")