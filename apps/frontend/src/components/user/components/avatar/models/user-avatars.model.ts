import { currentUserNicknameAtom } from "#components/user/models/current-user.model"
import { forumUserClient } from "#shared/forum-client"
import { reatomAsync, withCache, withDataAtom, withStatusesAtom } from "@reatom/async"
import { batch } from "@reatom/core"
import { requestedUserAtom } from "#components/profile/main/models/requested-user.model"
import { userCoverSelectedAvatarAtom } from "#components/profile/header/models/avatar.model"

export const userAvatars = reatomAsync(async (ctx, nickname: string) => {
  return await ctx.schedule(async () => {
    const res = await forumUserClient.user["get-user-avatars"][":nickname"].$get(
      { param: { nickname } }, { init: { signal: ctx.controller.signal } }
    )

    const data = await res.json()

    if ("error" in data) throw new Error(data.error)

    return data.data
  })
}, {
  name: "userAvatars",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  }
}).pipe(withDataAtom(), withStatusesAtom(), withCache({ swr: false }))

userAvatars.dataAtom.onChange((ctx, state) => {
  if (!state) return;

  const currentUser = ctx.get(currentUserNicknameAtom)
  if (!currentUser) return;

  const newAvatar = state.avatars[state.avatars.length - 1];

  batch(ctx, () => {
    userCoverSelectedAvatarAtom(ctx, newAvatar);
    requestedUserAtom(ctx, (state) => state ? ({ ...state, avatar: newAvatar }) : null)
  })
})