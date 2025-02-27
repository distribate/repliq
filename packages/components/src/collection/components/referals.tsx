import { referalsQuery } from "#collection/queries/referals-query.ts"
import { Avatar } from "#user/components/avatar/components/avatar.tsx"
import { UserDonate } from "#user/components/donate/components/donate.tsx"
import { UserNickname } from "#user/components/name/nickname.tsx"
import dayjs from "@repo/lib/constants/dayjs-instance"
import { getUser } from "@repo/lib/helpers/get-user"
import { USER_URL } from "@repo/shared/constants/routes"
import { Button } from "@repo/ui/src/components/button"
import { Skeleton } from "@repo/ui/src/components/skeleton"
import { Typography } from "@repo/ui/src/components/typography"
import { Link } from "@tanstack/react-router"
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
          У вас ещё нет рефералов
        </Typography>
      )}
      {referals && (
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 auto-rows-auto gap-4 w-full">
          {referals.map(item => (
            <div
              key={item.id}
              className={`flex w-full gap-2 items-center friend-card border-2 
                ${item.completed ? "border-green-500" : "border-shark-800"}`}
            >
              <Suspense fallback={<Skeleton className="h-[64px] w-[64px]" />}>
                <Link to={USER_URL + item.recipient}>
                  <Avatar nickname={item.recipient} propWidth={64} propHeight={64} className="min-h-[64px] min-w-[64px]" />
                </Link>
              </Suspense>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <Link to={USER_URL + item.recipient}>
                    <UserNickname nickname={item.recipient} />
                  </Link>
                  <UserDonate donate={item.donate} />
                </div>
                <Typography textColor="gray" textSize="medium">
                  Присоединился {dayjs(item.created_at).format("DD.MM.YYYY HH:mm")}
                </Typography>
                <Typography
                  textSize="medium"
                  className={item.completed ? "text-green-500" : "text-shark-300"}
                >
                  {item.completed ? "Завершен" : "В процессе"}
                </Typography>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="flex w-full items-center justify-start">
        <Link to="https://fasberry.su/wiki?tab=referals" target="_blank">
          <Button state="default">
            <Typography textSize="medium">
              Больше о реферальной системе
            </Typography>
          </Button>
        </Link>
      </div>
    </div>
  )
}