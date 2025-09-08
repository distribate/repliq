import { userClient } from "#shared/forum-client";
import { reatomAsync, withDataAtom } from "@reatom/async";
import { currentUserNicknameAtom } from "#components/user/models/current-user.model";
import { log } from "#lib/utils";
import { validateResponse } from "#shared/api/validation";

export async function getFriendsCount(
  init?: RequestInit
) {
  const res = await userClient.user["my-friends-meta"].$get({}, { init })
  return validateResponse<typeof res>(res)
}

export const friendsCountAction = reatomAsync(async (ctx) => {
  const nickname = ctx.get(currentUserNicknameAtom)
  if (!nickname) return;

  return await ctx.schedule(() => getFriendsCount({ signal: ctx.controller.signal }))
}, {
  name: "friendsCountAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  }
}).pipe(withDataAtom(null))

friendsCountAction.dataAtom.onChange((_, v) => log("friendsCountAction.dataAtom", v))