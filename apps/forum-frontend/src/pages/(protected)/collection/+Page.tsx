import { CollectionNavigation, CollectionParams } from '#components/collection/components/navigation/components/collection-navigation'
import { CollectionWrapper } from '#components/collection/components/collection-wrapper/collection-wrapper'

const DEFAULT_COLLECTION_TYPE = "purchases"

export default function CollectionRouteComponent() {
  return (
    <div className="flex flex-col gap-4 rounded-lg w-full h-dvh">
      <CollectionNavigation />
      <CollectionWrapper />
    </div>
  )
}