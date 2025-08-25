import { Avatar } from "#components/user/components/avatar/components/avatar"
import { UserDonate } from "#components/user/components/donate/components/donate"
import { UserNickname } from "#components/user/components/name/nickname"
import dayjs from "@repo/shared/constants/dayjs-instance"
import { Button } from "@repo/ui/src/components/button"
import { Skeleton } from "@repo/ui/src/components/skeleton"
import { Typography } from "@repo/ui/src/components/typography"
import { myReferalsAction } from "../models/my-referals.model"
import { reatomComponent } from "@reatom/npm-react"
import { CustomLink } from "#shared/components/link"
import { createIdLink } from "#lib/create-link"
import { MINECRAFT_SITE_DOMAIN } from "@repo/shared/constants/origin-list"
import { onConnect, onDisconnect } from "@reatom/framework"

onConnect(myReferalsAction.dataAtom, myReferalsAction)
onDisconnect(myReferalsAction.dataAtom, (ctx) => myReferalsAction.dataAtom.reset(ctx))

export const Referals = reatomComponent(({ ctx }) => {
  const referals = ctx.spy(myReferalsAction.dataAtom)
  const isLoading = ctx.spy(myReferalsAction.statusesAtom).isPending

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
        <Typography textColor="shark_white" textSize="very_big" className="font-semibold" >
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
              <CustomLink to={createIdLink("user", item.recipient)}>
                <Avatar url={null} nickname={item.recipient} propWidth={64} propHeight={64} className="min-h-[64px] min-w-[64px]" />
              </CustomLink>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <CustomLink to={createIdLink("user", item.recipient)}>
                    <UserNickname nickname={item.recipient} />
                  </CustomLink>
                  {item.is_donate && <UserDonate />}
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
        <a href={`${MINECRAFT_SITE_DOMAIN}/wiki?tab=referals`} target="_blank" rel="noreferrer">
          <Button state="default">
            <Typography textSize="medium">
              Больше о реферальной системе
            </Typography>
          </Button>
        </a>
      </div>
    </div>
  )
}, "Referals")