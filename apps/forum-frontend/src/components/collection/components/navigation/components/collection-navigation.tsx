import { NavigationBadge } from "#components/navigation/components/navigation-badge"
import { useNavigate, useSearch } from "@tanstack/react-router"

export type CollectionParams = {
  type: 'threads' | 'saved_threads' | 'referals' | 'purchases' | "tickets" | 'all'
}

export const CollectionNavigation = () => {
  const navigate = useNavigate()
  const type = useSearch({
    from: "/_protected/collection",
    select: (s) => s.type as CollectionParams["type"]
  })

  const changeRoute = (type: CollectionParams["type"]) => {
    navigate({ to: "/collection", search: { type } })
  }

  const isActive = (input: CollectionParams["type"]): "active" | "inactive" => input === type ? "active" : "inactive"

  return (
    <div className="grid grid-cols-2 bg-shark-950 auto-rows-auto rounded-xl overflow-hidden p-2 gap-2 lg:flex lg:flex-nowrap w-full *:w-full">
      <NavigationBadge data-state={isActive("purchases")} title="Покупки" onClick={() => changeRoute('purchases')} />
      <NavigationBadge data-state={isActive('threads')} title="Треды" onClick={() => changeRoute('threads')} />
      <NavigationBadge data-state={isActive('referals')} title="Рефералы" onClick={() => changeRoute('referals')} />
      <NavigationBadge data-state={isActive('tickets')} title="Тикеты" onClick={() => changeRoute('tickets')} />
      <NavigationBadge data-state={isActive('saved_threads')} title="Сохраненные треды" onClick={() => changeRoute('saved_threads')} />
    </div>
  )
}