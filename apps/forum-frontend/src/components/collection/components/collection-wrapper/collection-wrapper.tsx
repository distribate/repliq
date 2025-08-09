import { atom } from "@reatom/core"
import { reatomComponent } from "@reatom/npm-react"
import { Typography } from "@repo/ui/src/components/typography"
import { ReactNode } from "react"
import { clientOnly } from "vike-react/clientOnly"

const MyTickets = clientOnly(() => import("../my-tickets/components/my-tickets").then(m => m.MyTickets))
const SavedThreads = clientOnly(() => import("../my-threads/components/my-threads").then(m => m.SavedThreads))
const MyThreads = clientOnly(() => import("../my-threads/components/my-threads").then(m => m.MyThreads))

export type CollectionParams = {
  type: 'threads' | 'saved_threads' | "tickets"
}

export const collectionQueryAtom = atom<CollectionParams>({ type: "threads" }, "collectionQuery")

const ALIASES: Record<CollectionParams["type"], string> = {
  threads: "треды",
  saved_threads: "сохраненные треды",
  tickets: "тикеты",
} as const;

const COMPONENTS: Record<CollectionParams["type"], ReactNode> = {
  threads: <MyThreads />,
  saved_threads: <SavedThreads />,
  tickets: <MyTickets />
}

export const CollectionWrapper = reatomComponent(({ ctx }) => {
  const { type } = ctx.spy(collectionQueryAtom);

  return (
    <div className="flex flex-col bg-primary-color rounded-lg overflow-hidden gap-6 w-full h-full p-4">
      <Typography textSize="very_big" textColor="shark_white" className="font-semibold">
        Ваши {ALIASES[type]}
      </Typography>
      {COMPONENTS[type]}
    </div>
  )
}, "CollectionWrapper")