"use client"

import { UserPreviewCard } from "#cards/components/user-preview-card/user-preview-card.tsx"
import { createQueryKey } from "@repo/lib/helpers/query-key-builder"
import { forumLandingClient } from "@repo/shared/api/forum-client"
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

const onlineUsersQuery = () => useQuery({
  queryKey: createQueryKey("ui", ["online-users"]),
  queryFn: getOnlineUsers,
  refetchInterval: 1000 * 60 * 5,
  refetchOnMount: false
})

export const OnlineUsers = () => {
  const { data: onlineUsers } = onlineUsersQuery();

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
        {!onlineUsers && (
          <Typography className="text-[16px]">
            тишина...
          </Typography>
        )}
        {onlineUsers && onlineUsers.map(({ nickname }) => <UserPreviewCard key={nickname} nickname={nickname} />)}
      </div>
    </div>
  )
}