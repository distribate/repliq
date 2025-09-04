import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { action, atom } from "@reatom/core";
import { withReset } from "@reatom/framework";
import { userClient } from "#shared/forum-client";
import ky from "ky";
import { toast } from "sonner";
import { currentUserAtom } from "#components/user/models/current-user.model";
import { requestedUserAtom } from "#components/profile/main/models/requested-user.model";

export const updateAvatarAtom = atom<string | null>(null, "updateAvatar").pipe(withReset())

export const updateAvatarAction = reatomAsync(async (ctx) => {
  const target = ctx.get(updateAvatarAtom)
  if (!target) return;

  const file = await fetch(target)
  const blob = await file.blob()

  const formData = new FormData()

  formData.append("file", blob)

  return await ctx.schedule(async () => {
    const url = userClient.user["upload-avatar"].$url()

    const res = await ky.post<{ data: string, status: string } | { error: string }>(
      url, { body: formData, credentials: "include", retry: 1, throwHttpErrors: false }
    )

    const data = await res.json();

    if ("error" in data) throw new Error(data.error)

    return data;
  })
}, {
  name: "updateAvatarAction",
  onFulfill: (ctx, res) => {
    if (!res) return;

    toast.success("Аватар обновлен")

    const current = ctx.get(updateAvatarAtom)

    if (current) {
      URL.revokeObjectURL(current)
    }

    updateAvatarAtom.reset(ctx)
    
    currentUserAtom(ctx, (state) => state ? ({ ...state, avatar: res.data }) : null)
    requestedUserAtom(ctx, (state) => state ? ({ ...state, avatar: res.data }) : null)
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