import { NavigationBadge } from "#ui/navigation-badge";
import { reatomComponent } from "@reatom/npm-react";
import { navigate } from "vike/client/router";
import { cva } from "class-variance-authority";
import { atom } from "@reatom/core";

export type CollectionType = 'threads' | 'saved_threads' | "tickets"

export const collectionTypeAtom = atom<CollectionType>("threads", "collectionType")

const NAVIGATION = [
  { title: "Треды", value: "threads" },
  { title: "Тикеты", value: "tickets" },
  { title: "Сохраненные треды", value: "saved_threads" },
]

const NavigationItem = reatomComponent<{ navigation: typeof NAVIGATION[number] }>(({ navigation, ctx }) => {
  const changeRoute = (type: string) => {
    navigate(`/collection?type=${type}`)
  }

  const isActive = (input: string): "active" | "inactive" => {
    return input === ctx.spy(collectionTypeAtom) ? "active" : "inactive"
  }

  return (
    <NavigationBadge
      title={navigation.title}
      data-state={isActive(navigation.value)}
      onClick={() => changeRoute(navigation.value)}
    />
  )
}, "NavigationItem")

export const navigationVariant = cva(
  "flex items-center max-h-16 h-16 gap-2 pb-1.5 overflow-x-auto [&::-webkit-scrollbar]:h-1.5 overflow-y-visible w-full"
)

export const CollectionNavigation = () => {
  return (
    <div className={navigationVariant()}>
      {NAVIGATION.map((navigation) => (
        <NavigationItem key={navigation.value} navigation={navigation} />
      ))}
    </div>
  )
}