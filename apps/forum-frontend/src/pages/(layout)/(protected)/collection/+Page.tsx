import { CollectionParams, collectionQueryAtom, CollectionWrapper } from '#components/collection/components/collection-wrapper/collection-wrapper'
import { NavigationBadge } from "#components/shared/navigation/components/navigation-badge"
import { AtomState } from '@reatom/core'
import { reatomComponent, useUpdate } from '@reatom/npm-react'
import { usePageContext } from "vike-react/usePageContext"
import { navigate } from "vike/client/router"

const CollectionNavigation = reatomComponent(({ ctx }) => {
  const changeRoute = (type: CollectionParams["type"]) => {
    navigate(`/collection?type=${type}`)
  }

  const isActive = (input: CollectionParams["type"]): "active" | "inactive" => {
    return input === ctx.spy(collectionQueryAtom).type ? "active" : "inactive"
  }

  return (
    <div className="flex overflow-hidden gap-2 w-full *:w-full overflow-x-auto">
      <NavigationBadge data-state={isActive('threads')} title="Треды" onClick={() => changeRoute('threads')} />
      <NavigationBadge data-state={isActive('tickets')} title="Тикеты" onClick={() => changeRoute('tickets')} />
      <NavigationBadge data-state={isActive('saved_threads')} title="Сохраненные треды" onClick={() => changeRoute('saved_threads')} />
    </div>
  )
}, "CollectionNavigation")

const Sync = () => {
  const search = usePageContext().urlParsed.search

  useUpdate((ctx) => {
    if (!search.type) {
      const { type } = ctx.get(collectionQueryAtom);
      return ctx.schedule(() => navigate(`/collection?type=${type}`))
    }

    collectionQueryAtom(ctx, search as AtomState<typeof collectionQueryAtom>)
  }, [search])

  return null;
}

export default function CollectionRouteComponent() {
  return (
    <div className="flex flex-col gap-4 rounded-lg w-full h-dvh">
      <Sync />
      <CollectionNavigation />
      <CollectionWrapper />
    </div>
  )
}