import { referalsQuery } from "#collection/queries/referals-query.ts"
import { Avatar } from "#user/components/avatar/components/avatar.tsx"
import { UserDonate } from "#user/components/donate/components/donate.tsx"
import { UserNickname } from "#user/components/name/nickname.tsx"
import { getUser } from "@repo/lib/helpers/get-user"
import { Skeleton } from "@repo/ui/src/components/skeleton"
import { Typography } from "@repo/ui/src/components/typography"
import { Suspense } from "react"

export const Referals = () => {
  const currentUser = getUser()
  const { data: referals, isLoading } = referalsQuery(currentUser.nickname)

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      {isLoading && (
        <>
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </>
      )}
      {(!referals && !isLoading) && (
        <Typography
          textColor="shark_white"
          textSize="very_big"
          className="font-semibold"
        >
          У вас нет рефералов
        </Typography>
      )}
      {referals && referals.map(item => (
        <div key={item.id} className="flex w-full gap-4 items-center friend-card">
          <Suspense>
            <Avatar nickname={item.recipient} propWidth={64} propHeight={64} />
          </Suspense>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <UserNickname nickname={item.recipient} />
              <UserDonate donate={item.donate} nickname={currentUser.nickname} />
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