import { Dialog, DialogContent, DialogTrigger } from "@repo/ui/src/components/dialog"
import { Typography } from "@repo/ui/src/components/typography"
import { ReactNode } from "react"
// @ts-ignore
import Chestplate from "@repo/assets/gifs/chestplate.gif"
import WildArmor from "@repo/assets/images/minecraft/wild_armor_trim_ыmithing_еemplate.webp"
import DragonBreath from "@repo/assets/images/minecraft/dragon_breath.webp"
import BustPainting from "@repo/assets/images/minecraft/bust_painting.webp"
import { PulsatingButton } from "@repo/ui/src/components/shiny-button.tsx"
import FutureChicken from "@repo/assets/images/minecraft/future_chicken_mini.png"
import SeekingDolphin from "@repo/assets/images/minecraft/seeking_dolphin.png"
import Salt from "@repo/assets/images/minecraft/salt.webp"
import PlayerTable from "@repo/assets/images/minecraft/player_table.png"
import { MINECRAFT_MAP_SITE_DOMAIN } from "@repo/shared/constants/origin-list"

type BuyDonateModalProps = {
  trigger: ReactNode | string
}

type DonateDialogFeatureItemProps = {
  title: string, description: string, image: string
}

const DonateDialogFeatureItem = ({ description, image, title }: DonateDialogFeatureItemProps) => {
  return (
    <div className="flex items-start select-none py-2 px-6 justify-start rounded-md  hover:bg-shark-700 gap-4">
      <div className="flex items-center justify-center rounded-lg p-2 bg-shark-400/40">
        <img draggable={false} src={image} alt="" width={40} height={40} />
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
    title: "Кастомный тег",
    description: "Выделите себя среди других – получите уникальный тег рядом с ником.",
    image: WildArmor
  },
  {
    title: "Расширенные возможности регионов",
    description: "Меньше ограничений на владение территориями, участников и флаги – больше свободы в управлении регионами.",
    image: DragonBreath
  },
  {
    title: "Бесконечный множитель опыта",
    description: "Ускоряйте прокачку скиллов и профессий на сервере с вечным бонусом к опыту.",
    image: BustPainting
  },
  {
    title: "Кастомизация профиля",
    description: "Настройте свой профиль на форуме так, как хотите – сделайте его уникальным.",
    image: SeekingDolphin
  },
  {
    title: "Расширенная статистика",
    description: "Отслеживайте подробную статистику своего профиля и анализируйте свой прогресс.",
    image: FutureChicken
  },
  {
    title: "Контроль над тредами",
    description: "Настройте видимость своих тредов – только для друзей или эксклюзивно для донатеров.",
    image: Salt
  },
  {
    title: "Дополнительные реакции",
    description: "Выражайте больше эмоций! Возможность ставить до 3 реакций вместо 1 на посты и треды.",
    image: PlayerTable
  },
]

const DonateDialog = () => {
  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="flex flex-col relative px-4 py-4 items-center gap-y-4 w-full">
        <div className="biloba-gradient opacity-30 w-full h-full z-[1] absolute left-0 right-0 top-0" />
        <img src={Chestplate} alt="" width={112} height={112} />
        <div className="flex flex-col">
          <span className="font-[Minecraft] text-xl text-center font-semibold">Fasberry+</span>
          <Typography className="text-lg text-center break-words">
            Откройте для себя больше возможностей на форуме и в игре!
          </Typography>
        </div>
      </div>
      <div className="flex flex-col overflow-auto relative max-h-1/2 pt-4 bg-black/40 rounded-t-md gap-y-2 w-full">
        {DONATE_FEATURES.map((feature, idx) => (
          <DonateDialogFeatureItem key={idx} title={feature.title} description={feature.description} image={feature.image} />
        ))}
      </div>
      <div className="bg-[#191919] sticky bottom-0 py-4 px-6 flex items-center justify-center w-full">
        <a href={`${MINECRAFT_MAP_SITE_DOMAIN}/shop#shop-list`} target="_blank" rel="noreferrer" className="w-full">
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

export const BuyDonateModal = ({ trigger }: BuyDonateModalProps) => {
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