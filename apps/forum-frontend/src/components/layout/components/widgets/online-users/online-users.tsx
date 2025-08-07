import { reatomComponent } from "@reatom/npm-react"
import { Skeleton } from "@repo/ui/src/components/skeleton"
import { Typography } from "@repo/ui/src/components/typography"
import { onlineUsersAction } from "./online-users.model"
import { UserPreviewCard } from "#components/cards/user-preview-card/user-preview-card"
import { onConnect, onDisconnect } from "@reatom/framework"

const OnlineUsersSkeleton = () => {
  return (
    <>
      <Skeleton className="h-full w-full" />
      <Skeleton className="h-full w-full" />
      <Skeleton className="h-full w-full" />
      <Skeleton className="h-full w-full" />
      <Skeleton className="h-full w-full" />
      <Skeleton className="h-full w-full" />
    </>
  )
}

const List = reatomComponent(({ ctx }) => {
  const onlineUsers = ctx.spy(onlineUsersAction.dataAtom)
  if (!onlineUsers) return null;

  return (
    onlineUsers.map(({ nickname, avatar }) => (
      <UserPreviewCard avatar={avatar} key={nickname} nickname={nickname} />
    ))
  )
}, "OnlineUsersList")

onConnect(onlineUsersAction.dataAtom, onlineUsersAction)
onDisconnect(onlineUsersAction.dataAtom, (ctx) => onlineUsersAction.dataAtom.reset(ctx))

export const OnlineUsers = reatomComponent(({ ctx }) => {
  return (
    <div className="flex flex-col gap-4 w-full p-4 rounded-lg overflow-hidden bg-primary-color">
      <Typography textSize="big" textColor="shark_white" className="font-semibold">
        Сейчас онлайн
      </Typography>
      <div className="flex flex-col w-full gap-2">
        {ctx.spy(onlineUsersAction.statusesAtom).isPending && <OnlineUsersSkeleton />}
        <List />
      </div>
    </div>
  )
}, "OnlineUsers")