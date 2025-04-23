import { Avatar } from "#components/user/avatar/components/avatar.tsx"
import { Skeleton } from "@repo/ui/src/components/skeleton"
import { Typography } from "@repo/ui/src/components/typography"
import { Suspense } from "react"
import { ticketsQuery } from "../queries/tickets-query"

export const AdminTicketsList = () => {
  const { data } = ticketsQuery()

  if (!data) return null

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      {data.map(ticket => (
        <div key={ticket.id} className="flex items-center gap-4 w-full bg-shark-900 hover:bg-shark-800 p-2 rounded-lg">
          <div className="flex items-center gap-2">
            <Suspense fallback={<Skeleton className="w-[54px] h-[54px]" />}>
              <Avatar nickname={ticket.user_nickname} propWidth={54} propHeight={54} />
            </Suspense>
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
}