import { reatomComponent } from "@reatom/npm-react"
import { Skeleton } from "@repo/ui/src/components/skeleton"
import { Typography } from "@repo/ui/src/components/typography"
import { onlineUsersAction, OnlineUsersPayload } from "../models/online-users.model"
import { onConnect, onDisconnect } from "@reatom/framework"
import { UserCardModal } from "#components/modals/custom/user-card-modal"
import { Avatar } from "#components/user/components/avatar/components/avatar"
import { CustomLink } from "#shared/components/link"
import { createIdLink } from "#shared/helpers/create-link"

const OnlineUsersSkeleton = () => {
  return (
    <>
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
    </>
  )
}

const OnlineUserItem = reatomComponent<OnlineUsersPayload[number]>(({ ctx, ...user }) => {
  return (
    <div className="flex items-center w-full gap-2">
      <UserCardModal
        nickname={user.nickname}
        withCustomTrigger={true}
        trigger={
          <div className="aspect-square min-h-12 h-12 max-h-12">
            <Avatar
              url={user.avatar}
              nickname={user.nickname}
              propHeight={50}
              propWidth={50}
              className="min-h-12 h-12 max-h-12 aspect-square"
            />
          </div>
        }
      />
      <div className="flex flex-col">
        <CustomLink to={createIdLink("user", user.nickname)}>
          <Typography>
            {user.nickname}
          </Typography>
        </CustomLink>
      </div>
    </div>
  )
}, "OnlineUserItem")

const OnlineUsersList = reatomComponent(({ ctx }) => {
  const data = ctx.spy(onlineUsersAction.dataAtom)

  if (ctx.spy(onlineUsersAction.statusesAtom).isPending) {
    return <OnlineUsersSkeleton />
  }

  const isExists = data && data.length >= 1

  if (!isExists) {
    return <Typography className="text-shark-300">никого нет</Typography>
  }

  return (
    data.map((user) => <OnlineUserItem key={user.nickname} {...user} />)
  )
}, "OnlineUsersList")

onConnect(onlineUsersAction.dataAtom, onlineUsersAction)
onDisconnect(onlineUsersAction.dataAtom, (ctx) => onlineUsersAction.dataAtom.reset(ctx))

export const OnlineUsers = () => {
  return (
    <div className="flex flex-col gap-4 w-full p-2 sm:p-4 rounded-lg overflow-hidden bg-primary-color">
      <Typography textSize="big" textColor="shark_white" className="font-semibold">
        Сейчас онлайн
      </Typography>
      <div className="flex flex-col w-full gap-2">
        <OnlineUsersList />
      </div>
    </div>
  )
}