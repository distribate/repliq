import Intro from "@repo/assets/images/intro.jpg"
import { Typography } from "@repo/ui/src/components/typography";
import { globalPreferencesAtom } from "@repo/lib/queries/global-preferences-query";
import { DeleteButton } from "@repo/ui/src/components/detele-button";
import { reatomComponent } from "@reatom/npm-react";
import { updateVisibilityAction } from "@repo/lib/hooks/update-global-preferences.model";

const IntroClose = reatomComponent(({ ctx }) => {
  return <DeleteButton variant="invisible" onClick={() => updateVisibilityAction(ctx, "intro")} />;
}, "IntroClose")

export const IntroWidget = reatomComponent(({ ctx }) => {
  const isIntro = ctx.spy(globalPreferencesAtom).intro === "show"
  if (!isIntro) return null;

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
      <IntroClose />
    </div>
  )
}, "IntroWidget")