import { Avatar } from "#components/user/components/avatar/components/avatar"
import { Typography } from "@repo/ui/src/components/typography"
import { ticketsAction } from "../models/tickets.model"
import { onConnect } from "@reatom/framework"
import { reatomComponent } from "@reatom/npm-react"
import { SectionSkeleton } from "#components/templates/components/section-skeleton"

onConnect(ticketsAction.dataAtom, ticketsAction)

export const AdminTicketsList = reatomComponent(({ ctx }) => {
  const data = ctx.spy(ticketsAction.dataAtom)

  if (ctx.spy(ticketsAction.statusesAtom).isPending) {
    return <SectionSkeleton />
  }

  if (!data) {
    return (
      <Typography className="text-2xl">
        Нет активных тикетов
      </Typography>
    )
  }

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      {data.map(ticket => (
        <div key={ticket.id} className="flex items-center gap-4 w-full bg-shark-900 hover:bg-shark-800 p-2 rounded-lg">
          <div className="flex items-center gap-2">
            <Avatar 
              url={ticket.avatar} 
              nickname={ticket.nickname}
              propWidth={54} 
              propHeight={54}
              className="min-h-12 h-12 max-h-12 aspect-square"
            />
            <Typography>{ticket.nickname}</Typography>
          </div>
          <Typography>Заголовок: {ticket.title}</Typography>
          <Typography>Описание: {ticket.description}</Typography>
          <Typography>Тип: {ticket.type}</Typography>
          <Typography>Создан: {ticket.created_at}</Typography>
        </div>
      ))}
    </div>
  )
}, "AdminTicketsList")