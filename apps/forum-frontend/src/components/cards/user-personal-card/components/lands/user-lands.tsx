import { ContentNotFound } from "#components/templates/content-not-found"
import { createQueryKey } from "@repo/lib/helpers/query-key-builder"
import { forumUserClient } from "@repo/shared/api/forum-client"
import { Skeleton } from "@repo/ui/src/components/skeleton"
import { Typography } from "@repo/ui/src/components/typography"
import { useQuery } from "@tanstack/react-query"

const getUserLands = async () => {
  const res = await forumUserClient.user["get-my-lands"].$get()

  const data = await res.json()

  if ("error" in data) {
    return null
  }

  return data.data.length > 0 ? data.data : null
}

export const USER_LANDS_QUERY_KEY = createQueryKey("user", ["my-lands"])

const userLandsQuery = () => useQuery({
  queryKey: USER_LANDS_QUERY_KEY,
  queryFn: () => getUserLands(),
  refetchOnWindowFocus: false,
})

export const UserLands = () => {
  const { data: userLands, isLoading } = userLandsQuery();

  return (
    <div className="flex flex-col gap-y-4 items-center w-full">
      <Typography variant="dialogTitle">Ваши регионы</Typography>
      <div className="flex flex-col w-full gap-y-4">
        {isLoading && (
          <>
            <Skeleton className="w-full h-16" />
            <Skeleton className="w-full h-16" />
          </>
        )}
        {(!userLands && !isLoading) && (
          <ContentNotFound title="Регионов пока нет :/" />
        )}
        {userLands && userLands?.map((land) => (
          <div className="flex flex-col bg-secondary-color w-full py-2 px-4">
            <Typography className="text-base text-shark-200">
              {land.name}
            </Typography>
            <Typography className="text-base text-shark-200">
              {land.title}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  )
}