import { avatarsUrlsAtom } from "#components/user/avatar/models/avatar.model";
import { currentUserNicknameAtom } from "#components/user/models/current-user.model";
import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { action, atom } from "@reatom/core";
import { withReset } from "@reatom/framework";
import { forumUserClient } from "@repo/shared/api/forum-client";
import ky from "ky";
import { toast } from "sonner";

export const updateAvatarAtom = atom<string | null>(null, "updateAvatar").pipe(withReset())

async function uploadAvatar(body: FormData) {
  const url = forumUserClient.user["upload-avatar"].$url()
  const res = await ky.post<{ data: string, status: string } | { error: string }>(url, { body, credentials: "include", retry: 1  })
  const data = await res.json()
  return data;
}

export const updateAvatarAction = reatomAsync(async (ctx) => {
  const target = ctx.get(updateAvatarAtom)
  if (!target) return;

  const file = await fetch(target)
  const blob = await file.blob()

  const formData = new FormData()

  formData.append("file", blob)

  return await ctx.schedule(() => uploadAvatar(formData))
}, {
  name: "updateAvatarAction",
  onFulfill: (ctx, res) => {
    if (!res) return;

    if ("error" in res) {
      return toast.error(res.error);
    }
    
    toast.success("Аватар обновлен")

    const current = ctx.get(updateAvatarAtom)

    if (current) {
      URL.revokeObjectURL(current)
    }

    updateAvatarAtom.reset(ctx)

    const currentUser = ctx.get(currentUserNicknameAtom)
    if (!currentUser) return;

    avatarsUrlsAtom(ctx, (state) => ({ ...state, [currentUser]: res.data }))
  },
  onReject: (_, e) => {
    if (e instanceof Error) {
      toast.error(e.message)
    }
  }
}).pipe(withStatusesAtom())

export const avatarOnChange = action((ctx, e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files ? e.target.files ? e.target.files[0] : null : null

  if (!file) return;

  const url = URL.createObjectURL(file)

  updateAvatarAtom(ctx, url)
})