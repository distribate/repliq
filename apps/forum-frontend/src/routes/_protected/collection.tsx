import { BlockWrapper } from '@repo/components/src/wrappers/block-wrapper'
import { Typography } from '@repo/ui/src/components/typography'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Referals } from '@repo/components/src/collection/components/referals'
import { Purchases } from '@repo/components/src/collection/components/purchases'
import { MyThreads, SavedThreads } from '@repo/components/src/collection/components/threads'
import { Tickets } from '@repo/components/src/collection/components/tickets'
import { Button } from '@repo/ui/src/components/button'

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
      type: (search.type as CollectionParams["type"]) || 'all',
    }
  }
})

const CollectionMain = () => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-2 w-full h-full">
      <Button
        state="default"
        onClick={() => navigate({ to: "/collection", search: { type: 'saved_threads' } })}
        className="w-fit px-6"
      >
        <Typography textSize="medium">
          Сохраненные треды
        </Typography>
      </Button>
      <Button
        state="default"
        onClick={() => navigate({ to: "/collection", search: { type: 'purchases' } })}
        className="w-fit px-6"
      >
        <Typography textSize="medium">
          Покупки
        </Typography>
      </Button>
      <Button
        state="default"
        onClick={() => navigate({ to: "/collection", search: { type: 'threads' } })}
        className="w-fit px-6"
      >
        <Typography textSize="medium">
          Треды
        </Typography>
      </Button>
      <Button
        state="default"
        onClick={() => navigate({ to: "/collection", search: { type: 'referals' } })}
        className="w-fit px-6"
      >
        <Typography textSize="medium">
          Рефералы
        </Typography>
      </Button>
    </div>
  )
}

function RouteComponent() {
  const { type } = Route.useSearch()
  const navigate = useNavigate()

  return (
    <div className="flex lg:flex-row h-dvh flex-col w-full gap-2">
      <BlockWrapper className="flex flex-col gap-y-2 w-full !p-4">
        {type !== 'all' && (
          <>
            <Button
              state="default"
              onClick={() => navigate({ to: "/collection", search: { type: 'all' } })}
              className="w-fit px-6"
            >
              <Typography textSize="medium">
                Назад
              </Typography>
            </Button>
            <Typography
              textSize="very_big"
              textColor="shark_white"
              className="font-semibold"
            >
              Ваши {ALIASES[type]}
            </Typography>
          </>
        )}
        {type === 'all' && <CollectionMain />}
        {type === 'referals' && <Referals />}
        {type === 'purchases' && <Purchases />}
        {type === 'threads' && <MyThreads />}
        {type === 'saved_threads' && <SavedThreads />}
        {type === 'tickets' && <Tickets />}
      </BlockWrapper>
    </div>
  )
}