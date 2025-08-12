import { userCardDialogIsOpenAtom } from "#components/modals/custom/components/user-card-modal";
import { reatomResource, withDataAtom, withErrorAtom, withStatusesAtom } from "@reatom/async";
import { action, atom } from "@reatom/core";
import { sleep } from "@reatom/framework";
import { createIdLink } from "@repo/lib/utils/create-link";
import { forumUserClient } from "#shared/forum-client";
import { navigate } from "vike/client/router";

export const selectedUserCardAtom = atom<string | null>(null, "selectedUserCard")

export const controlUserCardAtom = action((ctx, value: boolean, type?: "link") => {
  if (!value) {
    userCardDialogIsOpenAtom(ctx, value)

    if (type) {
      const target = ctx.get(userCardResource.dataAtom)?.data?.nickname
      if (!target) return;

      ctx.schedule(() => navigate(createIdLink("user", target)))
    }

    userCardResource.dataAtom.reset(ctx)
  }

  userCardDialogIsOpenAtom(ctx, value)
})

export const userCardResource = reatomResource(async (ctx) => {
  const nickname = ctx.spy(selectedUserCardAtom)
  if (!nickname) return null

  await sleep(100)

  return await ctx.schedule(async () => {
    const res = await forumUserClient.user["get-user-summary"][":nickname"].$get(
      { param: { nickname } }, { init: { signal: ctx.controller.signal } }
    );

    const data = await res.json();
    
    if ("error" in data) throw new Error(data.error)

    return data
  })
}, "userCardResource").pipe(
  withDataAtom(), withStatusesAtom(), withErrorAtom()
)