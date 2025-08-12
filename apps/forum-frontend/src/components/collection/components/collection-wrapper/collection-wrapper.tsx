import { atom } from "@reatom/core"
import { reatomComponent } from "@reatom/npm-react"
import { ReactNode } from "react"
import { clientOnly } from "vike-react/clientOnly"

const MyTickets = clientOnly(() => import("../my-tickets/components/my-tickets").then(m => m.MyTickets))
const SavedThreads = clientOnly(() => import("../my-threads/components/my-threads").then(m => m.SavedThreads))
const MyThreads = clientOnly(() => import("../my-threads/components/my-threads").then(m => m.MyThreads))

type CollectionType = 'threads' | 'saved_threads' | "tickets"

export type CollectionParams = {
  type: CollectionType
}

export const collectionTypeAtom = atom<CollectionType>("threads", "collectionType")

const COMPONENTS: Record<CollectionType, ReactNode> = {
  threads: <MyThreads />,
  saved_threads: <SavedThreads />,
  tickets: <MyTickets />
}

export const CollectionList = reatomComponent(({ ctx }) => {
  const type = ctx.spy(collectionTypeAtom);

  return (
    <div className="flex items-start w-full">
      {COMPONENTS[type]}
    </div>
  )
}, "CollectionList")