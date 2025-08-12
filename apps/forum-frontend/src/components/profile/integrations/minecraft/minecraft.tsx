import { Typography } from "@repo/ui/src/components/typography";
import { UserProfileGameAchievements } from "../../achievements/components/profile-game-ach";
import { MinecraftAvatar } from "#components/user/minecraft-avatar/minecraft-avatar";
import { requestedUserParamAtom } from "../../main/models/requested-user.model";
import { reatomComponent } from "@reatom/npm-react";
import { Button } from "@repo/ui/src/components/button";

const INTEGRATION_URL = import.meta.env.PUBLIC_ENV__INTEGRATION_URL_FASBERRY

const MinecraftProfileAvatar = reatomComponent(({ ctx }) => {
  const nickname = ctx.get(requestedUserParamAtom)
  if (!nickname) return

  const link = `${INTEGRATION_URL}/player/${nickname}`

  return (
    <>
      <div className="flex border-2 border-green-500 rounded-md overflow-hidden p-0.5 justify-center items-center">
        <MinecraftAvatar
          nickname={nickname}
          propHeight={512}
          propWidth={512}
          className="w-1/2 h-1/2"
        />
      </div>
      <div className="flex flex-col gap-2 w-full h-full">
        <a href={link} target="_blank">
          <Button className="py-2 bg-shark-50" size="lg">
            <Typography textSize="medium" className="text-shark-950">
              Игровой профиль
            </Typography>
          </Button>
        </a>
      </div>
    </>
  )
}, "MinecraftProfileAvatar")

export const Minecraft = () => {
  return (
    <div className="flex flex-col first:order-first first:xl:order-last xl:flex-row w-full gap-4">
      <UserProfileGameAchievements />
      <div className="flex xl:hidden order-first xl:order-last items-center justify-center gap-4 flex-col w-fit self-center h-1/3">
        <MinecraftProfileAvatar />
      </div>
      <div className="hidden xl:flex items-center justify-center h-full gap-4 flex-col w-1/5">
        <MinecraftProfileAvatar />
      </div>
    </div>
  )
}