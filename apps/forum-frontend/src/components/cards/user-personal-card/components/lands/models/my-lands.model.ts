import { reatomResource, withCache, withDataAtom, withStatusesAtom } from "@reatom/async"
import { getUser } from "@repo/lib/helpers/get-user"
import { playerClient } from "@repo/shared/api/minecraft-client"

const getUserLands = async (nickname: string) => {
  const res = await playerClient.player["get-player-lands"][":nickname"].$get({
    param: { nickname },
    query: { exclude: undefined }
  })

  const data = await res.json()

  if ("error" in data) return null

  return data.data.length > 0 ? data.data : null
}

export const myLandsResource = reatomResource(async (ctx) => {
  const nickname = getUser(ctx).nickname

  return await getUserLands(nickname)
}).pipe(withDataAtom(), withStatusesAtom(), withCache())