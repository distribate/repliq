import { getCookieByKey } from "@repo/lib/helpers/get-cookie-by-key";
import Intro from "@repo/assets/images/intro.jpg"
import { Typography } from "@repo/ui/src/components/typography";
import { INTRO_COOKIE_KEY } from "@repo/shared/keys/cookie";
import { IntroClose } from "./intro-close";

export const IntroSection = () => {
  const isShow = getCookieByKey(INTRO_COOKIE_KEY);

  if (isShow === "hide") return null;

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