import { userClient } from "#shared/forum-client.ts";
import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { atom } from "@reatom/core";
import { withVariables } from "#lib/with-variables"

type BlockedUser = { 
  nickname: string 
}

export const blockedUsersAtom = atom<BlockedUser[] | null>(null, "blockedUsers")

const deleteFromBlockedVariablesAtom = atom<string | null>(null, "deleteFromBlockedVariables")

export const deleteFromBlockedAction = reatomAsync(async (ctx, recipient: string) => {
  return await ctx.schedule(async () => {
    const res = await userClient.user["control-user-blocked"].$post({
      json: { recipient, type: "unblock" }
    })

    const data = await res.json();

    if ("error" in data) throw new Error(data.error)

    return data.status
  })
}, {
  name: "deleteFromBlockedAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  },
  onFulfill: (ctx, res) => {
    if (!res) return;

    const blockedUsers = ctx.get(blockedUsersAtom)
    if (!blockedUsers) return;

    const recipient = ctx.get(deleteFromBlockedVariablesAtom)
    if (!recipient) return;

    const updatedBlockedUsers = blockedUsers.filter(u => u.nickname !== recipient);

    if (updatedBlockedUsers.length <= 1) {
      return blockedUsersAtom(ctx, null)
    }

    blockedUsersAtom(ctx, updatedBlockedUsers)
  },
}).pipe(withStatusesAtom(), withVariables(deleteFromBlockedVariablesAtom))