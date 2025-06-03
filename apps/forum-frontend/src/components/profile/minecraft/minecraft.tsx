import { ProfileSkinRender } from "#components/profile/skin/components/profile-skin-render";
import { GeneralStats } from "#components/profile/stats/components/general-stats";
import { LandsStats } from "#components/profile/stats/components/lands-stats";
import { Separator } from "@repo/ui/src/components/separator";
import { Typography } from "@repo/ui/src/components/typography";
import { ProfileSkinControls } from "../skin/components/profile-skin-controls";
import { UserProfileGameAchievements } from "../achievements/components/profile-game-ach";

export const Minecraft = () => {
  return (
    <div className="flex flex-col w-full gap-4">
      <Separator />
      <div className="flex flex-row w-full gap-4">
        <div className="flex flex-col gap-6 w-full h-full">
          <div className="flex flex-col gap-4 w-full">
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
          </div>
        </div>
        <div className="hidden xl:flex h-full gap-4 flex-col w-1/3">
          <ProfileSkinRender />
          <ProfileSkinControls />
        </div>
      </div>
      <UserProfileGameAchievements />
    </div>
  )
}