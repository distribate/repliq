import { createFileRoute, Link } from '@tanstack/react-router'
import { LatestNews } from "@repo/components/src/main-page/news/latest-news";
import { OnlineUsers } from "@repo/components/src/main-page/users/online-users";
import { LatestComments } from "@repo/components/src/main-page/comments/latest-comments";
import { MainCategoriesList } from "@repo/components/src/categories/components/main-categories-list.tsx";
import { LastRegisteredUsers } from "@repo/components/src/widgets/last-registered-users/components/last-registered-users.tsx";
import { lazy, Suspense } from 'react';
import { Skeleton } from '@repo/ui/src/components/skeleton';
import { MainCategoriesSkeleton } from '@repo/components/src/categories/components/main-categories-skeleton';
import { NotFound } from '@repo/components/src/templates/not-found';
import Inspector from "@repo/assets/images/minecraft/block_inspect.webp";
import { Typography } from '@repo/ui/src/components/typography';

import GhZwggQbMAA from "@repo/assets/images/GhZwggQbMAA-cun.webp"
import GhWLYezW0AA6co3 from "@repo/assets/images/GhWLYezW0AA6co3.webp"
import statue from "@repo/assets/images/8332de192322939.webp"

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
  notFoundComponent: () => <NotFound />,
  pendingComponent: () => <Skeleton className="w-full h-full" />,
  pendingMinMs: 500
})

type SearchWidgetProps = {
  title: string;
  imageSrc: string;
  link: string;
}

const SearchWidget = ({
  imageSrc, link, title
}: SearchWidgetProps) => {
  return (
    <Link
      to={link}
      className="flex items-center bg-shark-900/60 group overflow-hidden relative rounded-lg"
    >
      <img
        src={imageSrc}
        alt=""
        width={1920}
        height={3413}
        className="w-full h-full group-hover:scale-[1.04] transition-all duration-300 ease-in-out object-cover absolute brightness-75"
      />
      <div className="flex items-center justify-start relative w-full self-end p-4">
        <Typography className="font-semibold font-[Minecraft]" textSize="large">
          {title}
        </Typography>
      </div>
      <img
        src={Inspector}
        alt=""
        className="w-[32px] h-[32px] absolute bottom-4 right-4"
        width={32}
        height={32}
        loading="lazy"
      />
    </Link>
  )
}

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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 *:h-[160px] gap-2 w-full">
            <SearchWidget title="Найти игрока" imageSrc={statue} link="/search?type=users" />
            <SearchWidget title="Найти тред" imageSrc={GhZwggQbMAA} link="/search?type=threads" />
            <SearchWidget title="Найти территорию" imageSrc={GhWLYezW0AA6co3} link="/lands" />
          </div>
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