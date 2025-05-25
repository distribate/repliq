import { reatomResource, withCache, withDataAtom, withStatusesAtom } from "@reatom/async";
import { currentUserNicknameAtom } from "@repo/lib/helpers/get-user";
import { playerClient } from "@repo/shared/api/minecraft-client";

async function getUserSkills(nickname: string) {
  const res = await playerClient.player["get-player-skills"][":nickname"].$get({ param: { nickname } })
  const data = await res.json()

  if ("error" in data) return null;

  return data.data
}

export const userGameSkillsResource = reatomResource(async (ctx) => {
  const currentUserNickname = ctx.get(currentUserNicknameAtom)
  if (!currentUserNickname) return;

  return await ctx.schedule(() => getUserSkills(currentUserNickname))
}, "userGameSkillsResource").pipe(withDataAtom(), withCache(), withStatusesAtom())