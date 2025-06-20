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
import { NewsLayoutRouteComponent, NewsRouteComponent } from '#pages/news.page';
import { ChangelogRouteComponent } from '#pages/changelog.page';

const ThreadRouteComponent = lazy(() => import("#pages/thread.page").then(m => ({ default: m.ThreadRouteComponent })))
const UserRouteComponent = lazy(() => import("#pages/user.page").then(m => ({ default: m.UserRouteComponent })))
const DevelopmentRouteComponent = lazy(() => import("#pages/development.page").then(m => ({ default: m.DevelopmentRouteComponent })))
const RestrictRouteComponent = lazy(() => import("#pages/restrict.page").then(m => ({ default: m.RestrictRouteComponent })))
const NotOnlineRouteComponent = lazy(() => import("#pages/not-online.page").then(m => ({ default: m.NotOnlineRouteComponent })))
const NotExistRouteComponent = lazy(() => import("#pages/not-exist.page").then(m => ({ default: m.NotExistRouteComponent })))
const StoreRouteComponent = lazy(() => import("#pages/store.page").then(m => ({ default: m.StoreRouteComponent })))

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
  component: () => <NewsLayoutRouteComponent />,
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