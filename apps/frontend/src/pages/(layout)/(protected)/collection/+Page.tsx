import { CollectionNavigation, CollectionType, collectionTypeAtom } from '#components/collection/navigation/collection-navigation'
import { AtomState } from '@reatom/core'
import { useUpdate } from '@reatom/npm-react'
import { Typography } from '@repo/ui/src/components/typography'
import { usePageContext } from "vike-react/usePageContext"
import { navigate } from "vike/client/router"
import { reatomComponent } from "@reatom/npm-react"
import { ReactNode } from "react"
import { clientOnly } from "vike-react/clientOnly"

const MyTickets = clientOnly(() => import("#components/collection/my-tickets/components/my-tickets").then(m => m.MyTickets))
const MySavedThreads = clientOnly(() => import("#components/collection/my-saved-threads/components/my-saved-threads").then(m => m.MySavedThreads))
const MyThreads = clientOnly(() => import("#components/collection/my-threads/components/my-threads").then(m => m.MyThreads))

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
  saved_threads: <MySavedThreads />,
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

export default function Page() {
  return (
    <div className="flex flex-col items-center bg-primary-color rounded-xl p-2 sm:p-4 justify-center w-full min-h-dvh">
      <Sync />
      <div className="flex flex-col items-start gap-4 h-full w-full">
        <Typography className="page-title">
          Коллекции
        </Typography>
        <CollectionNavigation />
        <CollectionList />
      </div>
    </div>
  )
}