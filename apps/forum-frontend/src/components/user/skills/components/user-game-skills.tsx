import { getUser } from "@repo/lib/helpers/get-user"
import { createQueryKey } from "@repo/lib/helpers/query-key-builder"
import { playerClient } from "@repo/shared/api/minecraft-client"
import { useQuery } from "@tanstack/react-query"

async function getUserSkills(nickname: string) {
  const res = await playerClient.player["get-player-skills"][":nickname"].$get({
    param: { nickname }
  })

  const data = await res.json()

  if ("error" in data) {
    return null;
  }

  return data.data
}

const userGameSkillsQuery = (nickname: string) => useQuery({
  queryKey: createQueryKey("user", ["skills"]),
  queryFn: () => getUserSkills(nickname),
  refetchOnWindowFocus: false
})

export const UserGameSkills = () => {
  const { nickname } = getUser()
  const { data } = userGameSkillsQuery(nickname)

  return (
    <div>
      {data?.skillLines.ranged.xp}
    </div>
  )
}