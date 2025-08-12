import { navigationVariant } from "#components/collection/components/navigation/collection-navigation";
import { NavigationBadge } from "#components/shared/navigation/components/navigation-badge";
import { reatomComponent } from "@reatom/npm-react";
import { usePageContext } from "vike-react/usePageContext";
import { navigate } from "vike/client/router"

const NAVIGATION = [
  { title: "Главная", value: "/admin/" },
  { title: "Репорты", value: "/admin/reports" },
  { title: "Тикеты", value: "/admin/tickets" },
  { title: "Cтатистика", value: "/admin/stats" },
] as const;

const NavigationItem = reatomComponent<{ navigation: typeof NAVIGATION[number] }>(({ navigation, ctx }) => {
  const pathname = usePageContext().urlPathname;
  const isActive = pathname === navigation.value ? "active" : "inactive"

  return (
    <NavigationBadge
      title={navigation.title}
      data-state={isActive}
      onClick={() => navigate(navigation.value)}
    />
  )
}, "NavigationItem")

export const AdminNavigation = () => {
  return (
    <div className={navigationVariant()}>
      {NAVIGATION.map((navigation) => (
        <NavigationItem key={navigation.value} navigation={navigation} />
      ))}
    </div>
  );
};