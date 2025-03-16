import { Typography } from '@repo/ui/src/components/typography'
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { Referals } from '#components/collection/components/referals'
import { Purchases } from '#components/collection/components/purchases'
import { MyThreads, SavedThreads } from '#components/collection/components/threads'
import { Tickets } from '#components/collection/components/tickets'
import { NavigationBadge } from '#components/navigation/components/navigation-badge'

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

const CollectionNavigation = () => {
  const navigate = useNavigate()
  // @ts-ignore
  const type = useSearch({
    from: "/_protected/collection",
    select: (s) => s.type as CollectionParams["type"]
  })

  const changeRoute = (type: CollectionParams["type"]) => {
    navigate({ to: "/collection", search: { type } })
  }

  const isActive = (input: CollectionParams["type"]): "active" | "inactive" => input === type ? "active" : "inactive"

  return (
    <div className="grid grid-cols-2 bg-shark-950 auto-rows-auto rounded-xl overflow-hidden p-2 gap-2 lg:flex lg:flex-nowrap w-full *:w-full">
      <NavigationBadge data-state={isActive("purchases")} title="Покупки" onClick={() => changeRoute('purchases')} />
      <NavigationBadge data-state={isActive('threads')} title="Треды" onClick={() => changeRoute('threads')} />
      <NavigationBadge data-state={isActive('referals')} title="Рефералы" onClick={() => changeRoute('referals')} />
      <NavigationBadge data-state={isActive('tickets')} title="Тикеты" onClick={() => changeRoute('tickets')} />
      <NavigationBadge data-state={isActive('saved_threads')} title="Сохраненные треды" onClick={() => changeRoute('saved_threads')} />
    </div>
  )
}

function RouteComponent() {
  const { type } = Route.useSearch()

  return (
    <div className="flex flex-col gap-4 rounded-lg w-full h-dvh">
      <CollectionNavigation />
      <div className="flex flex-col bg-primary-color rounded-lg overflow-hidden gap-6 w-full h-full p-4">
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
        {type === 'tickets' && <Tickets />}
        {type === 'saved_threads' && <SavedThreads />}
      </div>
    </div>
  )
}