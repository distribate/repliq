import { Typography } from "@repo/ui/src/components/typography"
import { CollectionParams } from "../navigation/components/collection-navigation"
import { lazy, Suspense } from "react"
import { usePageContext } from "vike-react/usePageContext"

const MyTickets = lazy(() => import("../my-tickets/components/my-tickets").then(m => ({ default: m.MyTickets })))
const SavedThreads = lazy(() => import("../my-threads/components/my-threads").then(m => ({ default: m.SavedThreads })))
const MyThreads = lazy(() => import("../my-threads/components/my-threads").then(m => ({ default: m.MyThreads })))

const ALIASES: Record<CollectionParams["type"], string> = {
  threads: "треды",
  saved_threads: "сохраненные треды",
  tickets: "тикеты",
  all: "коллекции"
} as const;

export const CollectionWrapper = () => {
  const type = usePageContext().urlParsed.search.type as CollectionParams["type"]

  return (
    <div className="flex flex-col bg-primary-color rounded-lg overflow-hidden gap-6 w-full h-full p-4">
      <Typography textSize="very_big" textColor="shark_white" className="font-semibold">
        Ваши {ALIASES[type]}
      </Typography>
      <Suspense>
        {type === 'threads' && <MyThreads />}
        {type === 'tickets' && <MyTickets />}
        {type === 'saved_threads' && <SavedThreads />}
      </Suspense>
    </div>
  )
}