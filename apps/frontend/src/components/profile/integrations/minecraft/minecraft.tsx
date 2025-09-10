import { Typography } from "@repo/ui/src/components/typography";
import { UserProfileGameAchievements } from "../../achievements/components/profile-game-ach";
import { Button } from "@repo/ui/src/components/button";
import { reatomComponent, useUpdate } from "@reatom/npm-react";
import { Skeleton } from "@repo/ui/src/components/skeleton";
import { cn } from "@repo/shared/utils/cn";
import { reatomAsync } from '@reatom/async';
import { atom, batch } from '@reatom/framework';
import ky from 'ky';
import { INTEGRATIONS_FASBERRY_URL } from "#shared/env";

const minecraftAvatarsUrlsAtom = atom<Record<string, string>>({}, "avatarsUrlsAtom");
const minecraftAvatarsStatusesAtom = atom<Record<string, boolean>>({}, "avatarsStatusesAtom");

const minecraftAvatarAtom = (nickname: string) => atom((ctx) => {
  return {
    url: ctx.spy(minecraftAvatarsUrlsAtom)[nickname],
    isLoading: ctx.spy(minecraftAvatarsStatusesAtom)[nickname]
  };
}, `minecraft-avatar.${nickname}`)

const minecraftAvatarAction = reatomAsync(async (ctx, nickname: string) => {
  if (ctx.get(minecraftAvatarsUrlsAtom)[nickname] !== undefined) return

  minecraftAvatarsStatusesAtom(ctx, (state) => ({ ...state, [nickname]: true }))

  const url = await ctx.schedule(async () => {
    const res = ky.get(`https://api.fasberry.su/minecraft/server/skin/${nickname}`, {
      searchParams: { type: 'head' }
    })

    const text = await res.text()

    return text
  });

  return { url, nickname };
}, {
  name: "minecraftAvatarAction",
  onFulfill: (ctx, res) => {
    if (!res) return;

    batch(ctx, () => {
      minecraftAvatarsUrlsAtom(ctx, (state) => ({ ...state, [res.nickname]: res.url! }));
      minecraftAvatarsStatusesAtom(ctx, (state) => ({ ...state, [res.nickname]: false }));
    })
  },
  onReject: (ctx, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  }
})

const SyncTarget = ({ nickname }: { nickname: string }) => {
  useUpdate((ctx) => minecraftAvatarAction(ctx, nickname), [nickname])
  return null;
}

export const MinecraftAvatar = ({
  nickname, propWidth, className, propHeight
}: { nickname: string, propHeight?: number, propWidth?: number, className?: string }) => {
  return (
    <>
      <SyncTarget nickname={nickname} />
      <MinecraftAvatarImage
        nickname={nickname}
        propHeight={propHeight}
        propWidth={propWidth}
        className={className}
      />
    </>
  )
}

const MinecraftAvatarImage = reatomComponent<{
  nickname: string, propHeight?: number, propWidth?: number, className?: string
}>(({
  ctx, nickname, propHeight, propWidth, className
}) => {
  const { url, isLoading } = ctx.spy(minecraftAvatarAtom(nickname))

  if (isLoading) {
    return <Skeleton style={{ height: propHeight, width: propWidth }} />
  }

  return (
    <img
      src={url}
      draggable={false}
      width={propWidth}
      height={propHeight}
      className={cn("select-none rounded-lg", className)}
      alt=""
    />
  )
}, "MinecraftAvatarImage")

const MinecraftProfileAvatar = reatomComponent<{ nickname: string }>(({ ctx, nickname }) => {
  const link = `${INTEGRATIONS_FASBERRY_URL}/player/${nickname}`

  return (
    <>
      <div className="flex border-2 border-green-500 rounded-md overflow-hidden p-0.5 justify-center items-center">
        <MinecraftAvatar
          nickname={nickname}
          propHeight={192}
          propWidth={192}
          className="max-h-48 h-48"
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

export const Minecraft = ({ nickname }: { nickname: string }) => {
  return (
    <div className="flex flex-col first:order-first first:xl:order-last xl:flex-row w-full gap-4">
      <UserProfileGameAchievements />
      <div className="flex xl:hidden order-first xl:order-last items-center justify-center gap-4 flex-col w-fit self-center h-1/3">
        <MinecraftProfileAvatar nickname={nickname} />
      </div>
      <div className="hidden xl:flex items-center justify-center h-full gap-4 flex-col w-1/5">
        <MinecraftProfileAvatar nickname={nickname} />
      </div>
    </div>
  )
}