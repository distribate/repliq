import { landAtom } from "#components/land/models/land.model"
import { Avatar } from "#components/user/avatar/components/avatar.tsx"
import { UserNickname } from "#components/user/name/nickname"
import { reatomComponent } from "@reatom/npm-react"
import { USER_URL } from "@repo/shared/constants/routes"
import { Link } from "@tanstack/react-router"

export const LandMembers = reatomComponent(({ ctx }) => {
  const land = ctx.get(landAtom)
  if (!land) return null;

  return (
    <>
      <div className="flex flex-col gap-2 w-full h-full">
        {land.members.map(({ uuid, nickname }) => (
          <div
            key={uuid}
            className="flex w-full items-end gap-2 rounded-md p-2 hover:bg-shark-700"
          >
            <Link to={USER_URL + nickname}>
              <Avatar nickname={nickname} propWidth={64} propHeight={64} />
            </Link>
            <Link to={USER_URL + nickname}>
              <UserNickname nickname={nickname} />
            </Link>
          </div>
        ))}
      </div>
    </>
  )
}, "LandMembers")