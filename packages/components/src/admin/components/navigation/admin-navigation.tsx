import { AdminNavigationBadge } from "./admin-navigation-badge.tsx";

export const AdminNavigation = () => {
  return (
    <div className="flex py-4 px-2 gap-3 rounded-[16px] overflow-hidden items-center w-fit">
      <AdminNavigationBadge title="Главная" paramValue="main" />
      <AdminNavigationBadge title="Конфигурации" paramValue="configs" />
      <AdminNavigationBadge title="Репорты" paramValue="reports" />
      <AdminNavigationBadge title="Тикеты" paramValue="tickets" />
      <AdminNavigationBadge title="Cтатистика" paramValue="stats" />
    </div>
  );
};
