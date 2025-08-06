import { NavigationBadge } from "#components/shared/navigation/components/navigation-badge";
import { atom } from "@reatom/core";
import { reatomComponent } from "@reatom/npm-react";
import { navigate } from "vike/client/router"

export type AdminSections = "reports" | "tickets" | "stats"

type AdminNavigationBadgeProps = {
  title: string;
  paramValue: AdminSections | null;
};

const adminSectionParamAtom = atom("")

const AdminNavigationBadge = reatomComponent<AdminNavigationBadgeProps>(({ ctx, title, paramValue }) => {
  const section = ctx.spy(adminSectionParamAtom)

  const handleSection = () => {
    if (!paramValue) {
      return navigate(`/admin`);
    }

    navigate(`/admin?section=${paramValue}`)
  };

  const isActive = (): "active" | "inactive" => {
    if (!paramValue && !section) return "active"
    return paramValue === section ? "active" : "inactive"
  };

  return <NavigationBadge onClick={handleSection} data-state={isActive()} title={title} />
}, "AdminNavigationBadge")

export const AdminNavigation = () => {
  return (
    <div className="grid grid-cols-2 bg-shark-950 p-2 gap-2 overflow-hidden rounded-xl auto-rows-auto lg:flex lg:flex-nowrap w-full *:w-full">
      <AdminNavigationBadge title="Главная" paramValue={null} />
      <AdminNavigationBadge title="Репорты" paramValue="reports" />
      <AdminNavigationBadge title="Тикеты" paramValue="tickets" />
      <AdminNavigationBadge title="Cтатистика" paramValue="stats" />
    </div>
  );
};