// import { GeneralStats } from "#components/profile/stats/components/general-stats";
// import { LandsStats } from "#components/profile/stats/components/lands-stats";
import { Separator } from "@repo/ui/src/components/separator";
import { Typography } from "@repo/ui/src/components/typography";
import { UserProfileGameAchievements } from "../achievements/components/profile-game-ach";
import { MinecraftAvatar } from "#components/user/minecraft-avatar/minecraft-avatar";
import { requestedUserParamAtom } from "../main/models/requested-user.model";
import { reatomComponent } from "@reatom/npm-react";
import { Button } from "@repo/ui/src/components/button";

const MinecraftProfileAvatar = reatomComponent(({ ctx }) => {
  const nickname = ctx.get(requestedUserParamAtom)

  if (!nickname) return

  return (
    <>
      <div className="flex border-2 border-green-500 rounded-md overflow-hidden p-0.5 justify-center items-center">
        <MinecraftAvatar nickname={nickname} propHeight={512} propWidth={512} className="h-full w-full" />
      </div>
      <div className="flex flex-col gap-2 w-full h-full">
        <Button className="py-2 bg-shark-50" size="lg">
          <Typography textSize="medium" className="text-shark-950">
            Игровой профиль
          </Typography>
        </Button>
      </div>
    </>
  )
}, "MinecraftProfileAvatar")

export const Minecraft = () => {
  return (
    <div className="flex flex-col w-full gap-4">
      <Separator />
      <div className="flex flex-row w-full gap-4">
        <div className="flex flex-col gap-6 w-full xl:w-4/5 h-full">
          <div className="flex xl:hidden items-center justify-center gap-4 flex-col w-fit self-center h-1/3">
            <MinecraftProfileAvatar />
          </div>
          {/* <div className="flex flex-col gap-4 w-full">
            <Typography textColor="shark_white" textSize="big" className="font-semibold" >
              Основная статистика
            </Typography>
            <GeneralStats />
          </div>
          <div className="flex flex-col gap-4 w-full">
            <Typography textSize="large" className="font-semibold">
              Территории
            </Typography>
            <LandsStats />
          </div> */}
        </div>
        <div className="hidden xl:flex items-center justify-center h-full gap-4 flex-col w-1/5">
          <MinecraftProfileAvatar />
        </div>
      </div>
      <UserProfileGameAchievements />
    </div>
  )
}