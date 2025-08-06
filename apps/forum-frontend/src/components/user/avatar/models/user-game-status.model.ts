// import { reatomAsync, withDataAtom, withStatusesAtom } from "@reatom/async";
// import { isParamChanged, requestedUserParamAtom } from "#components/profile/main/models/requested-user.model";
// import { forumUserClient } from "@repo/shared/api/forum-client"
// import { formatIssuedTime } from "./user-status.model";

// async function getUserStatus(nickname: string) {
//   const res = await forumUserClient.user["get-user-game-status"][":nickname"].$get({ param: { nickname }})
//   const data = await res.json()

//   if (!data || "error" in data) return null

//   return data.data
// }

// requestedUserParamAtom.onChange((ctx, state) => isParamChanged(ctx, requestedUserParamAtom, state, () => userGameStatusResource.dataAtom.reset(ctx)))

// export const userGameStatusResource = reatomAsync(async (ctx) => {
//   const target = ctx.get(requestedUserParamAtom)
//   if (!target) return;
  
//   const res = await getUserStatus(target)

//   if (!res) return null;

//   const issuedTime = formatIssuedTime(res?.issued_date ?? null)

//   return { ...res, issued_date: issuedTime }
// }, "userGameStatusResource").pipe(withDataAtom(), withStatusesAtom())