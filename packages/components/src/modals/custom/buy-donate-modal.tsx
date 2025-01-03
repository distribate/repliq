import { Button } from "@repo/ui/src/components/button"
import { Dialog, DialogContent, DialogTrigger } from "@repo/ui/src/components/dialog"
import { Typography } from "@repo/ui/src/components/typography"
import { HTMLAttributes, ReactNode, RefAttributes } from "react"
import { useInView } from "react-intersection-observer"
import { useRouter } from "next/navigation"
// @ts-ignore
import Chestplate from "@repo/assets/gifs/chestplate.gif"
import WildArmor from "@repo/assets/images/minecraft/wild_armor_trim_ыmithing_еemplate.webp"
import DragonBreath from "@repo/assets/images/minecraft/dragon_breath.webp"
import BustPainting from "@repo/assets/images/minecraft/bust_painting.webp"

type BuyDonateModalProps = {
  trigger: ReactNode | string
}

type DonateDialogFeatureItemProps = HTMLAttributes<HTMLDivElement> & {
  title: string,
  description: string,
  imageSrc: string
} & RefAttributes<HTMLDivElement>;

const DonateDialogFeatureItem = ({
  description, imageSrc, title, ...props
}: DonateDialogFeatureItemProps) => {
  return (
    <div className="flex items-center select-none py-2 px-6 justify-start rounded-md  hover:bg-shark-700 gap-4" {...props}>
      <div className="flex items-center justify-center rounded-lg p-2 bg-shark-400/40">
        <img src={imageSrc} alt="" width={40} height={40} />
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
}

const PushButton = () => {
  const { push } = useRouter()

  return (
    <Button onClick={() => push("https://fasberry.su/donate")} state="default" className="w-full py-3">
      <Typography className="text-[18px] font-semibold">
        Купить
      </Typography>
    </Button>
  )
}

const DonateDialog = () => {
  const { ref, inView } = useInView({ threshold: 0.05 })

  return (
    <div className="flex flex-col items-center relative gap-y-6 w-full h-full">
      <div className="flex flex-col relative px-4 pt-4 pb-2 items-center gap-y-4 w-full">
        <div className="biloba-gradient opacity-30 w-full h-[160px] z-[1] absolute left-0 right-0 top-0" />
        <img src={Chestplate.src} alt="" width={112} height={112} />
        <div className="flex flex-col">
          <Typography className="text-[20px] font-semibold text-center break-words">
            Получите больше возможностей.
          </Typography>
          <Typography className="text-[20px] font-semibold text-center break-words">
            Будьте аутентиком!
          </Typography>
        </div>
      </div>
      <div className="flex flex-col overflow-scroll relative max-h-[420px] pt-4 bg-black/40 rounded-t-md gap-y-2 w-full">
        <DonateDialogFeatureItem
          title="Test title"
          description="description"
          imageSrc={WildArmor.src}
        />
        <DonateDialogFeatureItem
          title="Test title"
          description="description"
          imageSrc={DragonBreath.src}
        />
        <DonateDialogFeatureItem
          title="Test title"
          description="description"
          imageSrc={BustPainting.src}
        />
        <DonateDialogFeatureItem
          title="Test title"
          description="description"
          imageSrc={BustPainting.src}
        />
        <DonateDialogFeatureItem
          title="Test title"
          description="description"
          imageSrc={BustPainting.src}
        />
        <div ref={ref}>
          <DonateDialogFeatureItem
            title="Test title"
            description="description"
            imageSrc={BustPainting.src}
          />
        </div>
        {inView && (
          <div className="relative bg-black/60 backdrop-blur-md py-4 px-6 flex items-center justify-center w-full">
            <PushButton />
          </div>
        )}
      </div>
      {!inView && (
        <div className="absolute bottom-0 right-0 left-0 bg-black/60 backdrop-blur-md py-4 px-6 flex items-center justify-center w-full">
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
      <DialogContent className="p-0">
        <DonateDialog />
      </DialogContent>
    </Dialog>
  )
}