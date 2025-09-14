import { isAuthenticatedAtom } from "#components/auth/models/auth.model"
import { requestedUserAtom, requestedUserIsSameAtom, requestedUserParamAtom } from "#components/profile/models/requested-user.model"
import { userAvatars, type UserAvatarsPayload } from "#components/user/components/avatar/models/user-avatars.model"
import { currentUserAtom } from "#components/user/models/current-user.model"
import { log } from "#shared/utils/log"
import { client } from "#shared/api/client"
import { validateResponse } from "#shared/api/validation"
import { userClient } from "#shared/api/forum-client"
import { reatomAsync, withStatusesAtom } from "@reatom/async"
import { action, atom, batch, type Ctx } from "@reatom/core"
import { sleep, withReset } from "@reatom/framework"
import { toast } from "sonner"

export const userAvatarDialogIsOpenAtom = atom(false, "userAvatarDialogIsOpen")

export const userAvatarsNicknameAtom = atom<string | null>(null, "userAvatarsNickname").pipe(withReset());

export const userAvatarsSelectedAtom = atom<string[] | null>(null, "userAvatarsSelected").pipe(withReset())
export const userAvatarSelectedAtom = atom<string | null>(null, "userAvatarSelected").pipe(withReset())

requestedUserParamAtom.onChange((ctx, state) => userAvatarsNicknameAtom(ctx, state))

userAvatars.onFulfill.onCall((ctx, state) => {
  batch(ctx, () => {
    userAvatarsSelectedAtom(ctx, state.avatars)
    userAvatarSelectedAtom(ctx, state.avatar)
  })
})

userAvatarSelectedAtom.onChange((_, v) => log("userAvatarSelectedAtom", v))
userAvatarsSelectedAtom.onChange((_, v) => log("userAvatarsSelectedAtom", v))
userAvatarDialogIsOpenAtom.onChange((_, v) => log("userCoverAvatarDialogIsOpenAtom", v))

function getNickname(ctx: Ctx) {
  const nickname = ctx.get(userAvatarsNicknameAtom);
  if (!nickname) throw new Error('Nickname is not defined')

  return nickname;
}

userAvatarDialogIsOpenAtom.onChange((ctx, state) => {
  if (state) {
    const nickname = getNickname(ctx);
    userAvatars(ctx, nickname)
  } else {
    batch(ctx, async () => {
      await ctx.schedule(() => sleep(200))

      userAvatarsSelectedAtom.reset(ctx)
      userAvatarSelectedAtom.reset(ctx)
    })
  }
})

function updateAvatars(ctx: Ctx, data: UserAvatarsPayload): void {
  const nickname = getNickname(ctx);

  const isSame = ctx.get(requestedUserIsSameAtom)

  batch(ctx, () => {
    userAvatars.cacheAtom.setWithParams(ctx, [nickname], data)

    userAvatarsSelectedAtom(ctx, data.avatars)
    userAvatarSelectedAtom(ctx, data.avatar)

    currentUserAtom(ctx, (state) => state ? ({ ...state, avatar: data.avatar }) : null)

    if (isSame) {
      requestedUserAtom(ctx, (state) => state ? ({ ...state, avatar: data.avatar }) : null)
    }
  })
}

function getAvatarIndex(ctx: Ctx, target: string): number {
  const avatars = ctx.get(userAvatarsSelectedAtom)
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
  onFulfill: (ctx, { data }) => updateAvatars(ctx, data),
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  },
}).pipe(withStatusesAtom())

export const deleteAvatar = reatomAsync(async (ctx, target: string) => {
  const id = getAvatarIndex(ctx, target)

  return await ctx.schedule(async () => {
    const res = await userClient.user["avatar"]["remove"][":id"].$delete({
      param: { id: id.toString() }
    });
    return validateResponse<typeof res>(res);
  })
}, {
  name: "deleteAvatar",
  onFulfill: async (ctx, data) => updateAvatars(ctx, data),
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  },
}).pipe(withStatusesAtom())

const url = userClient.user["avatar"]["create"].$url()

export const uploadedAvatarUrlAtom = atom<string | null>(null, "updateAvatar").pipe(withReset())

export const createAvatar = reatomAsync(async (ctx) => {
  const target = ctx.get(uploadedAvatarUrlAtom)
  if (!target) throw new Error("Target avatar is not defined")

  const file = await fetch(target)
  const blob = await file.blob()
  const formData = new FormData()

  formData.append("file", blob)

  return await ctx.schedule(async () => {
    const res = await client.post<{ data: { url: string } } | { error: string }>(url, {
      body: formData, retry: 1
    })

    const data = await res.json();

    if ("error" in data) throw new Error(data.error)

    return data.data;
  })
}, {
  name: "createAvatar",
  onFulfill: (ctx, { url }) => {
    const current = ctx.get(uploadedAvatarUrlAtom)

    if (current) {
      URL.revokeObjectURL(current)
    }

    uploadedAvatarUrlAtom.reset(ctx)

    const isSame = ctx.get(requestedUserIsSameAtom)

    batch(ctx, () => {
      currentUserAtom(ctx, (state) => state ? ({ ...state, avatar: url }) : null);

      if (isSame) {
        userAvatars.cacheAtom.reset(ctx)

        requestedUserAtom(ctx, (state) => state ? ({ ...state, avatar: url }) : null)
      }
    })

    toast.success("Аватар обновлен")
  },
  onReject: (_, e) => {
    if (e instanceof Error) {
      toast.error(e.message)
    }
  }
}).pipe(withStatusesAtom())

export const avatarOnChange = action((ctx, e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target?.files ? e.target?.files[0] : null;
  if (!file) return;

  uploadedAvatarUrlAtom(ctx, URL.createObjectURL(file))
}, "avatarOnChange")

export const resetUploadedChanges = action((ctx) => {
  const current = ctx.get(uploadedAvatarUrlAtom)

  if (current) {
    URL.revokeObjectURL(current)
  }

  uploadedAvatarUrlAtom.reset(ctx)
}, "resetUploadedChanges")

export const prefetchUserAvatarsAction = action((ctx, nickname: string) => {
  const isAuthenticated = ctx.get(isAuthenticatedAtom)
  if (!isAuthenticated) return;
  userAvatars(ctx, nickname)
}, "prefetchUserAvatarsAction")

export const openUserCoverAvatarDialog = action(async (ctx, value: boolean) => {
  const isAuthenticated = ctx.get(isAuthenticatedAtom)
  if (!isAuthenticated) return;
  userAvatarDialogIsOpenAtom(ctx, value)
}, "openUserCoverAvatarDialog")