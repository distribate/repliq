import { createFileRoute } from '@tanstack/react-router'
import { LatestNews } from "@repo/components/src/main-page/news/latest-news";
import { OnlineUsers } from "@repo/components/src/main-page/users/online-users";
import { LatestComments } from "@repo/components/src/main-page/comments/latest-comments";
import { MainCategoriesList } from "@repo/components/src/categories/components/main-categories-list.tsx";
import { LastRegisteredUsers } from "@repo/components/src/widgets/last-registered-users/components/last-registered-users.tsx";
import { getCookieByKey } from '@repo/lib/helpers/get-cookie-by-key';
import { Suspense } from 'react';
import { ALERTS_COOKIE_KEY } from '@repo/shared/keys/cookie';
import { IntroSection } from "@repo/components/src/intro/intro-section";
import { Alerts } from '@repo/components/src/admin/components/configs/alerts/components/alerts';

export const Route = createFileRoute('/_protected/')({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "Главная"
      }
    ]
  }),
})

function RouteComponent() {
  const hasAlertsShowing = getCookieByKey(ALERTS_COOKIE_KEY);

  return (
    <main className="flex flex-col w-full gap-2 h-full">
      {hasAlertsShowing === 'show' && <Alerts />}
      <div className="flex 2xl:flex-row gap-2 flex-col w-full h-full">
        <div className="flex flex-col w-full 2xl:w-3/4 gap-2 h-full">
          <IntroSection />
          <Suspense>
            <MainCategoriesList />
          </Suspense>
        </div>
        <div className="flex flex-col order-first 2xl:order-last gap-2 w-full 2xl:w-1/4 h-full">
          <Suspense>
            <LastRegisteredUsers />
            <OnlineUsers />
            <LatestComments />
            <LatestNews />
          </Suspense>
        </div>
      </div>
    </main>
  )
}