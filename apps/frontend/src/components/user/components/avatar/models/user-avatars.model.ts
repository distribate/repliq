import { userClient } from "#shared/api/forum-client"
import { AsyncCtx, reatomAsync, withCache, withDataAtom, withStatusesAtom } from "@reatom/async"
import { validateResponse } from "#shared/api/validation"
import { log } from "#shared/utils/log"

export type UserAvatarsPayload = NonNullable<Awaited<ReturnType<typeof getUserAvatars>>>

async function getUserAvatars(ctx: AsyncCtx, nickname: string) {
  const res = await userClient.user["user-avatars"][":nickname"].$get(
    { param: { nickname } },
    { init: { signal: ctx.controller.signal } }
  )

  return validateResponse<typeof res>(res);
}

export const userAvatars = reatomAsync(async (ctx, nickname: string) => {
  return await ctx.schedule(async () => getUserAvatars(ctx, nickname))
}, {
  name: "userAvatars",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  }
}).pipe(withDataAtom(), withStatusesAtom(), withCache({ swr: false }))

userAvatars.dataAtom.onChange((_, v) => log("userAvatars.dataAtom", v))
userAvatars.cacheAtom.onChange((_, v) => log("userAvatars.cacheAtom", v))