import { UserPreviewCard } from "#cards/components/user-preview-card/user-preview-card.tsx"
import { getUser } from "@repo/lib/helpers/get-user"
import { createQueryKey } from "@repo/lib/helpers/query-key-builder"
import { forumLandingClient } from "@repo/shared/api/forum-client"
import { Skeleton } from "@repo/ui/src/components/skeleton"
import { Typography } from "@repo/ui/src/components/typography"
import { useQuery } from "@tanstack/react-query"

const getOnlineUsers = async () => {
  const res = await forumLandingClient["get-online-users"].$get()

  const data = await res.json()

  if ("error" in data) {
    return null
  }

  return data.data.length > 0 ? data.data : null;
}

const onlineUsersQuery = (currentUserNickname: string) => useQuery({
  queryKey: createQueryKey("ui", ["online-users"]),
  queryFn: async () => {
    const res = await getOnlineUsers()

    if (!res) {
      return [{ nickname: currentUserNickname }]
    }

    if ("error" in res) {
      return null
    }

    return res
      .reduce<{ nickname: string }[]>((uniqueUsers, user) => {
        if (!uniqueUsers.some(existingUser => existingUser.nickname === user.nickname)) {
          uniqueUsers.push(user);
        }
        
        return uniqueUsers;
      }, [])
      .concat(
        res.some(user => user.nickname === currentUserNickname)
          ? []
          : [{ nickname: currentUserNickname }]
      );
  },
})

export const OnlineUsers = () => {
  const user = getUser()
  const { data: onlineUsers, isLoading } = onlineUsersQuery(user.nickname);

  return (
    <div className="flex flex-col border border-shark-800 gap-y-2 w-full py-6 px-4 rounded-lg overflow-hidden bg-primary-color">
      <Typography
        textSize="big"
        textColor="shark_white"
        className="font-semibold"
      >
        Пользователи в сети
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
}