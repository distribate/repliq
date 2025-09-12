import { requestedUserProfileBlockedAtom, requestedUserProfileStatusAtom } from "#components/profile/main/models/requested-user.model";
import { reatomAsync, withDataAtom, withStatusesAtom } from "@reatom/async";
import { atom, batch } from "@reatom/core";
import { withReset } from "@reatom/framework";
import { userClient } from "#shared/api/forum-client";
import { toast } from "sonner";
import { validateResponse } from "#shared/api/validation";

type ControlBlockUserActionVariables = {
  recipient: string, 
  type: "blocked-by-you" | null
}

export const blockedUserDialogIsOpenAtom = atom(false, "blockedUserDialogIsOpen")

const controlBlockUserActionVariablesAtom = atom<ControlBlockUserActionVariables | null>(null, "blockUserActionVariables").pipe(
  withReset()
)

export const blockedUserAction = reatomAsync(async (ctx, nickname: string) => {
  return await ctx.schedule(async () => {
    const res = await userClient.user["user-is-blocked"][":nickname"].$get(
      { param: { nickname } }, { init: { signal: ctx.controller.signal } }
    )

    return validateResponse<typeof res>(res)
  })
}, {
  name: "blockedUserAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      toast.error(e.message)
    }
  }
}).pipe(withDataAtom(), withStatusesAtom())

export const controlBlockUserAction = reatomAsync(async (ctx, recipient: string) => {
  const isBlocked = ctx.get(blockedUserAction.dataAtom)

  controlBlockUserActionVariablesAtom(ctx, {
    recipient, type: isBlocked === 'blocked-by-you' ? 'blocked-by-you' : null
  })

  const type = !isBlocked ? "block" : isBlocked === 'blocked-by-you' ? "unblock" : null;

  if (!type) {
    throw new Error(`Type is not corrected ${type}`)
  }

  return await ctx.schedule(async () => {
    const res = await userClient.user["control-user-blocked"].$post({ json: { recipient, type } })
    return validateResponse<typeof res>(res)
  })
}, {
  name: "blockUserAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      toast.error(e.message)
    }
  },
  onFulfill: (ctx, res) => {
    if (!res) return;

    const variables = ctx.get(controlBlockUserActionVariablesAtom)
    if (!variables) return;

    if (variables.type === 'blocked-by-you') {
      toast.success("Пользователь разблокирован")

      batch(ctx, () => {
        blockedUserAction.dataAtom(ctx, null)
        requestedUserProfileBlockedAtom(ctx, null)
        requestedUserProfileStatusAtom(ctx, null)
      })
    } else if (!variables.type) {
      toast.success("Пользователь заблокирован")

      batch(ctx, () => {
        blockedUserAction.dataAtom(ctx, "blocked-by-you")
        requestedUserProfileBlockedAtom(ctx, "blocked-by-you")
        requestedUserProfileStatusAtom(ctx, "blocked")
      })
    }

    return
  },
  onSettle: (ctx) => {
    blockedUserDialogIsOpenAtom(ctx, false)
  }
}).pipe(withStatusesAtom())