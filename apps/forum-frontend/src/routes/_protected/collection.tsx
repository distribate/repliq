import { BlockWrapper } from '@repo/components/src/wrappers/block-wrapper'
import { Typography } from '@repo/ui/src/components/typography'
import { createFileRoute } from '@tanstack/react-router'
import { Referals } from '@repo/components/src/collection/components/referals'
import { Purchases } from '@repo/components/src/collection/components/purchases'
import { MyThreads, SavedThreads } from '@repo/components/src/collection/components/threads'

type CollectionParams = {
  type: 'threads' | 'saved_threads' | 'referals' | 'purchases' | 'all'
}

const ALIASES: Record<CollectionParams["type"], string> = {
  "threads": "треды",
  "saved_threads": "сохраненные треды",
  "referals": "рефералы",
  "purchases": "покупки",
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

function RouteComponent() {
  const { type } = Route.useSearch()

  return (
    <div className="flex lg:flex-row h-dvh flex-col w-full gap-2">
      <BlockWrapper className="flex flex-col gap-y-2 w-full !p-4">
        <Typography textSize="very_big" textColor="shark_white" className="font-semibold">
          Ваши {ALIASES[type]}
        </Typography>
        {type === 'referals' && <Referals />}
        {type === 'purchases' && <Purchases />}
        {type === 'threads' && <MyThreads />}
        {type === 'saved_threads' && <SavedThreads />}
      </BlockWrapper>
    </div>
  )
}