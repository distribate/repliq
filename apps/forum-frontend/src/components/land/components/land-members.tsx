import { LAND_QUERY_KEY, landQuery } from "#components/land/queries/land-query.ts"
import { Avatar } from "#components/user/avatar/components/avatar.tsx"
import { UserNickname } from "#components/user/name/components/nickname"
import { landsClient } from "@repo/shared/api/minecraft-client"
import { USER_URL } from "@repo/shared/constants/routes"
import { Skeleton } from "@repo/ui/src/components/skeleton"
import { useQueryClient } from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"
import { Suspense } from "react"
import { InferResponseType } from "hono/client"

type LandMembersProps = {
  id: string
}

const client = landsClient.lands['get-land'][':id'].$get

type Land = InferResponseType<typeof client, 200>

export const LandMembers = ({
  id
}: LandMembersProps) => {
  const qc = useQueryClient()
  const land = qc.getQueryData<Land>(LAND_QUERY_KEY(id))

  if (!land) return null;

  return (
    <>
      <div className="flex flex-col gap-2 w-full h-full">
        {land.members.map(({ uuid, nickname }) => (
          <div
            key={uuid}
            className="flex w-full items-end gap-2 rounded-md p-2 hover:bg-shark-700"
          >
            <Suspense fallback={<Skeleton className="w-[64px] h-[64px]" />}>
              <Link to={USER_URL + nickname}>
                <Avatar
                  nickname={nickname}
                  propWidth={64}
                  propHeight={64}
                />
              </Link>
            </Suspense>
            <Link to={USER_URL + nickname}>
              <UserNickname nickname={nickname} />
            </Link>
          </div>
        ))}
      </div>
    </>
  )
}