import { Typography } from '@repo/ui/src/components/typography'
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { Referals } from '@repo/components/src/collection/components/referals'
import { Purchases } from '@repo/components/src/collection/components/purchases'
import { MyThreads, SavedThreads } from '@repo/components/src/collection/components/threads'
import { Tickets } from '@repo/components/src/collection/components/tickets'
import { NavigationBadge } from '@repo/components/src/navigation/components/navigation-badge'

type CollectionParams = {
  type: 'threads' | 'saved_threads' | 'referals' | 'purchases' | "tickets" | 'all'
}

const ALIASES: Record<CollectionParams["type"], string> = {
  "threads": "треды",
  "saved_threads": "сохраненные треды",
  "referals": "рефералы",
  "purchases": "покупки",
  "tickets": "тикеты",
  "all": "коллекции"
}

export const Route = createFileRoute('/_protected/collection')({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "Коллекции",
      },
    ],
  }),
  validateSearch: (search) => {
    return {
      type: (search.type as CollectionParams["type"]) || 'purchases',
    }
  }
})

const CollectionMain = () => {
  const navigate = useNavigate()
  // @ts-ignore
  const type = useSearch({
    from: "/_protected/collection",
    select: (s) => s.type as CollectionParams["type"]
  })

  const changeRoute = (type: CollectionParams["type"]) => {
    navigate({ to: "/collection", search: { type } })
  }

  return (
    <div className="flex lg:flex-nowrap flex-wrap gap-2 w-full">
      <NavigationBadge isActive={type === 'purchases'} title="Покупки" onClick={() => changeRoute('purchases')}  />
      <NavigationBadge isActive={type === 'threads'} title="Треды" onClick={() => changeRoute('threads')}  />
      <NavigationBadge isActive={type === 'saved_threads'} title="Сохраненные треды" onClick={() => changeRoute('saved_threads')}  />
      <NavigationBadge isActive={type === 'referals'} title="Рефералы" onClick={() => changeRoute('referals')}  />
      <NavigationBadge isActive={type === 'tickets'} title="Тикеты" onClick={() => changeRoute('tickets')}  />
    </div>
  )
}

function RouteComponent() {
  const { type } = Route.useSearch()

  return (
    <div className="flex flex-col bg-primary-color gap-6 p-2 rounded-lg w-full h-dvh">
      <CollectionMain />
      <Typography
        textSize="very_big"
        textColor="shark_white"
        className="font-semibold"
      >
        Ваши {ALIASES[type]}
      </Typography>
      {type === 'referals' && <Referals />}
      {type === 'purchases' && <Purchases />}
      {type === 'threads' && <MyThreads />}
      {type === 'saved_threads' && <SavedThreads />}
      {type === 'tickets' && <Tickets />}
    </div>
  )
}