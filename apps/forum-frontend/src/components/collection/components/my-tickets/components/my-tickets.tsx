import FancyFeather from "@repo/assets/images/minecraft/fancy_feather.webp"
import { Typography } from "@repo/ui/src/components/typography"
import { Skeleton } from "@repo/ui/src/components/skeleton"
import { Avatar } from "#components/user/avatar/components/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@repo/ui/src/components/dropdown-menu"
import { UserNickname } from "#components/user/name/nickname"
import dayjs from "@repo/lib/constants/dayjs-instance"
import { Separator } from "@repo/ui/src/components/separator"
import { Link } from "@tanstack/react-router"
import { USER_URL } from "@repo/shared/constants/routes"
import { myTicketsResource } from "../queries/my-tickets-query"
import { reatomComponent } from "@reatom/npm-react"

export const MyTickets = reatomComponent(({ ctx }) => {
  const data = ctx.spy(myTicketsResource.dataAtom)

  if (ctx.spy(myTicketsResource.statusesAtom).isPending) {
    return (
      <div className="flex flex-col h-full gap-4 p-4 w-full">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    )
  }

  if (!data || ctx.spy(myTicketsResource.statusesAtom).isRejected) {
    return (
      <div className="flex flex-col h-full items-center justify-center gap-4 p-4 w-full">
        <img src={FancyFeather} alt="" width={96} height={96} />
        <Typography
          textColor="shark_white"
          textSize="very_big"
          className="font-semibold"
        >
          У вас нет тикетов
        </Typography>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full gap-4 w-full">
      {data?.map(ticket => (
        <div className="flex items-center justify-between gap-4 bg-shark-950 py-2 lg:py-4 px-4 lg:px-6 rounded-lg w-full h-20">
          <div className="flex items-center gap-2 lg:gap-4">
            <Avatar nickname={ticket.user_nickname} className="min-h-[56px] min-w-[56px]" propWidth={56} propHeight={56} />
            <Typography>
              {ticket.title}
            </Typography>
          </div>
          {ticket.approved_by ? (
            <div className="flex flex-col lg:flex-row items-center gap-2">
              <Typography className="font-semibold text-green-500">
                Одобрено
              </Typography>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className="bg-shark-50 text-shark-950 cursor-pointer rounded-lg py-0.5 px-2">
                    <Typography>
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
                        <Link to={USER_URL + ticket.approved_by}>
                          <Avatar nickname={ticket.approved_by} propWidth={36} propHeight={36} />
                        </Link>
                        <Link to={USER_URL + ticket.approved_by}>
                          <UserNickname nickname={ticket.approved_by} />
                        </Link>
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
            <Typography className="font-semibold text-shark-300">
              В очереди
            </Typography>
          )}
        </div>
      ))}
    </div>
  )
}, "MyTickets")