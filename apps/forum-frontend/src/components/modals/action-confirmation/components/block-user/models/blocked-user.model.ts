import { requestedUserProfileBlockedAtom, requestedUserProfileStatusAtom } from "#components/profile/main/models/requested-user.model";
import { reatomAsync, withCache, withDataAtom, withStatusesAtom } from "@reatom/async";
import { atom } from "@reatom/core";
import { withReset } from "@reatom/framework";
import { forumUserClient } from "@repo/shared/api/forum-client";
import { toast } from "sonner";

type ControlBlockUserActionVariables = { 
  recipient: string, type: "blocked-by-you" | null 
}

export const blockedUserDialogIsOpenAtom = atom(false, "blockedUserDialogIsOpen")

const controlBlockUserActionVariablesAtom = atom<ControlBlockUserActionVariables | null>(null, "blockUserActionVariables").pipe(
  withReset()
)

async function controlBlockUser(recipient: string, type: "block" | "unblock") {
  const res = await forumUserClient.user["control-user-blocked"].$post({ json: { recipient, type } })
  const data = await res.json()
  return data
}

async function getUserBlocked(recipient: string) {
  const res = await forumUserClient.user["get-user-is-blocked"][":nickname"].$get({ param: { nickname: recipient } })
  const data = await res.json()
  if ("error" in data) return null;
  return data.data
}

export const blockedUserAction = reatomAsync(async (ctx, target: string) => {
  return await ctx.schedule(() => getUserBlocked(target))
}, "blockedUserAction").pipe(withDataAtom(), withStatusesAtom(), withCache())

export const controlBlockUserAction = reatomAsync(async (ctx, recipient: string) => {
  const isBlocked = ctx.get(blockedUserAction.dataAtom)

  controlBlockUserActionVariablesAtom(ctx, { 
    recipient, type: isBlocked === 'blocked-by-you' ? 'blocked-by-you' : null 
  })

  if (!isBlocked) {
    return await ctx.schedule(() => controlBlockUser(recipient, "block"))
  }

  if (isBlocked === 'blocked-by-you') {
    return await ctx.schedule(() => controlBlockUser(recipient, "unblock"))
  }
}, {
  name: "blockUserAction",
  onFulfill: (ctx, res) => {
    if (!res) return;

    if ("error" in res) {
      return toast.error(res.error)
    }

    const variables = ctx.get(controlBlockUserActionVariablesAtom)
    if (!variables) return;
    
    if (variables.type === 'blocked-by-you') {
      toast.success("Пользователь разблокирован")
      blockedUserAction.dataAtom(ctx, null)
      requestedUserProfileBlockedAtom(ctx, null)
      requestedUserProfileStatusAtom(ctx, null)
    } else if (!variables.type) {
      toast.success("Пользователь заблокирован")
      blockedUserAction.dataAtom(ctx, "blocked-by-you")
      requestedUserProfileBlockedAtom(ctx, "blocked-by-you")
      requestedUserProfileStatusAtom(ctx, "blocked")
    }
    return
  },
  onSettle: (ctx) => {
    blockedUserDialogIsOpenAtom(ctx, false)
  }
}).pipe(withStatusesAtom())