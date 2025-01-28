import { referalsQuery } from "#collection/queries/referals-query.ts"
import { Avatar } from "#user/components/avatar/components/avatar.tsx"
import { UserDonate } from "#user/components/donate/components/donate.tsx"
import { UserNickname } from "#user/components/name/nickname.tsx"
import { getUser } from "@repo/lib/helpers/get-user"
import { Typography } from "@repo/ui/src/components/typography"
import { Suspense } from "react"

export const Referals = () => {
  const currentUser = getUser()
  const { data: referals } = referalsQuery(currentUser.nickname)

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      {!referals && (
        <Typography
          textColor="shark_white"
          textSize="medium"
        >
          У вас нет рефералов
        </Typography>
      )}
      {referals && referals.map(item => (
        <div className="flex w-full gap-4 items-center friend-card">
          <Suspense>
            <Avatar nickname={item.recipient} propWidth={64} propHeight={64} />
          </Suspense>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <UserNickname nickname={item.recipient} />
              <UserDonate donate={item.donate} favoriteItemId={null} />
            </div>
            {item.description && (
              <Typography
                key={item.id}
                textColor="shark_white"
                textSize="medium"
              >
                {item.description}
              </Typography>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}