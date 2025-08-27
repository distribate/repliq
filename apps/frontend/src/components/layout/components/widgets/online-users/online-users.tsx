import { reatomComponent } from "@reatom/npm-react"
import { Skeleton } from "@repo/ui/src/components/skeleton"
import { Typography } from "@repo/ui/src/components/typography"
import { onlineUsersAction } from "./online-users.model"
import { onConnect, onDisconnect } from "@reatom/framework"
import { UserCardModal } from "#components/modals/custom/components/user-card-modal"
import { Avatar } from "#components/user/components/avatar/components/avatar"
import { CustomLink } from "#shared/components/link"
import { createIdLink } from "#lib/create-link"

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

const List = reatomComponent(({ ctx }) => {
  const data = ctx.spy(onlineUsersAction.dataAtom)
  const isExists = data && data.length >= 1

  if (!isExists) return <Typography className="text-shark-300">никого нет</Typography>

  return (
    data.map(({ nickname, avatar }) => (
      <div key={nickname} className="flex items-center w-full gap-2">
        <UserCardModal
          nickname={nickname}
          trigger={
            <div className="aspect-square min-h-12 h-12 max-h-12">
              <Avatar
                url={avatar}
                nickname={nickname}
                propHeight={50}
                propWidth={50}
                className="min-h-12 h-12 max-h-12 aspect-square"
              />
            </div>
          }
          withCustomTrigger={true}
        />
        <div className="flex flex-col">
          <CustomLink to={createIdLink("user", nickname)}>
            <Typography>
              {nickname}
            </Typography>
          </CustomLink>
        </div>
      </div>
    ))
  )
}, "OnlineUsersList")

onConnect(onlineUsersAction.dataAtom, onlineUsersAction)
onDisconnect(onlineUsersAction.dataAtom, (ctx) => onlineUsersAction.dataAtom.reset(ctx))

export const OnlineUsers = reatomComponent(({ ctx }) => {
  return (
    <div className="flex flex-col gap-4 w-full p-2 sm:p-4 rounded-lg overflow-hidden bg-primary-color">
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