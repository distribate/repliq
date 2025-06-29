import { MainPageSkeleton } from '#components/templates/components/main-page-skeleton';
import { NotFound } from '#components/templates/components/not-found';
import { requestedUserParamAtom } from '#components/profile/main/models/requested-user.model';
import { threadParamAtom } from '#components/thread/thread-main/models/thread.model';
import { reatomLoader } from '@repo/lib/utils/reatom/reatom-loader';
import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './root';
import { IndexRouteComponent } from '#pages/index.page';
import { PublicRouteComponent } from '#pages/public.layout';
import { RouteSkeleton } from '#components/templates/components/route-skeleton';
import { lazy, Suspense } from 'react';
import { validatePage } from './validation.model';

function lazyNamed<T extends React.ComponentType>(
  importFn: () => Promise<{ [key: string]: T }>,
  exportName: string
) {
  return lazy(() =>
    importFn().then((mod) => ({ default: mod[exportName] }))
  );
}

const ThreadRouteComponent = lazyNamed(() => import("#pages/thread.page"), "ThreadRouteComponent")
const UserRouteComponent = lazyNamed(() => import("#pages/user.page"), "UserRouteComponent")
const DevelopmentRouteComponent = lazyNamed(() => import("#pages/development.page"), "DevelopmentRouteComponent")
const RestrictRouteComponent = lazyNamed(() => import("#pages/restrict.page"), "RestrictRouteComponent")
const NotOnlineRouteComponent = lazyNamed(() => import("#pages/not-online.page"), "NotOnlineRouteComponent")
const NotExistRouteComponent = lazyNamed(() => import("#pages/not-exist.page"), "NotExistRouteComponent")
const StoreRouteComponent = lazyNamed(() => import("#pages/store.page"), "StoreRouteComponent")
const ChangelogRouteComponent = lazyNamed(() => import("#pages/changelog.page"), "ChangelogRouteComponent")
const NewsRouteComponent = lazyNamed(() => import("#pages/news.page"), "NewsRouteComponent")
const NewsLayoutRouteComponent = lazyNamed(() => import("#pages/news.page"), "NewsLayoutRouteComponent")

const publicRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: PublicRouteComponent,
  pendingComponent: () => <RouteSkeleton />,
  id: '_public',
});

export const threadRoute = createRoute({
  getParentRoute: () => publicRoute,
  component: () => <Suspense fallback={<RouteSkeleton />}><ThreadRouteComponent/></Suspense>,
  loader: reatomLoader(async (ctx, { params }) => threadParamAtom(ctx, params.id as string)),
  path: '/thread/$id',
});

export const newsLayout = createRoute({
  getParentRoute: () => publicRoute,
  component: () => <Suspense fallback={<RouteSkeleton />}><NewsLayoutRouteComponent /></Suspense>,
  id: "news"
})

export const newsRoute = createRoute({
  getParentRoute: () => newsLayout,
  component: () => <Suspense fallback={<RouteSkeleton />}><NewsRouteComponent/></Suspense>,
  path: '/news',
});

export const changeLogRoute = createRoute({
  getParentRoute: () => newsLayout,
  component: () => <Suspense fallback={<RouteSkeleton />}><ChangelogRouteComponent/></Suspense>,
  path: '/news/changelog',
});

const userRoute = createRoute({
  getParentRoute: () => publicRoute,
  component: () => <Suspense fallback={<RouteSkeleton />}><UserRouteComponent/></Suspense>,
  loader: reatomLoader(async (ctx, { params }) => requestedUserParamAtom(ctx, params.nickname as string)),
  path: '/user/$nickname',
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: IndexRouteComponent,
  beforeLoad: reatomLoader(async (ctx) => validatePage(ctx)),
  pendingComponent: () => <MainPageSkeleton />,
  notFoundComponent: () => <NotFound />,
  path: '/',
});

const developmentRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: () => <Suspense fallback={<RouteSkeleton />}><DevelopmentRouteComponent/></Suspense>,
  path: '/development',
});

const restrictRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: () => <Suspense fallback={<RouteSkeleton />}><RestrictRouteComponent/></Suspense>,
  path: '/restrict',
});

export const notExistRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: () => <Suspense fallback={<RouteSkeleton />}><NotExistRouteComponent/></Suspense>,
  path: '/not-exist',
  validateSearch: (search: Record<string, unknown>): { redirect_nickname: string } => ({
    redirect_nickname: search.redirect_nickname as string,
  })
});

const notOnlineRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/not-online',
  component: () => <Suspense fallback={<RouteSkeleton />}><NotOnlineRouteComponent/></Suspense>,
});

const storeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/store',
  component: () => <Suspense fallback={<RouteSkeleton />}><StoreRouteComponent /></Suspense>,
});

export const publicRoutes = publicRoute.addChildren([
  indexRoute,
  userRoute,
  threadRoute,
  notExistRoute,
  storeRoute,
  notOnlineRoute,
  developmentRoute,
  restrictRoute,
  newsLayout,
  newsRoute,
  changeLogRoute
]);