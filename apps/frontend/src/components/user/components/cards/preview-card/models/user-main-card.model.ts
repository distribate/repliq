import { reatomAsync, withDataAtom, withErrorAtom, withStatusesAtom } from "@reatom/async";
import { action, atom, batch, Ctx } from "@reatom/core";
import { createIdLink } from "#lib/create-link";
import { forumUserClient } from "#shared/forum-client";
import { navigate } from "vike/client/router";
import { withReset } from "@reatom/framework";

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

export const closeSummaryCardAction = action((ctx, type?: "link") => {
  userCardDialogIsOpenAtom(ctx, false)

  if (type) {
    const target = ctx.get(selectedUserCardAtom) as string;

    if (type === 'link') {
      ctx.schedule(() => navigate(createIdLink("user", target)))
    }
  }

  reset(ctx)
}, "closeSummaryCardAction")

export const userCardAction = reatomAsync(async (ctx, nickname: string) => {
  return await ctx.schedule(async () => {
    const res = await forumUserClient.user["get-user-summary"][":nickname"].$get(
      { param: { nickname } }, { init: { signal: ctx.controller.signal } }
    );

    const data = await res.json();

    if ("error" in data) throw new Error(data.error)

    return data
  })
}, {
  name: "userCardAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  }
}).pipe(withDataAtom(), withStatusesAtom(), withErrorAtom())