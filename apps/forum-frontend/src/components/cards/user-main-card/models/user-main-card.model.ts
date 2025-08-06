import { userCardDialogIsOpenAtom } from "#components/modals/custom/components/user-card-modal";
import { reatomResource, withDataAtom, withErrorAtom, withStatusesAtom } from "@reatom/async";
import { action, atom } from "@reatom/core";
import { sleep } from "@reatom/framework";
import { createIdLink } from "@repo/lib/utils/create-link";
import { forumUserClient } from "@repo/shared/api/forum-client";

async function getUserSummary(nickname: string) {
  const res = await forumUserClient.user["get-user-summary"][":nickname"].$get({ param: { nickname } });
  const data = await res.json();

  if (!data || "error" in data) return null;

  return data
}

export const selectedUserCardAtom = atom<string | null>(null, "selectedUserCard")

export const controlUserCardAtom = action((ctx, value: boolean, type?: "link") => {
  if (!value) {
    userCardDialogIsOpenAtom(ctx, value)
    
    if (type) {
      const target = ctx.get(userCardResource.dataAtom)?.data?.nickname
      if (!target) return;

      ctx.schedule(() => window.location.replace(createIdLink("user", target)))
    }

    userCardResource.dataAtom.reset(ctx)
  }
  
  userCardDialogIsOpenAtom(ctx, value)
})

export const userCardResource = reatomResource(async (ctx) => {
  const target = ctx.spy(selectedUserCardAtom)
  if (!target) return null

  await sleep(100)

  return await ctx.schedule(() => getUserSummary(target))
}, "userCardResource").pipe(
  withDataAtom(), withStatusesAtom(), withErrorAtom()
)