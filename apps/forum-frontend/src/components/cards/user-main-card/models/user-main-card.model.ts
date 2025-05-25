import { reatomResource, withDataAtom, withErrorAtom, withStatusesAtom } from "@reatom/async";
import { atom } from "@reatom/core";
import { sleep } from "@reatom/framework";
import { forumUserClient } from "@repo/shared/api/forum-client";

async function getUserSummary(nickname: string) {
  const res = await forumUserClient.user["get-user-summary"][":nickname"].$get({
    param: { nickname },
  });

  const data = await res.json();

  if (!data || "error" in data) return null;

  return data
}

export const selectedUserCardAtom = atom<string | null>(null, "selectedUserCard")

export const userCardResource = reatomResource(async (ctx) => {
  const target = ctx.spy(selectedUserCardAtom)
  if (!target) return null

  await sleep(120)
  
  return await ctx.schedule(() => getUserSummary(target))
}, "userCardResource").pipe(
  withDataAtom(), withStatusesAtom(), withErrorAtom()
)