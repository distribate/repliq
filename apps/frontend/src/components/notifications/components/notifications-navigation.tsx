import { NavigationBadge } from "#ui/navigation-badge"
import { notificationsTypeAtom } from "#components/notifications/models/notifications.model"
import { reatomComponent } from "@reatom/npm-react"
import { navigationVariant } from "#components/collection/navigation/collection-navigation";

const NAVIGATION = [
  { title: "Системные", value: "system", },
  { title: "Приглашения", value: "requests", },
  { title: "Новости", value: "news" }
] as const;

const NavigationItem = reatomComponent<{ navigation: typeof NAVIGATION[number] }>(({ navigation, ctx }) => {
  const isActive = navigation.value === ctx.spy(notificationsTypeAtom)

  const handle = () => notificationsTypeAtom(ctx, navigation.value)

  return (
    <NavigationBadge
      title={navigation.title}
      data-state={isActive ? "active" : "inactive"}
      onClick={handle}
    />
  )
}, "NavigationItem")

export const NotificationsNavigation = () => (
  <div className={navigationVariant()}>
    {NAVIGATION.map((navigation) => (
      <NavigationItem key={navigation.value} navigation={navigation} />
    ))}
  </div>
)