import { AdminNavigationBadge } from "./admin-navigation-badge.tsx";

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