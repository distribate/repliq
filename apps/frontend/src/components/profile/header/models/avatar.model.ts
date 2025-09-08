import { isAuthenticatedAtom } from "#components/auth/models/auth.model"
import { requestedUserAtom } from "#components/profile/main/models/requested-user.model"
import { userAvatars } from "#components/user/components/avatar/models/user-avatars.model"
import { validateResponse } from "#shared/api/validation"
import { userClient } from "#shared/forum-client"
import { reatomAsync, withStatusesAtom } from "@reatom/async"
import { action, atom, batch, Ctx } from "@reatom/core"
import { sleep, withInit, withReset } from "@reatom/framework"

export const userCoverSelectedAvatarAtom = atom<string>("", "userCoverSelectedAvatar").pipe(
  withInit((ctx) => ctx.get(requestedUserAtom)?.avatar ?? ""),
  withReset()
)

export const userCoverAvatarDialogIsOpenAtom = atom(false, "userCoverAvatarDialogIsOpen")
export const userCoverAvatarTargetAtom = atom("", "userCoverAvatarTarget").pipe(withReset())

userCoverAvatarDialogIsOpenAtom.onChange(async (ctx, state) => {
  if (!state) {
    await ctx.schedule(() => sleep(300));

    batch(ctx, () => {
      userAvatars.dataAtom.reset(ctx)
      userCoverSelectedAvatarAtom.reset(ctx)
      userCoverAvatarTargetAtom.reset(ctx)
    })
  }
})

export const prefetchUserAvatarsAction = action((ctx, nickname: string) => {
  const isAuthenticated = ctx.get(isAuthenticatedAtom)
  if (!isAuthenticated) return;

  userCoverAvatarTargetAtom(ctx, nickname)
  userAvatars(ctx, nickname)
}, "prefetchUserAvatarsAction")

export const openUserCoverAvatarDialog = action(async (ctx, value: boolean) => {
  const isAuthenticated = ctx.get(isAuthenticatedAtom)
  if (!isAuthenticated) return;

  userCoverAvatarDialogIsOpenAtom(ctx, value)
})

function getAvatarIndex(ctx: Ctx, target: string) {
  const avatars = ctx.get(userAvatars.dataAtom)?.avatars;
  if (!avatars) throw new Error("Avatars is not defined");

  const id = avatars.findIndex(ex => ex === target);
  if (id === -1) throw new Error("Index is not corrected")

  return id;
}

export const setAvatarAsMain = reatomAsync(async (ctx, target: string) => {
  const id = getAvatarIndex(ctx, target)

  return await ctx.schedule(async () => {
    const res = await userClient.user["avatar"]["update"][":id"].$post({
      param: { id: id.toString() },
      json: {
        type: "set-as-main"
      }
    });

    return validateResponse<typeof res>(res);
  })
}, {
  name: "setAvatarAsMain",
  onFulfill: (ctx, { data }) => {
    batch(ctx, () => {
      userAvatars.cacheAtom.reset(ctx)
      userAvatars.dataAtom(ctx, data)
    })
  },
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  },
}).pipe(withStatusesAtom())

export const deleteAvatar = reatomAsync(async (ctx, target: string) => {
  const id = getAvatarIndex(ctx, target)

  return await ctx.schedule(async () => {
    const res = await userClient.user["avatar"]["remove"][":id"].$delete({ param: { id: id.toString() } });
    return validateResponse<typeof res>(res);
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