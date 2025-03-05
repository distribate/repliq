import { AdminNavigationBadge } from "./admin-navigation-badge.tsx";

export const AdminNavigation = () => {
  return (
    <div className="grid grid-cols-2 auto-rows-auto lg:flex lg:flex-nowrap w-full *:w-full">
      <AdminNavigationBadge title="Главная" paramValue="main" />
      <AdminNavigationBadge title="Репорты" paramValue="reports" />
      <AdminNavigationBadge title="Тикеты" paramValue="tickets" />
      <AdminNavigationBadge title="Cтатистика" paramValue="stats" />
    </div>
  );
};