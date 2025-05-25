import { onConnect } from "@reatom/framework"
import { reatomComponent } from "@reatom/npm-react"
import { userGameSkillsResource } from "../models/user-game-skills.model"

onConnect(userGameSkillsResource.dataAtom, userGameSkillsResource)

export const UserGameSkills = reatomComponent(({ ctx }) => {
  const data = ctx.spy(userGameSkillsResource.dataAtom)

  return (
    <div>
      {data?.skillLines.ranged.xp}
    </div>
  )
}, "UserGameSkills")