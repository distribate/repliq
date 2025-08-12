import { collectionTypeAtom, CollectionList } from '#components/collection/components/collection-wrapper/collection-wrapper'
import { CollectionNavigation } from '#components/collection/components/navigation/collection-navigation'
import { AtomState } from '@reatom/core'
import { useUpdate } from '@reatom/npm-react'
import { Typography } from '@repo/ui/src/components/typography'
import { usePageContext } from "vike-react/usePageContext"
import { navigate } from "vike/client/router"

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