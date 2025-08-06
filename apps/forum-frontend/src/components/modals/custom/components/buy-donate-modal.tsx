import { Dialog, DialogContent, DialogTrigger } from "@repo/ui/src/components/dialog"
import { Typography } from "@repo/ui/src/components/typography"
import { ReactNode } from "react"
import { PulsatingButton } from "@repo/ui/src/components/shiny-button.tsx"
import { IconBrandThreads, IconDeviceDesktopAnalytics, IconMoodSpark, IconPalette, TablerIcon } from "@tabler/icons-react"
import { atom } from "@reatom/core"
import { reatomComponent } from "@reatom/npm-react"
import { DonateIcon } from "#components/user/donate/components/donate"

type BuyDonateModalProps = { trigger?: ReactNode | string }

type DonateDialogFeatureItemProps = {
  title: string, description: string, icon: TablerIcon
}

const DonateDialogFeatureItem = ({ description, icon: Icon, title }: DonateDialogFeatureItemProps) => {
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

const DONATE_FEATURES = [
  {
    title: "Кастомизация профиля",
    description: "Настройте свой профиль на форуме так, как хотите – сделайте его уникальным.",
    icon: IconPalette
  },
  {
    title: "Расширенная статистика",
    description: "Отслеживайте подробную статистику своего профиля и анализируйте свой прогресс.",
    icon: IconDeviceDesktopAnalytics
  },
  {
    title: "Контроль над тредами",
    description: "Настройте видимость своих тредов – только для друзей или эксклюзивно для донатеров.",
    icon: IconBrandThreads
  },
  {
    title: "Дополнительные реакции",
    description: "Выражайте больше эмоций! Возможность ставить до 3 реакций вместо 1 на посты и треды.",
    icon: IconMoodSpark
  },
]

const DonateDialog = () => {
  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="flex flex-col relative px-4 py-4 items-center gap-y-4 w-full">
        <div className="biloba-gradient opacity-30 w-full h-full z-[1] absolute left-0 right-0 top-0" />
        <DonateIcon />
        <div className="flex flex-col">
          <span className="text-xl text-center font-semibold">Repliq+</span>
          <Typography className="text-lg text-center break-words">
            Откройте для себя больше возможностей на форуме и в игре!
          </Typography>
        </div>
      </div>
      <div className="flex flex-col overflow-auto relative max-h-1/2 pt-4 bg-black/40 rounded-t-md gap-y-2 w-full">
        {DONATE_FEATURES.map((feature, idx) => (
          <DonateDialogFeatureItem key={idx} title={feature.title} description={feature.description} icon={feature.icon} />
        ))}
      </div>
      <div className="bg-[#191919] sticky bottom-0 py-4 px-6 flex items-center justify-center w-full">
        <a href="/store" target="_blank" rel="noreferrer" className="w-full">
          <PulsatingButton className="w-full py-3">
            <Typography className="text-[18px] font-semibold">
              Приобрести
            </Typography>
          </PulsatingButton>
        </a>
      </div>
    </div>
  )
}

export const buyDonateModalIsOpenAtom = atom(false, "buyDonateModalIsOpen")

export const BuyDonateModal = reatomComponent<BuyDonateModalProps>(({ ctx, trigger }) => {
  return (
    <Dialog
      open={ctx.spy(buyDonateModalIsOpenAtom)}
      onOpenChange={v => buyDonateModalIsOpenAtom(ctx, v)}
    >
      {trigger && <DialogTrigger>{trigger}</DialogTrigger>}
      <DialogContent className="p-0 max-w-xl">
        <DonateDialog />
      </DialogContent>
    </Dialog>
  )
}, "BuyDonateModal")