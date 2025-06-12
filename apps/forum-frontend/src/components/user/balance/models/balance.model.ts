import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { atom } from "@reatom/core";
import { currentUserNicknameAtom } from "#components/user/models/current-user.model";
import { playerClient } from "@repo/shared/api/minecraft-client";

async function getUserBalance(nickname: string) {
  const res = await playerClient.player["get-player-balance"].$get({ param: { nickname }} );
  const data = await res.json()

  if ("error" in data) return null

  return data.data
}

export const userBalanceAtom = atom<{ charism: number; belkoin: number }>({ charism: 0, belkoin: 0 }, "userBalance")

export const userBalanceAction = reatomAsync(async (ctx) => {
  let currentUserNickname = ctx.get(currentUserNicknameAtom)
  if (!currentUserNickname) return;

  return await ctx.schedule(() => getUserBalance(currentUserNickname))
}, {
  name: "userBalanceAction",
  onFulfill: (ctx, res) => {
    if (!res) return;
    userBalanceAtom(ctx, { charism: Number(res.charism), belkoin: Number(res.belkoin) })
  }
}).pipe(withStatusesAtom())