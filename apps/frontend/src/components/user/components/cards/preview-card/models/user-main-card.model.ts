import { reatomAsync, withDataAtom, withErrorAtom, withStatusesAtom } from "@reatom/async";
import { action, atom, batch, Ctx } from "@reatom/core";
import { createIdLink } from "#shared/helpers/create-link";
import { userClient } from "#shared/api/forum-client";
import { navigate, prefetch } from "vike/client/router";
import { withReset } from "@reatom/framework";
import { validateResponse } from "#shared/api/validation";

export const selectedUserCardAtom = atom<string | null>(null, "selectedUserCard").pipe(withReset())
export const userCardDialogIsOpenAtom = atom(false, "userCardDialogIsOpen")

function reset(ctx: Ctx) {
  batch(ctx, () => {
    selectedUserCardAtom.reset(ctx)
    userCardAction.dataAtom.reset(ctx)
  })
}

userCardDialogIsOpenAtom.onChange(async (ctx, state) => {
  if (!state) {
    reset(ctx);
  }
});

export const closeSummaryCardAction = action(async (ctx, type?: "link") => {
  userCardDialogIsOpenAtom(ctx, false)

  if (type) {
    const nickname = ctx.get(selectedUserCardAtom) as string;

    if (type === 'link') {
      const target = createIdLink("user", nickname);

      prefetch(target);

      await ctx.schedule(() => navigate(target))
    }
  }

  reset(ctx)
}, "closeSummaryCardAction")

export const userCardAction = reatomAsync(async (ctx, nickname: string) => {
  return await ctx.schedule(async () => {
    const res = await userClient.user["user-summary"][":nickname"].$get({
      param: { nickname }
    }, {
      init: { signal: ctx.controller.signal }
    });

    return validateResponse<typeof res>(res);
  })
}, {
  name: "userCardAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  }
}).pipe(withDataAtom(), withStatusesAtom(), withErrorAtom())