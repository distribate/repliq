import { forumUserClient } from "#shared/forum-client";
import { reatomAsync, withDataAtom } from "@reatom/async";
import { currentUserNicknameAtom } from "#components/user/models/current-user.model";
import { logger } from "@repo/shared/utils/logger.ts";

export async function getFriendsCount(
  nickname: string,
  init?: RequestInit
) {
  const res = await forumUserClient.user["get-friends-meta"].$get({ param: { nickname } }, { init })
  const data = await res.json()
  if (!data || "error" in data) return null;
  return data.data
}

export const friendsCountAction = reatomAsync(async (ctx) => {
  const nickname = ctx.get(currentUserNicknameAtom)
  if (!nickname) return;

  return await ctx.schedule(() => getFriendsCount(nickname, { signal: ctx.controller.signal }))
}, {
  name: "friendsCountAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  }
}).pipe(withDataAtom())

friendsCountAction.dataAtom.onChange((_, state) => import.meta.env.DEV && logger.info("friendsCountAction.dataAtom", state))