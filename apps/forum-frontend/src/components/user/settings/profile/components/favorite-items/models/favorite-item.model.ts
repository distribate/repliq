
// import { forumUserClient } from "#shared/forum-client";
// import { reatomAsync, withStatusesAtom } from "@reatom/async";
// import { atom } from "@reatom/core";
// import { UnwrapPromise } from "@repo/lib/helpers/unwrap-promise-type";

// async function getFavoriteItem(nickname: string) {
//   const res = await forumUserClient.user["get-user-favorite-item"][":nickname"].$get({ param: { nickname } })
//   const data = await res.json()

//   if ("error" in data) return null

//   return data.data
// }

// export const favoriteItemAtom = atom<UnwrapPromise<ReturnType<typeof getFavoriteItem>>>(null, "favoriteItem")

// export const favoriteItemAction = reatomAsync(async (ctx, target: string) => {
//   if (ctx.get(favoriteItemAtom)) return ctx.get(favoriteItemAtom)
    
//   return await ctx.schedule(() =>  getFavoriteItem(target))
// }, {
//   name: "favoriteItemAction",
//   onFulfill: (ctx, res) => {
//     if (!res) return;
//     favoriteItemAtom(ctx, res)
//   }
// }).pipe(withStatusesAtom())