import { UserSettingsBack } from "#components/modals/user-settings/components/user-settings-back"
import { useUserSettingsModal } from "#components/modals/user-settings/hooks/use-user-settings-modal"
import { ContentNotFound } from "#components/templates/content-not-found"
import { getUser } from "@repo/lib/helpers/get-user"
import { createQueryKey } from "@repo/lib/helpers/query-key-builder"
import { playerClient } from "@repo/shared/api/minecraft-client"
import { LAND_URL } from "@repo/shared/constants/routes"
import { Skeleton } from "@repo/ui/src/components/skeleton"
import { Typography } from "@repo/ui/src/components/typography"
import { useQuery } from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"

const getUserLands = async (nickname: string) => {
  const res = await playerClient.player["get-player-lands"][":nickname"].$get({
    param: {  nickname },
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
  const { toggleGlobalDialogMutation } = useUserSettingsModal()

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
          <div className="flex items-center justify-between bg-secondary-color rounded-lg w-full p-4">
            <Typography className="text-lg text-shark-200">
              {land.name}
            </Typography>
            <Link
              to={LAND_URL + land.ulid}
              onClick={() => toggleGlobalDialogMutation.mutate({ reset: true, value: false })}
              className="w-fit rounded-lg py-1 px-3 flex bg-shark-50 items-center justify-center"
            >
              <Typography className="text-shark-950 font-semibold">
                Перейти к региону
              </Typography>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}