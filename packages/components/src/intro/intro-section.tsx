import Intro from "@repo/assets/images/intro.jpg"
import { Typography } from "@repo/ui/src/components/typography";
import { IntroClose } from "./intro-close";
import { globalPreferencesQuery } from "@repo/lib/queries/global-preferences-query";

export const IntroSection = () => {
  const { data: { intro } } = globalPreferencesQuery()

  if (intro === "hide") return null;

  return (
    <div className="flex select-none flex-col items-center justify-end relative overflow-hidden h-[150px] rounded-lg w-full">
      <img
        draggable={false}
        src={Intro}
        alt=""
        width={800}
        height={800}
        className="absolute w-full h-[860px] rounded-lg object-cover"
      />
      <div className="absolute bottom-0 bg-gradient-to-t h-[60px] from-black/60 via-black/20 to-transparent w-full" />
      <Typography className="font-[Minecraft] mb-2 text-[21px] z-[1]">
        Добро пожаловать на форум!
      </Typography>
      <IntroClose/>
    </div>
  )
}