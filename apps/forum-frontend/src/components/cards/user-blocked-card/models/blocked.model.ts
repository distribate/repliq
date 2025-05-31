import { forumUserClient } from "@repo/shared/api/forum-client.ts";
import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { atom } from "@reatom/core";
import { withVariables } from "@repo/lib/utils/reatom/with-variables"

type BlockedUsers = Array<{ nickname: string }>

type DeleteUserFromBlocked = {
  recipient: string;
};

async function deleteUserFromBlocked({
  recipient,
}: DeleteUserFromBlocked) {
  const res = await forumUserClient.user["control-user-blocked"].$post({
    json: { recipient, type: "unblock" }
  })
  const data = await res.json();

  if (!data || "error" in data)  return null

  return { status: data.status }
}

export const blockedUsersAtom = atom<BlockedUsers | null>(null, "blockedUsers")

const deleteFromBlockedVariablesAtom = atom<string | null>(null, "deleteFromBlockedVariables")

export const deleteFromBlockedAction = reatomAsync(async (ctx, recipient: string) => {
  return await deleteUserFromBlocked({ recipient })
}, {
  name: "deleteFromBlockedAction",
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