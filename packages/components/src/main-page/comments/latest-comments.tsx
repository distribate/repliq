"use client"

import { Avatar } from "#user/components/avatar/components/avatar.tsx"
import { UserNickname } from "#user/components/name/nickname.tsx"
import { createQueryKey } from "@repo/lib/helpers/query-key-builder"
import { forumCommentClient } from "@repo/shared/api/forum-client"
import { USER_URL } from "@repo/shared/constants/routes"
import { Typography } from "@repo/ui/src/components/typography"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"

const getLatestComments = async () => {
  const res = await forumCommentClient().comment["get-last-comments"].$get()

  const data = await res.json()

  if ("error" in data) {
    return null
  }

  return data.data;
}

const latestCommentsQuery = () => useQuery({
  queryKey: createQueryKey("ui", ["latest-comments"]),
  queryFn: getLatestComments,
  refetchOnMount: false,
  refetchOnReconnect: true,
  refetchOnWindowFocus: false,
})

export const LatestComments = () => {
  const { data: comments } = latestCommentsQuery();

  return (
    <div className="flex flex-col border border-shark-800 gap-y-2 w-full py-6 px-4 rounded-lg overflow-hidden bg-primary-color">
      <Typography
        textSize="big"
        textColor="shark_white"
        className="font-semibold"
      >
        Последние комментарии
      </Typography>
      <div className="flex flex-col w-full h-full gap-2">
        {!comments && <Typography className="text-[16px]">тишина...</Typography>}
        {comments && comments.map(({ created_at, content, parent_id, parent_type, title, user_nickname }, idx) => (
          <div key={idx} className="flex flex-col bg-shark-700/60 rounded-md p-2 gap-1">
            <div className="flex items-center gap-2">
              <Link href={USER_URL + user_nickname}>
                <Avatar nickname={user_nickname} propWidth={24} propHeight={24} />
              </Link>
              <Link href={USER_URL + user_nickname}>
                <UserNickname nickname={user_nickname} />
              </Link>
            </div>
            <Typography className="text-[16px]">
              {content}
            </Typography>
            <div className="flex w-full">
              <Typography textColor="gray" className="text-[14px]">
                к треду <Link href={`/${parent_type}/${parent_id}`} className="text-shark-50">{title}</Link>
              </Typography>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}