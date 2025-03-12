import { UserSettingsBack } from "#components/modals/user-settings/components/user-settings-back"
import { ContentNotFound } from "#components/templates/content-not-found"
import { getUser } from "@repo/lib/helpers/get-user"
import { createQueryKey } from "@repo/lib/helpers/query-key-builder"
import { playerClient } from "@repo/shared/api/minecraft-client"
import { Skeleton } from "@repo/ui/src/components/skeleton"
import { Typography } from "@repo/ui/src/components/typography"
import { useQuery } from "@tanstack/react-query"

const getUserLands = async (nickname: string) => {
  const res = await playerClient.player["get-player-lands"][":nickname"].$get({
    param: {
      nickname
    },
    query: { exclude: undefined }
  })

  const data = await res.json()

  if ("error" in data) {
    return null
  }

  return data.data.length > 0 ? data.data : null
}

export const USER_LANDS_QUERY_KEY = createQueryKey("user", ["my-lands"])

const userLandsQuery = (nickname: string) => useQuery({
  queryKey: USER_LANDS_QUERY_KEY,
  queryFn: () => getUserLands(nickname),
  refetchOnWindowFocus: false,
})

export const UserLands = () => {
  const { nickname } = getUser()
  const { data: userLands, isLoading } = userLandsQuery(nickname);

  return (
    <div className="flex flex-col gap-y-4 items-center w-full">
      <UserSettingsBack to="main" />
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