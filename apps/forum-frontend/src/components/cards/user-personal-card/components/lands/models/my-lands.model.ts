import { reatomAsync, withCache, withDataAtom, withStatusesAtom } from "@reatom/async"
import { sleep } from "@reatom/framework"
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

export const myLandsResource = reatomAsync(async (ctx) => {
  const nickname = getUser(ctx).nickname

  await sleep(156)

  return await ctx.schedule(() => getUserLands(nickname))
}).pipe(withDataAtom(), withStatusesAtom(), withCache())