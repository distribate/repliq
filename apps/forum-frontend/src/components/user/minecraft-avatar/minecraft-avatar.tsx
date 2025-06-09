import { reatomComponent, useUpdate } from "@reatom/npm-react";
import { Skeleton } from "@repo/ui/src/components/skeleton";
import { minecraftAvatarAction, minecraftAvatarAtom } from "./minecraft-avatar.model";
import { cn } from "@repo/lib/utils/ui/cn";

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
      <MinecraftAvatarImage nickname={nickname} propHeight={propHeight} propWidth={propWidth} className={className} />
    </>
  )
}

const MinecraftAvatarImage = reatomComponent<{ nickname: string, propHeight?: number, propWidth?: number, className?: string }>(({
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
      className={cn("select-none rounded-sm", className)}
      alt=""
    />
  )
})