import { Dialog, DialogContent, DialogTrigger } from "@repo/ui/src/components/dialog"
import { Typography } from "@repo/ui/src/components/typography"
import { forwardRef, HTMLAttributes, ReactNode, RefAttributes, useEffect, useRef, useState } from "react"
import { useInView } from "react-intersection-observer"
import { useNavigate } from "@tanstack/react-router"
// @ts-ignore
import Chestplate from "@repo/assets/gifs/chestplate.gif"
import WildArmor from "@repo/assets/images/minecraft/wild_armor_trim_ыmithing_еemplate.webp"
import DragonBreath from "@repo/assets/images/minecraft/dragon_breath.webp"
import BustPainting from "@repo/assets/images/minecraft/bust_painting.webp"
import { PulsatingButton } from "@repo/ui/src/components/shiny-button.tsx"

type BuyDonateModalProps = {
  trigger: ReactNode | string
}

type DonateDialogFeatureItemProps = HTMLAttributes<HTMLDivElement> & {
  title: string,
  description: string,
  imageSrc: string
} & RefAttributes<HTMLDivElement>;

const DonateDialogFeatureItem = forwardRef<HTMLDivElement, DonateDialogFeatureItemProps>(({
  description, imageSrc, title, ...props
}, ref) => {
  return (
    <div ref={ref} className="flex items-start select-none py-2 px-6 justify-start rounded-md  hover:bg-shark-700 gap-4" {...props}>
      <div className="flex items-center justify-center rounded-lg p-2 bg-shark-400/40">
        <img draggable={false} src={imageSrc} alt="" width={40} height={40} />
      </div>
      <div className="flex flex-col gap-1 w-full">
        <Typography className="text-[18px]">
          {title}
        </Typography>
        <Typography className="text-[17px]" textColor="gray">
          {description}
        </Typography>
      </div>
    </div>
  )
})

const PushButton = () => {
  const navigate = useNavigate()

  return (
    <PulsatingButton
      onClick={() => navigate({ reloadDocument: true, href: "https://fasberry.su/donate#donate-list" })}
      className="w-full py-3"
    >
      <Typography className="text-[18px] font-semibold">
        Купить
      </Typography>
    </PulsatingButton>
  )
}

const DonateDialog = () => {
  const { ref, inView } = useInView({ threshold: 0.01 })
  console.log(inView)

  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="flex flex-col relative px-4 py-4 items-center gap-y-4 w-full">
        <div className="biloba-gradient opacity-30 w-full h-full z-[1] absolute left-0 right-0 top-0" />
        <img src={Chestplate} alt="" width={112} height={112} />
        <div className="flex flex-col">
          <Typography className="text-[20px] font-semibold text-center break-words">
            Получите больше возможностей.
          </Typography>
          <Typography className="text-[20px] font-semibold text-center break-words">
            Будьте аутентиком!
          </Typography>
        </div>
      </div>
      <div className="flex flex-col overflow-auto relative max-h-1/2 pt-4 bg-black/40 rounded-t-md gap-y-2 w-full">
        <DonateDialogFeatureItem
          title="Кастомный тег"
          description="Выделите себя среди других – получите уникальный тег рядом с ником."
          imageSrc={WildArmor}
        />
        <DonateDialogFeatureItem
          title="Расширенные возможности регионов"
          description="Меньше ограничений на владение территориями, участников и флаги – больше свободы в управлении регионами."
          imageSrc={DragonBreath}
        />
        <DonateDialogFeatureItem
          title="Бесконечный множитель опыта"
          description="Ускоряйте прокачку скиллов и профессий на сервере с вечным бонусом к опыту."
          imageSrc={BustPainting}
        />
        <DonateDialogFeatureItem
          title="Кастомизация профиля"
          description="Настройте свой профиль на форуме так, как хотите – сделайте его уникальным."
          imageSrc={BustPainting}
        />
        <DonateDialogFeatureItem
          title="Расширенная статистика"
          description="Отслеживайте подробную статистику своего профиля и анализируйте свой прогресс."
          imageSrc={BustPainting}
        />
        <DonateDialogFeatureItem
          title="Контроль над тредами"
          description="Настройте видимость своих тредов – только для друзей или эксклюзивно для донатеров."
          imageSrc={BustPainting}
        />
        <DonateDialogFeatureItem
          ref={ref}
          title="Дополнительные реакции"
          description="Выражайте больше эмоций! Возможность ставить до 3 реакций вместо 1 на посты и треды."
          imageSrc={BustPainting}
        />
        {inView && (
          <div className="relative py-4 px-6 flex items-center justify-center w-full">
            <PushButton />
          </div>
        )}
      </div>
      {!inView && (
        <div className="bg-[#191919] absolute bottom-0 py-4 px-6 flex items-center justify-center w-full">
          <PushButton />
        </div>
      )}
    </div>
  )
}

export const BuyDonateModal = ({
  trigger
}: BuyDonateModalProps) => {
  return (
    <Dialog>
      <DialogTrigger>
        {trigger}
      </DialogTrigger>
      <DialogContent className="p-0 max-w-xl">
        <DonateDialog />
      </DialogContent>
    </Dialog>
  )
}