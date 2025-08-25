import { CollectionNavigation, CollectionType, collectionTypeAtom } from '#components/collection/components/navigation/collection-navigation'
import { AtomState } from '@reatom/core'
import { useUpdate } from '@reatom/npm-react'
import { Typography } from '@repo/ui/src/components/typography'
import { usePageContext } from "vike-react/usePageContext"
import { navigate } from "vike/client/router"
import { reatomComponent } from "@reatom/npm-react"
import { ReactNode } from "react"
import { clientOnly } from "vike-react/clientOnly"

const MyTickets = clientOnly(() => import("#components/collection/components/my-tickets/components/my-tickets").then(m => m.MyTickets))
const SavedThreads = clientOnly(() => import("#components/collection/components/my-threads/components/my-threads").then(m => m.SavedThreads))
const MyThreads = clientOnly(() => import("#components/collection/components/my-threads/components/my-threads").then(m => m.MyThreads))

const Sync = () => {
  const search = usePageContext().urlParsed.search

  useUpdate((ctx) => {
    if (!search.type) {
      const type = ctx.get(collectionTypeAtom);
      return ctx.schedule(() => navigate(`/collection?type=${type}`))
    }

    collectionTypeAtom(ctx, search.type as AtomState<typeof collectionTypeAtom>)
  }, [search])

  return null;
}

export type CollectionParams = {
  type: CollectionType
}

const COMPONENTS: Record<CollectionType, ReactNode> = {
  threads: <MyThreads />,
  saved_threads: <SavedThreads />,
  tickets: <MyTickets />
}

const CollectionList = reatomComponent(({ ctx }) => {
  const type = ctx.spy(collectionTypeAtom);

  return (
    <div className="flex items-start w-full">
      {COMPONENTS[type]}
    </div>
  )
}, "CollectionList")

export default function CollectionRouteComponent() {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-dvh">
      <Sync />
      <div className="flex flex-col items-start gap-4 h-full w-full">
        <Typography className="text-3xl font-bold">
          Коллекции
        </Typography>
        <CollectionNavigation />
        <CollectionList />
      </div>
    </div>
  )
}