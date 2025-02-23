import { Avatar } from "#user/components/avatar/components/avatar.tsx"
import { UserNickname } from "#user/components/name/nickname.tsx"
import { createQueryKey } from "@repo/lib/helpers/query-key-builder"
import { forumCommentClient } from "@repo/shared/api/forum-client"
import { USER_URL } from "@repo/shared/constants/routes"
import { Skeleton } from "@repo/ui/src/components/skeleton"
import { Typography } from "@repo/ui/src/components/typography"
import { useQuery } from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"
import { Suspense } from "react"

const getLatestComments = async () => {
  const res = await forumCommentClient.comment["get-last-comments"].$get()

  const data = await res.json()

  if ("error" in data) {
    return null
  }

  return data.data;
}

const latestCommentsQuery = () => useQuery({
  queryKey: createQueryKey("ui", ["latest-comments"]),
  queryFn: getLatestComments,
  refetchOnWindowFocus: false,
})

export const LatestComments = () => {
  const { data: comments, isLoading } = latestCommentsQuery();

  return (
    <div className="flex flex-col gap-y-2 w-full py-6 px-4 rounded-lg overflow-hidden bg-primary-color">
      <Typography
        textSize="big"
        textColor="shark_white"
        className="font-semibold"
      >
        Последние комментарии
      </Typography>
      <div className="flex flex-col w-full h-full gap-2">
        {isLoading && (
          <>
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </>
        )}
        {(!comments && !isLoading) && (
          <Typography className="text-[16px]">
            тишина...
          </Typography>
        )}
        {comments && comments.map(({ created_at, content, parent_id, parent_type, title, user_nickname }, idx) => (
          <div key={idx} className="flex flex-col bg-shark-700/60 rounded-md p-2 gap-1">
            <div className="flex items-center gap-2">
              <Suspense fallback={<Skeleton className="w-[24px] h-[24px]" />}>
                <Link to={USER_URL + user_nickname}>
                  <Avatar nickname={user_nickname} propWidth={24} propHeight={24} />
                </Link>
              </Suspense>
              <Link to={USER_URL + user_nickname}>
                <UserNickname nickname={user_nickname} />
              </Link>
            </div>
            <Typography className="text-[16px]">
              {content}
            </Typography>
            <div className="flex w-full items-center gap-1">
              <Typography className="text-[14px]" textColor="gray">
                к треду
              </Typography>
              <div className="flex overflow-hidden w-2/3 *:px-1 *:py-0.5 *:bg-shark-700 *:rounded-md">
                <Typography textColor="gray" className="text-[14px] truncate">
                  <Link to={`/${parent_type}/${parent_id}`} className="text-shark-50">{title}</Link>
                </Typography>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}