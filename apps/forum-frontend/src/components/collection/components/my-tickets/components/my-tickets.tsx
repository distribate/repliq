import dayjs from "@repo/lib/constants/dayjs-instance"
import { Typography } from "@repo/ui/src/components/typography"
import { Skeleton } from "@repo/ui/src/components/skeleton"
import { Avatar } from "#components/user/avatar/components/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@repo/ui/src/components/dropdown-menu"
import { UserNickname } from "#components/user/name/nickname"
import { Separator } from "@repo/ui/src/components/separator"
import { myTicketsAction } from "../models/my-tickets.model"
import { CustomLink } from "#components/shared/link"
import { createIdLink } from "@repo/lib/utils/create-link"
import { reatomComponent } from "@reatom/npm-react"
import { IconCheck, IconLoader } from "@tabler/icons-react"
import { onConnect, onDisconnect } from "@reatom/framework"

onConnect(myTicketsAction.dataAtom, myTicketsAction)
onDisconnect(myTicketsAction.dataAtom, (ctx) => myTicketsAction.dataAtom.reset(ctx))

export const MyTickets = reatomComponent(({ ctx }) => {
  const data = ctx.spy(myTicketsAction.dataAtom)

  if (ctx.spy(myTicketsAction.statusesAtom).isPending) {
    return (
      <div className="flex flex-col h-full gap-4 p-4 w-full">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    )
  }

  if (!data || !data.length) {
    return (
      <div className="flex flex-col h-full items-center justify-center gap-4 p-4 w-full">
        <Typography textColor="shark_white" textSize="very_big" className="font-semibold">
          У вас нет тикетов
        </Typography>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full gap-4 w-full">
      {data?.map(ticket => (
        <div key={ticket.id} className="flex items-center justify-between gap-4 bg-shark-900 py-2 lg:py-4 px-4 lg:px-6 rounded-lg w-full h-20">
          <div className="flex items-center gap-2 lg:gap-4">
            <Avatar
              url={ticket.user_avatar}
              nickname={ticket.user_nickname}
              className="min-h-[56px] min-w-[56px]"
              propWidth={56}
              propHeight={56}
            />
            <div className="flex flex-col">
              <Typography>
                {ticket.title}
              </Typography>
              {ticket.approved_by && (
                <div className="flex items-center gap-1">
                  <IconCheck size={24} className="text-green-500" />
                  <Typography className="font-semibold text-shark-50">
                    Одобрено
                  </Typography>
                </div>
              )}
            </div>
          </div>
          {ticket.approved_by ? (
            <div className="flex flex-col lg:flex-row items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className="bg-shark-50 cursor-pointer rounded-lg py-0.5 px-2">
                    <Typography className="font-semibold text-shark-950">
                      подробнее
                    </Typography>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end">
                  <div className="flex items-center w-full flex-col p-2 gap-2">
                    <Typography>
                      Тикет #{ticket.id}
                    </Typography>
                    <Separator />
                    <div className="flex flex-col gap-2">
                      <Typography>
                        Рассмотрен:
                      </Typography>
                      <div className="flex items-center gap-2">
                        <CustomLink to={createIdLink("user", ticket.approved_by)}>
                          <Avatar url={ticket.user_avatar} nickname={ticket.approved_by} propWidth={36} propHeight={36} />
                        </CustomLink>
                        <CustomLink to={createIdLink("user", ticket.approved_by)}>
                          <UserNickname nickname={ticket.approved_by} />
                        </CustomLink>
                      </div>
                      <Typography>
                        Одобрен {dayjs(ticket.approved_at).format("DD.MM.YYYY HH:mm")}
                      </Typography>
                      <Typography>
                        Сообщение: {ticket.approved_message}
                      </Typography>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <IconLoader size={24} />
              <Typography className="font-semibold text-shark-300">
                В очереди
              </Typography>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}, "MyTickets")