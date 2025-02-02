import { createFileRoute } from '@tanstack/react-router'
import { LatestNews } from "@repo/components/src/main-page/news/latest-news";
import { OnlineUsers } from "@repo/components/src/main-page/users/online-users";
import { LatestComments } from "@repo/components/src/main-page/comments/latest-comments";
import { MainCategoriesList } from "@repo/components/src/categories/components/main-categories-list.tsx";
import { LastRegisteredUsers } from "@repo/components/src/widgets/last-registered-users/components/last-registered-users.tsx";
import { lazy, Suspense } from 'react';
import { Skeleton } from '@repo/ui/src/components/skeleton';
import { MainCategoriesSkeleton } from '@repo/components/src/categories/components/main-categories-skeleton';
import { NotFound } from '@repo/components/src/templates/not-found';

const Alerts = lazy(() =>
  import('@repo/components/src/alert/alerts.tsx').then(
    (m) => ({ default: m.Alerts }),
  ),
);

const IntroSection = lazy(() =>
  import("@repo/components/src/intro/intro-section").then(
    (m) => ({ default: m.IntroSection }),
  ),
);

export const Route = createFileRoute('/_protected/')({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "Главная"
      }
    ]
  }),
  notFoundComponent: () =>  <NotFound />,
  pendingComponent: () => <Skeleton className="w-full h-full" />,
  pendingMinMs: 500
})

function RouteComponent() {
  return (
    <main className="flex flex-col w-full gap-2 h-full">
      <Suspense>
        <Alerts />
      </Suspense>
      <div className="flex 2xl:flex-row gap-2 flex-col w-full h-full">
        <div className="flex flex-col w-full 2xl:w-3/4 gap-2 h-full">
          <Suspense>
            <IntroSection />
          </Suspense>
          <Suspense fallback={<MainCategoriesSkeleton />}>
            <MainCategoriesList />
          </Suspense>
        </div>
        <div className="flex flex-col order-last gap-2 w-full 2xl:w-1/4 h-full">
          <Suspense fallback={<Skeleton className="h-64 w-full" />}>
            <LastRegisteredUsers />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-36 w-full" />}>
            <OnlineUsers />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-64 w-full" />}>
            <LatestComments />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-72 w-full" />}>
            <LatestNews />
          </Suspense>
        </div>
      </div>
    </main>
  )
}