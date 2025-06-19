import { reatomComponent } from "@reatom/npm-react"
import { Skeleton } from "@repo/ui/src/components/skeleton"
import { Typography } from "@repo/ui/src/components/typography"
import { onlineUsersResource } from "./online-users.model"
import { UserPreviewCard } from "#components/cards/user-preview-card/user-preview-card"

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

export const OnlineUsers = reatomComponent(({ ctx }) => {
  const onlineUsers = ctx.spy(onlineUsersResource.dataAtom)

  return (
    <div className="flex flex-col gap-4 w-full py-6 px-4 rounded-lg overflow-hidden bg-primary-color">
      <Typography textSize="big" textColor="shark_white" className="font-semibold select-none">
        Сейчас онлайн
      </Typography>
      <div className="grid grid-cols-6 2xl:grid-cols-7 gap-2">
        {ctx.spy(onlineUsersResource.statusesAtom).isPending && <OnlineUsersSkeleton/>}
        {onlineUsers && onlineUsers.map(({ nickname }) => <UserPreviewCard key={nickname} nickname={nickname} />)}
      </div>
    </div>
  )
}, "OnlineUsers")