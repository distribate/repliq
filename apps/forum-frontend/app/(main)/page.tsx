import { MainCategoriesList } from "@repo/components/src/categories/components/main-categories-list.tsx";
import { Suspense } from "react";
import { ForumStats } from "@repo/components/src/widgets/forum-stats/components/forum-stats.tsx";
import { LastRegisteredUsers } from "@repo/components/src/widgets/last-registered-users/components/last-registered-users.tsx";
import { AlertCard } from "@repo/components/src/alert/components/alert-card.tsx";
import { getAlerts } from "@repo/lib/queries/get-alerts.ts";
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import { hasAlertsShow } from "@repo/lib/actions/has-alerts";
import { MainCategoriesSkeleton } from "@repo/components/src/categories/components/main-categories-skeleton";

const StatisticsSkeleton = () => {
  return (
    <>
      <Skeleton className="h-[260px] w-full" />
      <Skeleton className="h-[260px] w-full" />
    </>
  );
};

const Alerts = async () => {
  const hasAlertsShowing = await hasAlertsShow();

  if (!hasAlertsShowing) return null;

  const alerts = await getAlerts({ sort: "created_at", limit: 1 });

  return (
    <div className="flex flex-col gap-2 w-full">
      {alerts.map(alert => <AlertCard key={alert.id} {...alert} />)}
    </div>
  );
};

export default async function MainPage() {
  return (
    <main className="flex flex-col w-full gap-2 h-full">
      <Alerts />
      <div className="flex 2xl:flex-row gap-2 flex-col w-full h-full">
        <div className="flex flex-col w-full 2xl:w-2/3 gap-2 h-full">
          <Suspense fallback={<MainCategoriesSkeleton />}>
            <MainCategoriesList />
          </Suspense>
        </div>
        <div className="flex flex-row 2xl:flex-col order-first 2xl:order-last gap-2 w-full 2xl:w-1/3 h-full">
          <Suspense fallback={<StatisticsSkeleton />}>
            <LastRegisteredUsers />
            <ForumStats />
          </Suspense>
        </div>
      </div>
    </main>
  );
}