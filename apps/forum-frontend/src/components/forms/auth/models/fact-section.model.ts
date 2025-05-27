import { reatomResource, withCache, withDataAtom, withStatusesAtom } from "@reatom/async";
import { forumSharedClient } from "@repo/shared/api/forum-client";

async function getFact() {
  const res = await forumSharedClient.shared["get-fact"].$get()
  const data = await res.json();

  if (!data || "error" in data) return null;

  return data.data
}

export const factResource = reatomResource(async (ctx) => {
  return await ctx.schedule(() => getFact())
}, "factResource").pipe(withDataAtom(), withCache(), withStatusesAtom())