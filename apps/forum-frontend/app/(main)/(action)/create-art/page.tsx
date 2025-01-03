import { ImageWrapper } from "@repo/components/src/wrappers/image-wrapper";
import { Typography } from "@repo/ui/src/components/typography";
import { Metadata } from "next";
import Events from "@repo/assets/gifs/minecraft-boime.gif";

export const metadata: Metadata = {
  title: "Публикация скриншота",
};

export default async function CreateArtPage() {
  return (
    <div className="flex w-full items-center justify-center h-full gap-12 px-12 py-6 relative">
      <div className="flex flex-col items-center gap-y-4">
        <ImageWrapper
          propSrc={Events.src}
          propAlt=""
          width={256}
          height={256}
        />
        <Typography className="text-xl font-bold text-shark-50">
          Скоро...
        </Typography>
      </div>
    </div>
  )
}