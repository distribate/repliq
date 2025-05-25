import { UserPreviewCard } from "#components/cards/user-preview-card/components/user-preview-card"
import { reatomResource, withCache, withDataAtom, withStatusesAtom } from "@reatom/async"
import { reatomComponent } from "@reatom/npm-react"
import { currentUserAtom } from "@repo/lib/helpers/get-user"
import { forumSharedClient } from "@repo/shared/api/forum-client"
import { Skeleton } from "@repo/ui/src/components/skeleton"
import { Typography } from "@repo/ui/src/components/typography"

const getOnlineUsers = async () => {
  const res = await forumSharedClient.shared["get-online-users"].$get()
  const data = await res.json()

  if ("error" in data) return null

  return data.data.length > 0 ? data.data : null;
}

const onlineUsersResource = reatomResource(async (ctx) => {
  const currentUserNickname = ctx.spy(currentUserAtom)?.nickname
  if (!currentUserNickname) return;

  const res = await ctx.schedule(() => getOnlineUsers())

  if (!res) return [{ nickname: currentUserNickname }]

  if ("error" in res) return null

  const converted = res
  .reduce<{ nickname: string }[]>((uniqueUsers, user) => {
    if (!uniqueUsers.some(existingUser => existingUser.nickname === user.nickname)) {
      uniqueUsers.push(user);
    }

    return uniqueUsers;
  }, [])
  .concat(res.some(user => user.nickname === currentUserNickname) ? [] : [{ nickname: currentUserNickname }])

  return converted
}, "onlineUsersResource").pipe(withDataAtom(), withCache(), withStatusesAtom())

export const OnlineUsers = reatomComponent(({ ctx }) => {
  const onlineUsers = ctx.spy(onlineUsersResource.dataAtom)
  const isLoading = ctx.spy(onlineUsersResource.statusesAtom).isPending

  return (
    <div className="flex flex-col gap-4 w-full py-6 px-4 rounded-lg overflow-hidden bg-primary-color">
      <Typography
        textSize="big"
        textColor="shark_white"
        className="font-semibold select-none"
      >
        Пользователи в сети 📀
      </Typography>
      <div className="grid grid-cols-6 2xl:grid-cols-7 gap-2">
        {isLoading && (
          <>
            <Skeleton className="h-full w-full" />
            <Skeleton className="h-full w-full" />
            <Skeleton className="h-full w-full" />
            <Skeleton className="h-full w-full" />
            <Skeleton className="h-full w-full" />
            <Skeleton className="h-full w-full" />
          </>
        )}
        {(!onlineUsers && !isLoading) && (
          <Typography className="text-[16px]">
            тишина...
          </Typography>
        )}
        {onlineUsers && onlineUsers.map(({ nickname }) => <UserPreviewCard key={nickname} nickname={nickname} />)}
      </div>
    </div>
  )
}, "OnlineUsers")