import Intro from "@repo/assets/images/intro.jpg"
import { Typography } from "@repo/ui/src/components/typography";
import { globalPreferencesQuery } from "@repo/lib/queries/global-preferences-query";
import { useUpdateGlobalPreferences } from "@repo/lib/hooks/use-update-global-preferences";
import { DeleteButton } from "@repo/ui/src/components/detele-button";

const IntroClose = () => {
  const { updateShowingMutation } = useUpdateGlobalPreferences()

  return <DeleteButton variant="invisible" onClick={() => updateShowingMutation.mutate("intro")} />;
};

export const IntroWidget = () => {
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