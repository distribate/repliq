import { isAuthenticatedAtom } from "#components/auth/models/auth.model"
import { requestedUserAtom } from "#components/profile/main/models/requested-user.model"
import { userAvatars } from "#components/user/avatar/models/user-avatars.model"
import { forumUserClient } from "#shared/forum-client"
import { reatomAsync, withStatusesAtom } from "@reatom/async"
import { action, atom, batch } from "@reatom/core"
import { withInit, withReset } from "@reatom/framework"

export const userCoverSelectedAvatarAtom = atom<string>("", "userCoverSelectedAvatar").pipe(
  withInit((ctx) => ctx.get(requestedUserAtom)?.avatar ?? ""),
  withReset()
)

export const userCoverAvatarDialogIsOpenAtom = atom(false, "userCoverAvatarDialogIsOpen")
const userCoverAvatarTargetAtom = atom("", "userCoverAvatarTarget").pipe(withReset())

userCoverAvatarDialogIsOpenAtom.onChange((ctx, state) => {
  if (!state) {
    userAvatars.dataAtom.reset(ctx)
    userCoverSelectedAvatarAtom.reset(ctx)
    userCoverAvatarTargetAtom.reset(ctx)
  }
})

export const openUserCoverAvatarDialog = action(async (ctx, value: boolean, nickname: string) => {
  const isAuthenticated = ctx.get(isAuthenticatedAtom)
  if (!isAuthenticated) return;

  batch(ctx, () => {
    userCoverAvatarTargetAtom(ctx, nickname);
  
    const target = ctx.get(userCoverAvatarTargetAtom)
    userAvatars(ctx, target)
  })

  userCoverAvatarDialogIsOpenAtom(ctx, value)
})

export const deleteAvatar = reatomAsync(async (ctx, target: string) => {
  const avatars = ctx.get(userAvatars.dataAtom)?.avatars;
  if (!avatars) throw new Error("Avatars is not defined");

  const id = avatars.findIndex(ex => ex === target);
  if (id === -1) throw new Error("Index is not corrected")

  return await ctx.schedule(async () => {
    const res = await forumUserClient.user["remove-avatar"][":id"].$delete({ param: { id: id.toString() } });
    const data = await res.json();

    if ("error" in data) throw new Error(data.error)

    return data.data;
  })
}, {
  name: "deleteAvatar",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  },
  onFulfill: (ctx, res) => {
    userAvatars.dataAtom(ctx, res)
  }
}).pipe(withStatusesAtom())