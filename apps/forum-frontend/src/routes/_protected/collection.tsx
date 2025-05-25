import { createFileRoute } from '@tanstack/react-router'
import { CollectionNavigation, CollectionParams } from '#components/collection/components/navigation/components/collection-navigation'
import { CollectionWrapper } from '#components/collection/components/collection-wrapper/collection-wrapper'

export const DEFAULT_COLLECTION_TYPE = "purchases"

export const Route = createFileRoute('/_protected/collection')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: "Коллекции" }] }),
  validateSearch: (search: Record<string, string>): { type: CollectionParams["type"] } => ({
    type: (search.type as CollectionParams["type"]) || DEFAULT_COLLECTION_TYPE
  })
})

function RouteComponent() {
  return (
    <div className="flex flex-col gap-4 rounded-lg w-full h-dvh">
      <CollectionNavigation />
      <CollectionWrapper />
    </div>
  )
}