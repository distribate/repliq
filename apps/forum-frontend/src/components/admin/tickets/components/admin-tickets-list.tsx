import { Avatar } from "#components/user/avatar/components/avatar.tsx"
import { Typography } from "@repo/ui/src/components/typography"
import { ticketsResource } from "../models/tickets.model"
import { onConnect } from "@reatom/framework"
import { reatomComponent } from "@reatom/npm-react"

onConnect(ticketsResource.dataAtom, ticketsResource)

export const AdminTicketsList = reatomComponent(({ ctx }) => {
  const data = ctx.spy(ticketsResource.dataAtom)

  if (!data) return null

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      {data.map(ticket => (
        <div key={ticket.id} className="flex items-center gap-4 w-full bg-shark-900 hover:bg-shark-800 p-2 rounded-lg">
          <div className="flex items-center gap-2">
            <Avatar nickname={ticket.user_nickname} propWidth={54} propHeight={54} />
            <Typography>{ticket.user_nickname}</Typography>
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