import { getSkinDetails } from "@repo/lib/queries/get-skin-details.ts";
import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { atom } from "@reatom/core";
import { isParamChanged, requestedUserParamAtom } from "#components/profile/main/models/requested-user.model";
import { withReset } from "@reatom/framework";
import { logger } from "@repo/lib/utils/logger";

export const skinAtom = atom<string | null>(null, "skin").pipe(withReset())

requestedUserParamAtom.onChange((ctx, state) => isParamChanged(ctx, state, () => {
  skinAtom.reset(ctx)
  logger.info("skin reset for", state)
}))

export const skinStateAction = reatomAsync(async (ctx) => {
  const target = ctx.get(requestedUserParamAtom)
  if (!target) return;

  return await ctx.schedule(() => getSkinDetails({ type: "skin", nickname: target }))
}, {
  name: "skinStateAction",
  onFulfill: (ctx, res) => {
    if (!res) return;
    skinAtom(ctx, res)
  }
}).pipe(withStatusesAtom())