import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { action, atom, batch } from "@reatom/core";
import { withReset } from "@reatom/framework";
import { userClient } from "#shared/forum-client";
import { toast } from "sonner";
import { currentUserAtom } from "#components/user/models/current-user.model";
import { requestedUserAtom } from "#components/profile/main/models/requested-user.model";
import { client } from "#shared/api/client";

const url = userClient.user["avatar"]["create"].$url()

export const updateAvatarAtom = atom<string | null>(null, "updateAvatar").pipe(withReset())

export const updateAvatarAction = reatomAsync(async (ctx) => {
  const target = ctx.get(updateAvatarAtom)
  if (!target) throw new Error("Target is not defined")

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
  name: "updateAvatarAction",
  onFulfill: (ctx, { url }) => {
    const current = ctx.get(updateAvatarAtom)

    if (current) {
      URL.revokeObjectURL(current)
    }

    updateAvatarAtom.reset(ctx)

    batch(ctx, () => {
      currentUserAtom(ctx, (state) => state ? ({ ...state, avatar: url }) : null)
      requestedUserAtom(ctx, (state) => state ? ({ ...state, avatar: url }) : null)
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

  const url = URL.createObjectURL(file)

  updateAvatarAtom(ctx, url)
}, "avatarOnChange")