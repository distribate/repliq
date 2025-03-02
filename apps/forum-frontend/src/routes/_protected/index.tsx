import { createFileRoute } from '@tanstack/react-router'
import { LatestNews } from "#/components/layout/stats/latest-news";
import { OnlineUsers } from "#/components/layout/stats/online-users";
import { LatestComments } from "#/components/layout/stats/latest-comments";
import { MainCategoriesList } from "#components/categories/components/main-categories-list.tsx";
import { lazy } from 'react';
import { NotFound } from '#components/templates/not-found';
import { Footer } from '#components/layout/footer';
import { SearchWidget } from '#components/layout/widgets/search-widget';
import { globalPreferencesQuery } from '@repo/lib/queries/global-preferences-query';
import { LastRegUsers } from '#components/layout/stats/last-reg-users';

import GhZwggQbMAA from "@repo/assets/images/GhZwggQbMAA-cun.webp"
import GhWLYezW0AA6co3 from "@repo/assets/images/GhWLYezW0AA6co3.webp"
import statue from "@repo/assets/images/8332de192322939.webp"

const AlertWidget = lazy(() =>
  import('#components/layout/widgets/alert-widget').then(
    (m) => ({ default: m.AlertWidget }),
  ),
);

const IntroWidget = lazy(() =>
  import("#components/layout/widgets/intro-widget").then(
    (m) => ({ default: m.IntroWidget }),
  ),
);

export const Route = createFileRoute('/_protected/')({
  component: RouteComponent,
  head: () => ({
    meta: [
      { title: "Главная" }
    ]
  }),
  notFoundComponent: () => <NotFound />
})

function RouteComponent() {
  const { data: { alerts: alertsShowing, intro: introShowing } } = globalPreferencesQuery()

  return (
    <main className="flex flex-col w-full gap-2 h-full">
      {alertsShowing === 'show' && <AlertWidget />}
      <div className="flex 2xl:flex-row gap-2 flex-col w-full h-full">
        <div className="flex flex-col w-full 2xl:w-3/4 gap-2 h-full">
          {introShowing === 'show' && <IntroWidget />}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 *:h-[160px] gap-2 w-full">
            <SearchWidget title="Найти игрока" imageSrc={statue} link="/search?type=users" />
            <SearchWidget title="Найти тред" imageSrc={GhZwggQbMAA} link="/search?type=threads" />
            <SearchWidget title="Найти территорию" imageSrc={GhWLYezW0AA6co3} link="/lands" />
          </div>
          <MainCategoriesList />
          <Footer />
        </div>
        <div className="flex flex-col order-last gap-2 w-full 2xl:w-1/4 h-full">
          <LatestComments />
          <LatestNews />
          <LastRegUsers />
          <OnlineUsers />
        </div>
      </div>
    </main>
  )
}