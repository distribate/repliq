import { forumUserClient } from "@repo/shared/api/forum-client";
import { reatomAsync, withDataAtom, withStatusesAtom } from "@reatom/async";
import { UnwrapPromise } from "@repo/lib/helpers/unwrap-promise-type";
import { atom } from "@reatom/core";

type ExtractRecommendedFriends<T> = T extends (infer U)[]
  ? U extends { nickname: string; uuid: string }
  ? U[]
  : never
  : never;

type RecommendedFriends = UnwrapPromise<ReturnType<typeof getRecommendedFriends>> | null

export type RecommendedFriendsIndividual = ExtractRecommendedFriends<RecommendedFriends>;

export type RecommendedFriendsGlobal = Extract<RecommendedFriends, {
  byLands: Array<{
    land: {
      ulid: string;
      name: string
    };
    members: {
      nickname: string,
      uuid: string
    }
  }>;
  byFriends: Array<{
    nickname: string,
    friend: string
  }>
}>;

async function getRecommendedFriends(signal?: AbortSignal) {
  const res = await forumUserClient.user["get-recommended-friends"].$get({}, { init: { signal } });
  const data = await res.json();

  if (!data || "error" in data) return null;

  return data.data
}

export const recommendedFriendsTypeAtom = atom<"global" | "individual" | null>(null, "recommendedFriendsType")
export const recommendedFriendsAction = reatomAsync(async (ctx) => {
  return await ctx.schedule(() => getRecommendedFriends(ctx.controller.signal))
}, "recommendedFriendsAction").pipe(
  withDataAtom(), withStatusesAtom()
)

recommendedFriendsAction.dataAtom.onChange((ctx, state) => {
  recommendedFriendsTypeAtom(ctx, Array.isArray(state) ? "individual" : "global")
})