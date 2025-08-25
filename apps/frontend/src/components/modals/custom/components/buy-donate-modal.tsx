import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@repo/ui/src/components/dialog"
import { Typography } from "@repo/ui/src/components/typography"
import { ReactNode } from "react"
import { atom } from "@reatom/core"
import { reatomComponent } from "@reatom/npm-react"
import { DONATE_ICON } from "#components/user/components/donate/components/donate"
import { CustomLink } from "#shared/components/link"
import { DONATE_FEATURES, URL_FOR_REPLIQ } from "#shared/constants/donate"

const DonateDialogFeatureItem = ({ description, icon: Icon, title }: typeof DONATE_FEATURES[number]) => {
  return (
    <div className="flex items-start select-none py-2 px-6 justify-start rounded-md  hover:bg-shark-700 gap-4">
      <div className="flex items-center justify-center rounded-lg p-2 bg-shark-400/40">
        <Icon size={40} />
      </div>
      <div className="flex flex-col w-full">
        <Typography textSize="large">{title}</Typography>
        <Typography textSize="medium" textColor="gray">{description}</Typography>
      </div>
    </div>
  )
}

const DonateDialog = () => {
  return (
    <div className="flex flex-col relative items-center w-full h-full">
      <div className="flex flex-col relative px-4 py-6 items-center gap-4 w-full">
        <div className="biloba-gradient opacity-30 w-full h-full z-[1] absolute left-0 right-0 top-0" />
        <span className="text-6xl select-none">{DONATE_ICON}</span>
        <div className="flex flex-col">
          <span className="text-xl text-center font-semibold">Repliq+</span>
          <Typography className="text-lg text-center break-words">
            Получите доступ к расширенным функциям и возможностям с Repliq+
          </Typography>
        </div>
      </div>
      <div className="flex flex-col overflow-auto relative max-h-1/2 pt-4 bg-black/40 rounded-t-md gap-y-2 w-full">
        {DONATE_FEATURES.map((feature, idx) => (
          <DonateDialogFeatureItem key={idx} {...feature} />
        ))}
      </div>
      <div className="bg-[#191919] sticky bottom-0 py-4 px-6 flex items-center justify-center w-full">
        <DialogClose className="w-full">
          <CustomLink
            to={URL_FOR_REPLIQ}
            className="flex items-center justify-center w-full py-2 bg-green-600 px-6 rounded-lg"
          >
            <Typography className="text-xl font-semibold">
              Приобрести
            </Typography>
          </CustomLink>
        </DialogClose>
      </div>
    </div>
  )
}

export const buyDonateModalIsOpenAtom = atom(false, "buyDonateModalIsOpen")

export const BuyDonateModal = reatomComponent<{ trigger?: ReactNode | string }>(({ ctx, trigger }) => {
  return (
    <Dialog
      open={ctx.spy(buyDonateModalIsOpenAtom)}
      onOpenChange={v => buyDonateModalIsOpenAtom(ctx, v)}
    >
      {trigger && <DialogTrigger>{trigger}</DialogTrigger>}
      <DialogContent className="p-0 sm:max-w-xl">
        <DonateDialog />
      </DialogContent>
    </Dialog>
  )
}, "BuyDonateModal")