import { PropsWithChildren } from "react";
import { navigationVariant } from "#components/collection/navigation/collection-navigation";
import { NavigationBadge } from "#ui/navigation-badge";
import { reatomComponent } from "@reatom/npm-react";
import { usePageContext } from "vike-react/usePageContext";
import { navigate } from "vike/client/router"
import { prefetch } from 'vike/client/router'

const NAVIGATION = [
  { title: "Главная", value: "/admin" },
  { title: "Репорты", value: "/admin/reports" },
  { title: "Тикеты", value: "/admin/tickets" },
  { title: "Конфиг", value: "/admin/configs" }
] as const;

const NavigationItem = reatomComponent<{ navigation: typeof NAVIGATION[number] }>(({ navigation, ctx }) => {
  const pathname = usePageContext().urlPathname;
  const isActive = pathname === navigation.value ? "active" : "inactive"

  const handle = async () => {
    prefetch(navigation.value)
    await navigate(navigation.value)
  }

  return (
    <NavigationBadge
      title={navigation.title}
      data-state={isActive}
      onClick={handle}
    />
  )
}, "NavigationItem")

const AdminNavigation = () => {
  return (
    <div className={navigationVariant()}>
      {NAVIGATION.map((navigation) => (
        <NavigationItem key={navigation.value} navigation={navigation} />
      ))}
    </div>
  );
};

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col gap-4 rounded-lg w-full min-h-dvh">
      <AdminNavigation />
      <div className="flex flex-col bg-primary-color rounded-lg overflow-hidden gap-6 w-full p-2">
        {children}
      </div>
    </div>
  )
}