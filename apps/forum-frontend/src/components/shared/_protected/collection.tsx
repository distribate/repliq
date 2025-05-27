import { CollectionNavigation } from '#components/collection/components/navigation/components/collection-navigation'
import { CollectionWrapper } from '#components/collection/components/collection-wrapper/collection-wrapper'

export function CollectionRouteComponent() {
  return (
    <div className="flex flex-col gap-4 rounded-lg w-full h-dvh">
      <CollectionNavigation />
      <CollectionWrapper />
    </div>
  )
}