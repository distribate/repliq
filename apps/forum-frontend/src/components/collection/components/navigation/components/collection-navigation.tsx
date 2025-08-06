import { NavigationBadge } from "#components/shared/navigation/components/navigation-badge"
import { usePageContext } from "vike-react/usePageContext"
import { navigate } from "vike/client/router"

export type CollectionParams = {
  type: 'threads' | 'saved_threads' | "tickets" | 'all'
}

export const CollectionNavigation = () => {
  const type = usePageContext().urlParsed.search.type

  const changeRoute = (type: CollectionParams["type"]) => {
    navigate(`/collection?type=${type}`)
  }

  const isActive = (input: CollectionParams["type"]): "active" | "inactive" => input === type ? "active" : "inactive"

  return (
    <div className="grid grid-cols-2 bg-shark-950 auto-rows-auto rounded-xl overflow-hidden p-2 gap-2 lg:flex lg:flex-nowrap w-full *:w-full">
      <NavigationBadge data-state={isActive('threads')} title="Треды" onClick={() => changeRoute('threads')} />
      <NavigationBadge data-state={isActive('tickets')} title="Тикеты" onClick={() => changeRoute('tickets')} />
      <NavigationBadge data-state={isActive('saved_threads')} title="Сохраненные треды" onClick={() => changeRoute('saved_threads')} />
    </div>
  )
}