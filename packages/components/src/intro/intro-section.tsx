import Intro from "@repo/assets/images/intro.jpg"
import { Typography } from "@repo/ui/src/components/typography";
import { IntroClose } from "./intro-close";
import { globalPreferencesQuery } from "@repo/lib/queries/global-preferences-query";

export const IntroSection = () => {
  const { data: { intro } } = globalPreferencesQuery()

  if (intro === "hide") return null;

  return (
    <div className="flex select-none flex-col px-4 group items-center justify-end relative overflow-hidden h-[100px] md:h-[150px] rounded-lg w-full">
      <img
        draggable={false}
        src={Intro}
        alt=""
        width={800}
        height={800}
        className="absolute w-full h-[860px] z-[1] rounded-lg object-cover"
      />
      <div className="absolute bottom-0 bg-gradient-to-t h-[60px] z-[1] from-black/60 via-black/20 to-transparent w-full" />
      <Typography className="font-[Minecraft] mb-2 text-[16px] md:text-[21px] z-[2]">
        Добро пожаловать на форум!
      </Typography>
      <IntroClose/>
    </div>
  )
}