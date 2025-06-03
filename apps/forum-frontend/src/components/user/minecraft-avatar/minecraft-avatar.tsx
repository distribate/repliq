import { reatomComponent, useUpdate } from "@reatom/npm-react";
import { Skeleton } from "@repo/ui/src/components/skeleton";
import { minecraftAvatarAction, minecraftAvatarAtom } from "./minecraft-avatar.model";

const SyncTarget = ({ nickname }: { nickname: string }) => {
  useUpdate((ctx) => minecraftAvatarAction(ctx, nickname), [nickname])
  return null;
}

export const MinecraftAvatar = ({
  nickname, propWidth, propHeight 
}: { nickname: string, propHeight?: number, propWidth?: number }) => {
  return (
    <>
      <SyncTarget nickname={nickname} />
      <MinecraftAvatarImage nickname={nickname} propHeight={propHeight} propWidth={propWidth} />
    </>
  )
}

const MinecraftAvatarImage = reatomComponent<{ nickname: string, propHeight?: number, propWidth?: number }>(({
  ctx, nickname, propHeight, propWidth
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
      className="select-none rounded-sm"
      alt=""
    />
  )
})